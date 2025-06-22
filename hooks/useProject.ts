import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { addToast } from "@heroui/toast";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useDisclosure } from "@heroui/modal";
import { useAtom } from "jotai";

import { aiModelAtom } from "@/atoms/aimodel";
import { searchAtom } from "@/atoms/searchState";
import { api } from "@/convex/_generated/api";

export const useProject = ({
  isnewchat,
  chatId,
  projectId,
}: {
  isnewchat: boolean;
  chatId: string;
  projectId: string;
}) => {
  const user = useQuery(api.function.users.currentUser);
  const [currentModelId] = useAtom(aiModelAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useAtom(searchAtom);
  const {
    isOpen: isLoginModalOpen,
    onOpen: onLoginModalOpen,
    onOpenChange: onLoginModalOpenChange,
  } = useDisclosure();

  const getMessages = useQuery(api.function.messages.getMessagesByChatId, {
    chatId,
  });

  const createProjectChat = useMutation(
    api.function.chats.createProjectChatByChatId,
  );

  const {
    messages,
    setMessages,
    input,
    setInput,
    stop,
    reload,
    handleInputChange,
    handleSubmit,
    status,
    experimental_resume,
  } = useChat({
    api: "/api/project",
    body: {
      chatId,
      projectId,
      userId: user?._id,
      modelId: currentModelId,
      search,
    },
  });

  useEffect(() => {
    // Only show loading for existing chats when we're waiting for messages
    if (!isnewchat && !getMessages) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      // Set messages for existing chats
      if (getMessages && !isnewchat && messages.length === 0) {
        setMessages(
          getMessages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        );
      }
    }
  }, [getMessages, isnewchat, setMessages]);

  // Reset messages when starting a new chat (project overview)
  useEffect(() => {
    if (isnewchat) {
      setMessages([]);
      setInput("");
    }
  }, [isnewchat, chatId, setMessages, setInput]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;

      if (!user) {
        onLoginModalOpen();
        setInput("");

        return;
      }

      try {
        if (isnewchat) {
          // Navigate to project chat URL
          window.history.replaceState(
            {},
            "",
            `/project/${projectId}/${chatId}`,
          );
          // Wait for chat creation to complete before submitting message
          await createProjectChat({
            userId: user._id,
            chatId,
            projectId,
          });
        }

        handleSubmit();
        setSearch(false);
      } catch (error) {
        void error;
        addToast({
          title: "Error",
          description: "Something went wrong",
          color: "danger",
          timeout: 1500,
        });
      }
    },
    [
      handleSubmit,
      isnewchat,
      chatId,
      projectId,
      user,
      createProjectChat,
      onLoginModalOpen,
    ],
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!user) {
          onLoginModalOpen();
          setInput("");

          return;
        }

        try {
          if (isnewchat && user) {
            window.history.replaceState(
              {},
              "",
              `/project/${projectId}/${chatId}`,
            );
            // Wait for chat creation to complete before submitting message
            await createProjectChat({
              userId: user._id,
              chatId,
              projectId,
            });
          }
          handleSubmit();
          setSearch(false);
        } catch (error) {
          void error;
          addToast({
            title: "Error",
            description: "Something went wrong",
            color: "danger",
          });
        }
      }
    },
    [
      handleSubmit,
      isnewchat,
      chatId,
      projectId,
      user,
      createProjectChat,
      onLoginModalOpen,
    ],
  );

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    onSubmit,
    handleKeyDown,
    status,
    stop,
    reload,
    experimental_resume,
    loadingUser: !user,
    loadingMessages: !isnewchat && !getMessages,
    isLoading,
    isLoginModalOpen,
    onLoginModalOpenChange,
    onLoginModalOpen,
  };
};
