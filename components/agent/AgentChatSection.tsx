"use client";

import { Spinner } from "@heroui/spinner";
import { cn } from "@heroui/theme";
import { useQuery } from "convex-helpers/react/cache/hooks";

import TopMenuBar from "../chat/TopMenuBar";
import MessageUI from "../chat/MessageUI";
import LoginModel from "../auth/LoginModel";
import ShareModel from "../chat/ShareModel";

import ChatInput from "./ChatInput";

import { api } from "@/convex/_generated/api";
import { useAgent } from "@/hooks/useAgent";
import { Id } from "@/convex/_generated/dataModel";

interface AgentChatSectionProps {
  agentId: Id<"agent">;
  chatId: string;
  isAgentOverview: boolean;
  isnewchat: boolean;
}

export default function AgentChatSection({
  chatId,
  isAgentOverview,
  isnewchat,
  agentId,
}: AgentChatSectionProps) {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    onSubmit,
    handleKeyDown,
    status,
    isLoading,
    isLoginModalOpen,
    onLoginModalOpenChange,
    onLoginModalOpen,
    stop,
    reload,
  } = useAgent({ isnewchat, chatId, agentId });

  const agent = useQuery(api.function.agent.getAgentById, {
    agentId,
  });

  const hasMessages = messages.length > 0 ? true : false;

  // Early return after all hooks have been called
  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );
  }

  return (
    <>
      {hasMessages && <ShareModel chatId={chatId} />}
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center",
        )}
      >
        {!hasMessages && isAgentOverview ? (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0F0F10] px-3">
            <TopMenuBar />
            <div className="mb-16 flex h-full w-full max-w-3xl flex-col items-center justify-center gap-12 pb-20">
              <div className="text-center">
                <h1 className="text-2xl font-bold">{agent?.name}</h1>
                <p className="mt-2 text-neutral-400">{agent?.description}</p>
              </div>

              <ChatInput
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                input={input}
                isLoading={isLoading}
                isnewchat={isnewchat}
                setInput={setInput}
                status={status}
                stop={stop}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0F0F10]">
            <TopMenuBar />
            <div className="flex h-full w-full flex-col items-center justify-center">
              {/* TODO: Implement AgentChatSection component similar to ChatSection */}
              <div className="flex h-[calc(100dvh-160px)] w-full flex-col items-center justify-center overflow-y-auto px-3">
                <MessageUI
                  chatId={chatId}
                  isShared={false}
                  messages={messages}
                  reload={reload}
                  status={status}
                />
              </div>
            </div>

            <div className="w-full max-w-3xl px-3 pb-8">
              <ChatInput
                handleInputChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                input={input}
                isLoading={isLoading}
                isnewchat={isnewchat}
                setInput={setInput}
                status={status}
                stop={stop}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        )}
      </div>
      <LoginModel
        isOpen={isLoginModalOpen}
        onOpen={onLoginModalOpen}
        onOpenChange={onLoginModalOpenChange}
      />
    </>
  );
}
