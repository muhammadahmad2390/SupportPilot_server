import type { Request, Response } from "express";
import type { policy, policyResponse } from "../types/policy.ts";
import {
  Policy,
  validatePolicy,
  validatePolicyUpdate,
} from "../models/policy.model.ts";
import {
  deleteVectorEmbeddings,
  updateVectorEmbeddings,
} from "../services/agent.service.ts";
import _ from "underscore";
import slugify from "slugify";

export const createPolicy = async (
  req: Request<{}, {}, policy>,
  res: Response<policyResponse | string>,
) => {
  const { error } = validatePolicy(req.body);
  if (error) return res.status(400).send(error.message);

  const slug = slugify(req.body.title, { lower: true, strict: true });
  if (!slug)
    return res
      .status(400)
      .send("Title must contain at least one letter or number");

  try {
    const newPolicy = await Policy.create({ ...req.body, slug });

    try {
      await updateVectorEmbeddings(
        newPolicy.slug,
        newPolicy.title,
        newPolicy.content,
      );
    } catch (err) {
      await Policy.findByIdAndDelete(newPolicy._id);
      console.error("Policy sync failed, rolled back:", err);
      return res.status(502).send("Failed to sync policy to search index");
    }
    res.status(201).json(newPolicy);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return res.status(409).send("Title too similar to an existing policy");
    }
    return res.status(500).send("Failed to create policy");
  }
};

export const updatePolicy = async (
  req: Request<{ slug: string }, {}, policy>,
  res: Response<policyResponse | string>,
) => {
  if (!req.params.slug) return res.status(400).send("No slug provided.");

  const { error } = validatePolicyUpdate(req.body);
  if (error) return res.status(400).send(error.message);

  let result;
  try {
    result = await Policy.findOneAndUpdate(
      { slug: req.params.slug },
      {
        ...req.body,
        updatedAt: new Date(),
      },
    );

    if (!result) return res.status(404).send("Policy not found");
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return res.status(409).send("A policy with this slug already exists");
    }
    return res.status(500).send("Failed to update policy");
  }
  // -------------------vector store updation----------------------------
  try {
    await updateVectorEmbeddings(
      req.params.slug,
      req.body.title,
      req.body.content,
    );
  } catch (syncErr) {
    const oldPolicy = _.pick(result, [
      "title",
      "content",
      "category",
      "updatedBy",
    ]);
    await Policy.findOneAndUpdate({ slug: req.params.slug }, oldPolicy);
    console.error("Policy sync failed, rolled back:", syncErr);
    return res.status(502).send("Failed to sync policy to search index");
  }
  const updated = _.pick(req.body, [
    "title",
    "content",
    "category",
    "updatedBy",
  ]);
  res.status(200).json({ ...updated, slug: req.params.slug });
};
export const deletePolicy = async (
  req: Request<{ slug: string }>,
  res: Response<string>,
) => {
  if (!req.params.slug) return res.status(400).send("No slug provided");

  let policy;
  try {
    policy = await Policy.findOne({ slug: req.params.slug });
    if (!policy) return res.status(404).send("Policy not found");
  } catch (err) {
    return res.status(500).send("Failed to fetch policy");
  }

  try {
    await deleteVectorEmbeddings(req.params.slug);
  } catch (err) {
    console.error("Vector delete failed:", err);
    return res.status(502).send("Failed to delete policy from search index");
  }

  try {
    await Policy.findOneAndDelete({ slug: req.params.slug });
  } catch (err) {
    // vectors are already gone — resync from the doc we fetched, to avoid
    // leaving an un-searchable policy still sitting in Mongo
    await updateVectorEmbeddings(
      policy.slug,
      policy.title,
      policy.content,
    ).catch(() => {});
    console.error("Mongo delete failed after vector delete:", err);
    return res.status(500).send("Failed to delete policy");
  }

  res.status(200).send("Policy deleted");
};

// get all
export const getPolicies = async (
  req: Request,
  res: Response<policyResponse[] | string>,
) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).send("Failed to fetch policies");
  }
};

// get one
export const getPolicy = async (
  req: Request<{ slug: string }>,
  res: Response<policyResponse | string>,
) => {
  if (!req.params.slug) return res.status(400).send("Slug not provided");

  try {
    const policy = await Policy.findOne({ slug: req.params.slug });
    if (!policy) return res.status(404).send("Policy not found");
    res.status(200).json(policy);
  } catch (err) {
    res.status(500).send("Failed to fetch policy");
  }
};
