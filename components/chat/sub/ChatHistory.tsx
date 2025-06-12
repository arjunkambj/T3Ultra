"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { useMutation } from "convex/react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

import { useSidebarToggle } from "@/atoms/sidebarState";
import { api } from "@/convex/_generated/api";

export default function ChatHistory() {
  const user = useQuery(api.function.users.currentUser);
  const chats = useQuery(
    api.function.chats.getChatsByUserId,
    user ? { userId: user._id } : "skip",
  );

  const pathname = usePathname();
  const { setIsOpen } = useSidebarToggle();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isChatActive = (chatId: string) => {
    return pathname === `/chat/${chatId}`;
  };

  const handleChatClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!chats) {
    return;
  }

  // Separate pinned and unpinned chats
  const pinnedChats = chats.filter((chat) => chat.isPinned);
  const recentChats = chats
    .filter((chat) => !chat.isPinned)
    .sort(
      (a, b) =>
        (b.updatedAt ?? b._creationTime ?? 0) -
        (a.updatedAt ?? a._creationTime ?? 0),
    );

  // Helper function to categorize chats by time
  const categorizeChats = (chats: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const categories = {
      today: [] as any[],
      yesterday: [] as any[],
      previous7Days: [] as any[],
      previous30Days: [] as any[],
      older: [] as any[],
    };

    chats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt ?? chat._creationTime);

      if (chatDate >= today) {
        categories.today.push(chat);
      } else if (chatDate >= yesterday) {
        categories.yesterday.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        categories.previous7Days.push(chat);
      } else if (chatDate >= thirtyDaysAgo) {
        categories.previous30Days.push(chat);
      } else {
        categories.older.push(chat);
      }
    });

    return categories;
  };

  const categorizedChats = categorizeChats(recentChats);

  const renderChatItem = (chat: any) => (
    <div key={chat.chatId} className="w-full">
      <Button
        as={Link}
        className={`group relative flex h-9 w-full cursor-pointer items-center justify-start gap-2.5 rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-default-100 hover:text-default-700 focus-visible:ring-2 focus-visible:ring-focus ${
          isChatActive(chat.chatId)
            ? "rounded-xl bg-default-100 text-default-800"
            : "text-default-600"
        }`}
        href={`/chat/${chat.chatId}`}
        variant="light"
        onPress={handleChatClick}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <span className="truncate text-left">{chat.title}</span>
          </div>
          <div className="ml-2 flex-shrink-0">
            <PromptMenu chatId={chat.chatId} isPinned={chat.isPinned} />
          </div>
        </div>
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      {/* Pinned Section */}
      {pinnedChats.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 py-0 pl-[10px] text-small text-default-800">
            <Icon
              className="text-default-700"
              height={14}
              icon="solar:pin-bold"
              width={14}
            />
            Pinned
          </div>
          <div className="flex flex-col gap-1">
            {pinnedChats.map(renderChatItem)}
          </div>
        </div>
      )}

      {/* Today Section */}
      {categorizedChats.today.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 py-0 pl-[10px] text-small text-default-800">
            Today
          </div>
          <div className="flex flex-col gap-1">
            {categorizedChats.today.map(renderChatItem)}
          </div>
        </div>
      )}

      {/* Yesterday Section */}
      {categorizedChats.yesterday.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 py-0 pl-[10px] text-small text-default-800">
            Yesterday
          </div>
          <div className="flex flex-col gap-1">
            {categorizedChats.yesterday.map(renderChatItem)}
          </div>
        </div>
      )}

      {/* Previous 7 Days Section */}
      {categorizedChats.previous7Days.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 py-0 pl-[10px] text-small text-default-800">
            Previous 7 days
          </div>
          <div className="flex flex-col gap-1">
            {categorizedChats.previous7Days.map(renderChatItem)}
          </div>
        </div>
      )}

      {/* Previous 30 Days Section */}
      {categorizedChats.previous30Days.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 py-0 pl-[10px] text-small text-default-800">
            Previous 30 days
          </div>
          <div className="flex flex-col gap-1">
            {categorizedChats.previous30Days.map(renderChatItem)}
          </div>
        </div>
      )}

      {/* Older Section */}
      {categorizedChats.older.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 py-0 pl-[10px] text-small text-default-800">
            Older
          </div>
          <div className="flex flex-col gap-1">
            {categorizedChats.older.map(renderChatItem)}
          </div>
        </div>
      )}
    </div>
  );
}

function PromptMenu({
  chatId,
  isPinned,
}: {
  chatId: string;
  isPinned: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const deleteChat = useMutation(api.function.chats.deleteChatByChatId);
  const updateChatIsPinned = useMutation(api.function.chats.updateChatIsPinned);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteChat({ chatId });

      if (pathname === `/chat/${chatId}`) {
        router.push("/chat");
      }
    } catch (error) {
      void error;
      addToast({
        title: "Error deleting chat",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateChatIsPinned({ chatId, isPinned: !isPinned });
    } catch (error) {
      void error;
      addToast({
        title: "Error",
        description: "Something went wrong",
        color: "danger",
      });
    }
  };

  return (
    <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <Icon
        className="cursor-pointer text-default-700 transition-colors duration-150 hover:text-default-900"
        height={16}
        icon={isPinned ? "solar:pin-bold" : "solar:pin-linear"}
        width={16}
        onClick={handlePin}
      />
      <Icon
        className="cursor-pointer text-default-700 transition-colors duration-150 hover:text-danger"
        height={16}
        icon="material-symbols:delete-outline"
        width={16}
        onClick={handleDelete}
      />
    </div>
  );
}
