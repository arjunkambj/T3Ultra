"use client";

import React from "react";
import { Spinner } from "@heroui/spinner";
import { cn } from "@heroui/theme";
import { useQuery } from "convex-helpers/react/cache/hooks";

import TopMenuBar from "../dashboard/TopMenuBar";
import MessageUI from "../dashboard/MessageUI";
import LoginModel from "../auth/LoginModel";
import ShareModel from "../dashboard/ShareModel";

import ChatInput from "./ChatInput";

import { api } from "@/convex/_generated/api";
import { useProject } from "@/hooks/useProject";

interface ProjectChatSectionProps {
  projectId: string;
  chatId: string;
  isProjectOverview: boolean;
  isnewchat: boolean;
}

const ProjectChatSection = React.memo(function ProjectChatSection({
  chatId,
  isProjectOverview,
  isnewchat,
  projectId,
}: ProjectChatSectionProps) {
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
  } = useProject({ isnewchat, chatId, projectId });

  // Only fetch project details when needed for overview
  const project = useQuery(
    api.function.project.getProjectById,
    isProjectOverview ? { projectId } : "skip",
  );

  const hasMessages = React.useMemo(
    () => messages.length > 0,
    [messages.length],
  );

  const loadingSpinner = React.useMemo(
    () => (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-xl">
          <Spinner color="white" size="lg" />
        </div>
        <p className="text-neutral-400">Loading project...</p>
      </div>
    ),
    [],
  );

  if (isLoading) {
    return loadingSpinner;
  }

  return (
    <>
      {hasMessages && <ShareModel chatId={chatId} />}
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col items-center justify-center",
        )}
      >
        {!hasMessages && isProjectOverview ? (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-transparent py-10">
            <TopMenuBar />
            <div className="mb-10 flex h-full w-full max-w-4xl flex-col items-center justify-center gap-16 px-6 pb-10">
              {/* Project Header with Enhanced Design */}
              <div className="space-y-6 text-center">
                <div className="relative">
                  {/* Background Gradient */}

                  {/* Project Icon/Avatar */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-xl">
                      <svg
                        className="h-8 w-8 text-neutral-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h1 className="relative bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-4xl font-bold text-transparent">
                    {project?.title || "Loading..."}
                  </h1>
                </div>

                {/* Project Description */}
                <div className="mx-auto max-w-2xl">
                  <p className="text-lg leading-relaxed text-neutral-400">
                    {project?.description || "Getting project details..."}
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
                    Start a conversation about this project
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
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-transparent">
            <TopMenuBar />
            <div className="flex h-full w-full flex-col items-center justify-center">
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
});

export default ProjectChatSection;
