import axios from "axios";
import type { agentParams, agentResponse } from "../types/conversation.ts";
import type { policyRespones } from "../types/policy.ts";
import type { AxiosResponse } from "axios";
process.loadEnvFile();
const agentUrl = process.env.AGENT_URL;

export const callAgent = async (
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

export const updateVectorEmbeddings = async (
  policy_id: string,
  title: string,
  content: string,
): Promise<AxiosResponse<{ message: string }> | undefined> => {
  if (!agentUrl) {
    console.log("No agent URL provided");
    return undefined;
  } else {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.post(
        `${agentUrl}/update_policy`,
        {
          policy_id: policy_id,
          title: title,
          content: content,
        },
      );
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
};
