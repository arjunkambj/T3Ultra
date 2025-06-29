import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { addToast } from "@heroui/toast";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useDisclosure } from "@heroui/modal";
import { useAtom } from "jotai";

import { attachmentAtom } from "@/atoms/attachment";
import { aiModelAtom } from "@/atoms/aimodel";
import { searchAtom } from "@/atoms/searchState";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { useUserContext } from "@/hooks/useUserContext";

export const useAI = ({
  isnewchat,
  chatId,
}: {
  isnewchat: boolean;
  chatId: string;
}) => {
  const user = useUser();
  const { systemPromptData } = useUserContext(user?._id);
  const [currentModelId] = useAtom(aiModelAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useAtom(searchAtom);
  const [attachments, setAttachments] = useAtom(attachmentAtom);
  const {
    isOpen: isLoginModalOpen,
    onOpen: onLoginModalOpen,
    onOpenChange: onLoginModalOpenChange,
  } = useDisclosure();

  const getMessages = useQuery(api.function.messages.getMessagesByChatId, {
    chatId,
  });

  const createChat = useMutation(api.function.chats.createChatByChatId);

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
    api: "/api/chat",
    body: {
      chatId,
      userId: user?._id,
      modelId: currentModelId,
      isSearchEnabled: search,
      systemPromptData,
    },
  });

  useEffect(() => {
    // Set messages for existing chats when they load
    if (getMessages && !isnewchat && messages.length === 0) {
      setMessages(
        getMessages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          attachments: message.experimental_attachments,
          parts: message.parts,
          modelUsed: message.modelUsed,
          updatedAt: message.updatedAt,
          annotations: message.annotations,
        })),
      );
    }

    // Update loading state
    setIsLoading(!isnewchat && !getMessages);
  }, [getMessages, isnewchat, messages.length, setMessages]);

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
        // Create chat first for new chats to avoid race conditions
        if (isnewchat) {
          window.history.replaceState({}, "", `/chat/${chatId}`);
          await createChat({
            userId: user._id,
            chatId,
          });
        }

        handleSubmit(e, {
          experimental_attachments: attachments,
        });
        setSearch(false);
        setAttachments([]);
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
      user,
      createChat,
      onLoginModalOpen,
      input,
      attachments,
      setSearch,
      setAttachments,
      setInput,
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
          // Create chat first for new chats to avoid race conditions
          if (isnewchat && user) {
            window.history.replaceState({}, "", `/chat/${chatId}`);
            await createChat({
              userId: user._id,
              chatId,
            });
          }
          handleSubmit(e, {
            experimental_attachments: attachments,
          });
          setSearch(false);
          setAttachments([]);
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
      user,
      createChat,
      onLoginModalOpen,
      attachments,
      setSearch,
      setAttachments,
      setInput,
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
