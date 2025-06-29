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
import { Id } from "@/convex/_generated/dataModel";

export const useAgent = ({
  isnewchat,
  chatId,
  agentId,
}: {
  isnewchat: boolean;
  chatId: string;
  agentId: Id<"agent">;
}) => {
  const user = useQuery(api.function.users.currentUser);
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

  const createAgentChatByChatId = useMutation(
    api.function.chats.createAgentChatByChatId,
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
    api: "/api/agent",
    body: {
      chatId,
      agentId,
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
            attachments: message.experimental_attachments,
            parts: message.parts,
            modelUsed: message.modelUsed,
            updatedAt: message.updatedAt,
            annotations: message.annotations,
          })),
        );
      }
    }
  }, [getMessages, isnewchat, setMessages]);

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
          // Navigate to agent chat URL
          window.history.replaceState({}, "", `/agent/${agentId}/${chatId}`);
          // Wait for chat creation to complete before submitting message
          await createAgentChatByChatId({
            userId: user._id,
            chatId,
            agentId,
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
      agentId,
      user,
      createAgentChatByChatId,
      onLoginModalOpen,
      input,
      setInput,
      setSearch,
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
            window.history.replaceState({}, "", `/agent/${agentId}/${chatId}`);
            // Wait for chat creation to complete before submitting message
            await createAgentChatByChatId({
              userId: user._id,
              chatId,
              agentId,
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
      agentId,
      user,
      createAgentChatByChatId,
      onLoginModalOpen,
      setInput,
      setSearch,
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
