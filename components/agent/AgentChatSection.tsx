"use client";

import { Spinner } from "@heroui/spinner";
import { cn } from "@heroui/theme";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Icon } from "@iconify/react";

import TopMenuBar from "../dashboard/TopMenuBar";
import MessageUI from "../dashboard/MessageUI";
import LoginModel from "../auth/LoginModel";
import ShareModel from "../dashboard/ShareModel";

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
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl">
          <Spinner color="white" size="lg" />
        </div>
        <p className="text-neutral-400">Loading agent...</p>
      </div>
    );
  }

  return (
    <>
      {hasMessages && <ShareModel chatId={chatId} />}
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center bg-transparent",
        )}
      >
        {!hasMessages && isAgentOverview ? (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-transparent py-10">
            <TopMenuBar />
            <div className="mb-10 flex h-full w-full max-w-4xl flex-col items-center justify-center gap-16 px-6 pb-10">
              {/* Agent Header with Enhanced Design */}
              <div className="space-y-6 text-center">
                <div className="relative">
                  {/* Agent Icon/Avatar */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-xl">
                      <Icon
                        className="text-neutral-200"
                        icon="mdi:robot"
                        width={32}
                      />
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h1 className="relative bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-4xl font-bold text-transparent">
                    {agent?.name || "Loading..."}
                  </h1>
                </div>

                {/* Agent Description */}
                <div className="mx-auto max-w-2xl">
                  <p className="text-lg leading-relaxed text-neutral-400">
                    {agent?.description || "Getting agent details..."}
                  </p>
                </div>

                {/* Subtle divider */}
                <div className="flex justify-center pt-4">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                </div>
              </div>

              {/* Chat Input Section */}
              <div className="w-full max-w-3xl">
                <div className="mb-4 text-center">
                  <p className="text-sm text-neutral-500">
                    Start a conversation with this agent
                  </p>
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
          </div>
        ) : (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
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
