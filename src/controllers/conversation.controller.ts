import type { Response, Request } from "express";
import { Conversation } from "../models/conversation.model.ts";
import type { ConversationResponse } from "../types/conversation.ts";

export const getConversations = async (
  req: Request<{}, {}, {}, { escalated?: string }>,
  res: Response<ConversationResponse[]>,
) => {
  const filter = req.query.escalated === "true" ? { escalated: true } : {};
  const escalatedConversations = await Conversation.find(filter)
    .select("-_id -__v")
    .lean<ConversationResponse[]>();
  res.json(escalatedConversations);
};

export const getConversation = async (
  req: Request<{ id: string }>,
  res: Response<ConversationResponse | { message: string }>,
) => {
  const conversation = await Conversation.findOne({
    conversation_id: req.params.id,
  })
    .select("-_id -__v")
    .lean<ConversationResponse>();
  if (!conversation)
    return res
      .status(404)
      .json({ message: "Conversation with this id not found." });

  res.json(conversation);
};
