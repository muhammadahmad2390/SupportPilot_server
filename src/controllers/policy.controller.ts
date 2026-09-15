import type { Request, Response } from "express";
import type { policy, policyResponse } from "../types/policy.ts";
import {
  Policy,
  validatePolicy,
  validatePolicyUpdate,
} from "../models/policy.model.ts";
import { updateVectorEmbeddings } from "../services/agent.service.ts";
import _ from "underscore";

export const createPolicy = async (
  req: Request<{}, {}, policy>,
  res: Response<policyResponse | string>,
) => {
  const { error } = validatePolicy(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const newPolicy = await Policy.create(req.body);

    try {
      await updateVectorEmbeddings(
        newPolicy.slug,
        newPolicy.title,
        newPolicy.content,
      );
    } catch (err) {
      await Policy.findByIdAndDelete(newPolicy._id);
      return res.status(500).send("Failed to create policy");
    }
    res.status(201).json(newPolicy);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return res.status(409).send("A policy with this slug already exists");
    }
    return res.status(500).send("Failed to create policy");
  }
};

export const updatePolicy = async (
  req: Request<{ id: string }, {}, policy>,
  res: Response<policyResponse | string>,
) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send("Invalid id");

  const { error } = validatePolicyUpdate(req.body);
  if (error) return res.status(400).send(error.message);
  let result;
  try {
    result = await Policy.findByIdAndUpdate(req.params.id, req.body);
    if (!result) return res.status(404).send("Policy not found");
    const updated = _.pick(req.body, [
      "title",
      "slug",
      "content",
      "category",
      "updatedBy",
    ]);
    res.status(200).json(updated);
  } catch (err) {
    const oldPolicy = _.pick(result, [
      "title",
      "slug",
      "content",
      "category",
      "updatedBy",
    ]);
    await Policy.findByIdAndUpdate(req.params.id, oldPolicy ? oldPolicy : {});
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return res.status(409).send("A policy with this slug already exists");
    }
    return res.status(500).send("Failed to update policy");
  }
};

export const deletePolicy = async (
  req: Request<{ id: string }>,
  res: Response<string>,
) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send("Invalid id");

  try {
    const deleted = await Policy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Policy not found");
    res.status(200).send("Policy deleted");
  } catch (err) {
    return res.status(500).send("Failed to delete policy");
  }
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
  req: Request<{ id: string }>,
  res: Response<policyResponse | string>,
) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send("Invalid id");

  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).send("Policy not found");
    res.status(200).json(policy);
  } catch (err) {
    res.status(500).send("Failed to fetch policy");
  }
};
