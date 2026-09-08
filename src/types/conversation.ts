export type message = {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

export type convo = {
  conversation_id?: string;
  customer_id: string;
  message: message;
  escalated?: { type: boolean; default: true };
};

export type ConversationResponse = {
  conversation_id: string;
  customer_id: string;
  messages: {
    role: "assistant" | "user";
    content: string;
    timestamp: Date;
  }[];
  escalated: boolean;
  created_at: Date;
  update_at: Date;
};

export type agentResponse = {
  reply: string;
  escalated: boolean;
};

export type agentParams = {
  conversation_id: string;
  customer_id: string;
  message: string;
};
