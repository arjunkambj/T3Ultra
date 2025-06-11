import { useChat } from "@ai-sdk/react";

export const useAI = () => {
  const {
    messages,
    input,
    handleInputChange,
    setInput,
    handleSubmit,
    status,
    experimental_resume,
    stop,
  } = useChat({
    api: "/api/chat",
    maxSteps: 5,
  });

  return {
    messages,
    input,
    handleInputChange,
    setInput,
    handleSubmit,
    status,
    experimental_resume,
    stop,
  };
};
