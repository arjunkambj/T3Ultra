"use client";

import { Spinner } from "@heroui/spinner";
import { cn } from "@heroui/theme";

import TopMenuBar from "../chat/TopMenuBar";
import MessageUI from "../chat/MessageUI";
import LoginModel from "../auth/LoginModel";
import ShareModel from "../chat/ShareModel";

import ChatInput from "./ChatInput";

import { useProject } from "@/hooks/useProject";

interface Project {
  _id: string;
  projectId: string;
  title: string;
  description: string;
}

interface ProjectChatSectionProps {
  projectId: string;
  chatId: string;
  isProjectOverview: boolean;
  isnewchat: boolean;
}

export default function ProjectChatSection({
  chatId,
  isProjectOverview,
  isnewchat,
  projectId,
}: ProjectChatSectionProps) {
  const dummyProject: Project = {
    _id: "1",
    projectId: "1",
    title: "Project 1",
    description: "Description 1",
  };

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

  const hasInput = input.length > 0 ? true : false;
  const hasMessages = messages.length > 0 ? true : false;

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
        {!hasMessages && isProjectOverview ? (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0F0F10] py-10">
            <TopMenuBar />
            <div className="mb-10 flex h-full w-full max-w-3xl flex-col items-center justify-center gap-12 pb-10">
              <div className="text-center">
                <h1 className="text-2xl font-bold">{dummyProject.title}</h1>
                <p className="mt-2 text-neutral-400">
                  {dummyProject.description}
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

              <div className="flex w-full flex-col items-center justify-center gap-4">
                <h2 className="text-lg">Project Chats</h2>
                <p className="text-sm text-neutral-500">
                  Start a new chat above or view existing chats here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0F0F10]">
            <TopMenuBar />
            <div className="flex h-full w-full flex-col items-center justify-center">
              {/* TODO: Implement ProjectChatSection component similar to ChatSection */}
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
