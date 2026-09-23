import axios from "axios";
import type { agentParams, agentResponse } from "../types/conversation.ts";
import type { AxiosResponse } from "axios";
process.loadEnvFile();
const agentUrl = process.env.AGENT_URL;

export const callAgent = async (chat: agentParams): Promise<agentResponse> => {
  if (!agentUrl) {
    throw new Error("AGENT_URL is not configured");
  } else {
    try {
      const response = await axios.post(`${agentUrl}/chat`, {
        conversation_id: chat.conversation_id,
        customer_id: chat.customer_id,
        message: chat.message,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
};

export const createVectorEmbeddings = async (
  policy_id: string,
  title: string,
  content: string,
): Promise<AxiosResponse<{ message: string }>> => {
  if (!agentUrl) {
    throw new Error("AGENT_URL is not configured");
  } else {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.post(
        `${agentUrl}/create_policy`,
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

export const updateVectorEmbeddings = async (
  policy_id: string,
  title: string,
  content: string,
): Promise<AxiosResponse<{ message: string }>> => {
  if (!agentUrl) {
    throw new Error("AGENT_URL is not configured");
  } else {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.put(
        `${agentUrl}/${policy_id}`,
        {
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

export const deleteVectorEmbeddings = async (
  policy_id: string,
): Promise<AxiosResponse<{ message: string }>> => {
  if (!agentUrl) {
    throw new Error("AGENT_URL is not configured");
  } else {
    try {
      const response: AxiosResponse<{ message: string }> = await axios.delete(
        `${agentUrl}/${policy_id}`,
      );
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
};
