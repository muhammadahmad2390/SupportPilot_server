import type { Request, Response } from "express";
import {
  Conversation,
  validateConversation,
} from "../models/conversation.model.ts";
import callAgent from "../services/agent.service.ts";
import type { convo } from "../types/conversation.ts";
import { v4 as uuid } from "uuid";

const chat = async (
  req: Request<{}, unknown, convo>,
  res: Response<
    | { reply: string; escalated: boolean; conversation_id: string }
    | { message: string }
  >,
) => {
  const conversation = req.body;
  const { error } = validateConversation(conversation);
  if (error) return res.status(400).json({ message: error.message });
  try {
    let conversationId = req.body.conversation_id;

    if (!conversationId) {
      conversationId = uuid();
      await Conversation.create({
        conversation_id: conversationId,
        customer_id: req.body.customer_id,
        messages: [
          {
            role: "user",
            content: req.body.message.content,
            timestamp: new Date(),
          },
        ],
      });
    } else {
      const result = await Conversation.findOneAndUpdate(
        { conversation_id: conversationId },
        {
          $push: {
            messages: {
              role: "user",
              content: req.body.message.content,
              timestamp: new Date(),
            },
          },
        },
      );

      if (!result) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }
    }

    const agentResponse = await callAgent({
      conversation_id: conversationId,
      customer_id: req.body.customer_id,
      message: req.body.message.content,
    });
    console.log(agentResponse);

    if (!agentResponse)
      return res.status(500).json({ message: "Failed to call the agent" });

    const updatedConversation = await Conversation.findOneAndUpdate(
      { conversation_id: conversationId },
      {
        $push: {
          messages: {
            role: "assistant",
            content: agentResponse.reply,
            timestamp: new Date(),
          },
        },
        $set: { escalated: agentResponse.escalated },
      },
    );

    if (!updatedConversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.json({
      reply: agentResponse.reply,
      escalated: agentResponse.escalated,
      conversation_id: conversationId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default chat;
