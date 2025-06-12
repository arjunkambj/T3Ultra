import { v4 as uuidv4 } from "uuid";

import ChatSection from "@/components/chat/ChatSection";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chat?: string[] }>;
}) {
  const { chat } = await params;
  const isNewChat = !chat || chat.length < 1;
  const chatId = isNewChat ? uuidv4() : chat[0];

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 bg-[#0F0F10]">
      <ChatSection
        key={chatId}
        chatId={chatId}
        initialMessages={[]}
        isnewchat={isNewChat}
      />
    </section>
  );
}
