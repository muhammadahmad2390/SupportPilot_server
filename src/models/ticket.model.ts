import joi from "joi";
import mongoose, { Schema } from "mongoose";
import type { ticketsFilter, ticketStatusUpdate } from "../types/ticket.ts";

const ticketSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true },
  customer_id: { type: String, required: true },
  issue: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "resolved", "escalated"],
    required: true,
  },
  created_at: { type: Date, required: true },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);

export const validateUpdateTicketStatus = (body: ticketStatusUpdate) => {
  const schema = joi.object({
    status: joi.string().valid("open", "resolved", "escalated").required(),
  });
  return schema.validate(body);
};
