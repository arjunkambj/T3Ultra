import { v4 as uuidv4 } from "uuid";

import ChatSection from "@/components/chat/ChatSection";
import TopMenuBar from "@/components/dashboard/TopMenuBar";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chat?: string[] }>;
}) {
  const { chat } = await params;
  const isNewChat = !chat || chat.length < 1;
  const chatId = isNewChat ? uuidv4() : chat[0];

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-950 via-[#141414] to-neutral-950">
      <TopMenuBar />
      <ChatSection key={chatId} chatId={chatId} isnewchat={isNewChat} />
    </section>
  );
}
