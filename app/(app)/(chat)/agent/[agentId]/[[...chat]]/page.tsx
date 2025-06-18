import { v4 as uuidv4 } from "uuid";

import AgentChatSection from "@/components/agent/AgentChatSection";
import { Id } from "@/convex/_generated/dataModel";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ agentId: string; chat?: string[] }>;
}) {
  const { agentId, chat } = await params;
  const isAgentOverview = !chat || chat.length < 1;
  const isnewchat = !chat || chat.length < 1;

  // Generate chatId for new chats, or extract from URL for existing chats
  const chatId = isAgentOverview ? uuidv4() : chat?.[0] || uuidv4();

  return (
    <AgentChatSection
      agentId={agentId as Id<"agent">}
      chatId={chatId}
      isAgentOverview={isAgentOverview}
      isnewchat={isnewchat}
    />
  );
}
