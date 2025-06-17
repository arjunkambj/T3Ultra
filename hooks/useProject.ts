import { useChat } from "@ai-sdk/react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { api } from "@/convex/_generated/api";

export const useProject = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/project",
    body: {
      projectId: "123",
      chatId: "123",
    },
  });
  const user = useQuery(api.function.users.currentUser);
};
