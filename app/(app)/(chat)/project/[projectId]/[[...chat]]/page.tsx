import { v4 as uuidv4 } from "uuid";

import ProjectChatSection from "@/components/project/ProjectChatSection";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string; chat?: string[] }>;
}) {
  const { projectId, chat } = await params;
  const isProjectOverview = !chat || chat.length < 1;
  const isnewchat = !chat || chat.length < 1;

  // Generate chatId for new chats, or extract from URL for existing chats
  const chatId = isProjectOverview ? uuidv4() : chat?.[0] || uuidv4();

  return (
    <ProjectChatSection
      key={`${projectId}-${chatId}`}
      chatId={chatId}
      isProjectOverview={isProjectOverview}
      isnewchat={isnewchat}
      projectId={projectId}
    />
  );
}
