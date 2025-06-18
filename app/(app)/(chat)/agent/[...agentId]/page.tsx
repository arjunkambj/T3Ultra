"use client";
import { useParams } from "next/navigation";

import ChatInput from "@/components/agent/ChatInput";
import TopMenuBar from "@/components/chat/TopMenuBar";

export default function AgentPage() {
  const { agentId } = useParams();

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-[#0F0F10] py-10">
      <TopMenuBar />
      <div className="mb-10 flex h-full w-full max-w-3xl flex-col items-center justify-center gap-12 pb-10">
        <h1 className="text-2xl font-bold">Agent {agentId}</h1>
        <ChatInput />
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-lg">Chats</h2>
        </div>
      </div>
    </div>
  );
}
