export type message = {
  role: "system" | "user";
  content: string;
  timestamp: Date;
};

export type convo = {
  conversation_id: string;
  customer_id: string;
  messages: message[];
  escalated?: { type: boolean; default: true };
};
