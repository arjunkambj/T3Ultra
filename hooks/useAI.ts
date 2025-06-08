import { useChat } from "@ai-sdk/react";

export const useAI = () => {
  const { messages, input, handleInputChange, setInput, handleSubmit } =
    useChat({
      api: "/api/chat",
    });

  return { messages, input, handleInputChange, setInput, handleSubmit };
};
