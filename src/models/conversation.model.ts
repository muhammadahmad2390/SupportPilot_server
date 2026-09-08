import mongoose from "mongoose";
import joi from "joi";
import type { convo } from "../types/conversation.ts";

const conversationSchema: mongoose.Schema = new mongoose.Schema({
  conversation_id: { type: String, unique: true, required: true },
  customer_id: { type: String, required: true },
  messages: {
    type: [
      {
        role: { type: String, enum: ["assistant", "user"] },
        content: { type: String, maxLength: 500 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    required: true,
  },
  escalated: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

export const validateConversation = (body: convo) => {
  const schema = joi.object({
    conversation_id: joi.string().optional().allow(null, ""),
    customer_id: joi.string().required(),
    message: joi
      .object({
        role: joi.string().valid("assistant", "user").required(),
        content: joi.string().max(500).required(),
        timestamp: joi.date(),
      })
      .required(),
  });
  return schema.validate(body);
};

export const Conversation = mongoose.model("Conversation", conversationSchema);
