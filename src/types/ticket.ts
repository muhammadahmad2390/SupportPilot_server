import { extendOwn } from "underscore";
import { Types } from "mongoose";

export type ticketsFilter = {
  status?: "open" | "resolved" | "escalated";
};

export type ticketStatusUpdate = {
  status: "open" | "resolved" | "escalated";
};
export type ticket = {
  _id: Types.ObjectId;
  conversation_id: String;
  customer_id: String;
  issue: String;
  aiSummary: String;
  status: "open" | "resolved" | "escalated";
  created_at: Date;
};
