import joi from "joi";
import type { policy } from "../types/policy.ts";
import mongoose from "mongoose";

const objectId = joi
  .string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("Invalid id");

const base = {
  title: joi.string().required(),
  content: joi.string().required(),
  category: joi
    .string()
    .valid("returns", "shipping", "warranty", "faq", "technical", "internal")
    .required(),
  updatedBy: joi.string().required(),
};

export const validatePolicy = (policy: policy) =>
  joi.object(base).validate(policy);

export const validatePolicyUpdate = (policy: policy) =>
  joi.object({ id: objectId.required(), ...base }).validate(policy);

const policySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["returns", "shipping", "warranty", "faq", "technical", "internal"],
    required: true,
  },
  updatedBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const Policy = mongoose.model("Policy", policySchema);
