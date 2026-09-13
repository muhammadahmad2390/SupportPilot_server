import axios from "axios";
import type { agentParams, agentResponse } from "../types/conversation.ts";
process.loadEnvFile();
const agentUrl = process.env.AGENT_URL;

const callAgent = async (
  chat: agentParams,
): Promise<agentResponse | undefined> => {
  if (agentUrl) {
    try {
      const response = await axios.post(`${agentUrl}/chat`, {
        conversation_id: chat.conversation_id,
        customer_id: chat.customer_id,
        message: chat.message,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  } else {
    console.log("No agent URL provided");
    return undefined;
  }
};

export default callAgent;
