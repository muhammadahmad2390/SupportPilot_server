import type { Request, Response } from "express";
import type { policy, policyRespones } from "../types/policy.ts";
import {
  Policy,
  validatePolicy,
  validatePolicyUpdate,
} from "../models/policy.model.ts";

export const createPolicy = async (
  req: Request<{}, {}, policy>,
  res: Response<policyRespones | string>,
) => {
  const { error } = validatePolicy(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const newPolicy = await Policy.create(req.body);
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
  res: Response<policyRespones | string>,
) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send("Invalid id");

  const { error } = validatePolicyUpdate(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const updated = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).send("Policy not found");
    res.status(200).json(updated);
  } catch (err) {
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
  res: Response<policyRespones[] | string>,
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
  res: Response<policyRespones | string>,
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
