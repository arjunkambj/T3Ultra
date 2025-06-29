"use client";

import React, { useMemo, useCallback } from "react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ChatHistoryDropdown from "./ChatHistoryDropdown";

import { useSidebarToggle } from "@/atoms/sidebarState";
import { api } from "@/convex/_generated/api";

// Memoized chat item component
const ChatItem = React.memo(
  ({
    chat,
    isActive,
    href,
    onChatClick,
  }: {
    chat: any;
    isActive: boolean;
    href: string;
    onChatClick: () => void;
  }) => (
    <div className="group relative flex w-full items-center rounded-lg transition-colors hover:bg-neutral-800/30">
      <Link
        className={`group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-lg px-3 text-sm outline-none transition-colors duration-150 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
          isActive ? "bg-neutral-800/50 text-neutral-100" : "text-neutral-400"
        }`}
        href={href}
        onClick={onChatClick}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            {chat.isAgentChat && (
              <Icon
                className="flex-shrink-0 text-neutral-500"
                height={12}
                icon="mdi:robot"
                width={12}
              />
            )}
            {chat.isBranchChat && (
              <Icon
                className="flex-shrink-0 text-neutral-500"
                height={12}
                icon="solar:branch-bold"
                width={12}
              />
            )}
            <span className="truncate text-left text-xs">{chat.title}</span>
          </div>
        </div>
      </Link>

      <div className="absolute right-1 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ChatHistoryDropdown chatId={chat.chatId} isPinned={chat.isPinned} />
      </div>
    </div>
  ),
);

ChatItem.displayName = "ChatItem";

// Memoized section component with color-coded headers
const ChatSection = React.memo(
  ({
    title,
    icon,
    chats,
    renderChatItem,
    headerColor = "text-neutral-400",
  }: {
    title: string;
    icon?: string;
    chats: any[];
    renderChatItem: (chat: any) => React.ReactNode;
    headerColor?: string;
  }) => {
    if (chats.length === 0) return null;

    return (
      <div className="mb-3">
        <div className="mb-2 flex items-center gap-2 px-1 py-0">
          {icon && (
            <Icon className={headerColor} height={12} icon={icon} width={12} />
          )}
          <span
            className={`text-xs font-medium uppercase tracking-wider ${headerColor}`}
          >
            {title}
          </span>
        </div>
        <div className="flex flex-col gap-1">{chats.map(renderChatItem)}</div>
      </div>
    );
  },
);

ChatSection.displayName = "ChatSection";

export default function ChatHistory() {
  const user = useQuery(api.function.users.currentUser);
  const chatsIncludingProjectChats = useQuery(
    api.function.chats.getChatsByUserId,
    user ? { userId: user._id } : "skip",
  );

  const pathname = usePathname();
  const { setIsOpen } = useSidebarToggle();

  // Memoize filtered chats
  const chats = useMemo(
    () =>
      chatsIncludingProjectChats?.filter((chat) => !chat.isProjectChat) || [],
    [chatsIncludingProjectChats],
  );

  // Memoize helper functions
  const isChatActive = useCallback(
    (chat: any) => {
      if (chat.isAgentChat && chat.agentId) {
        return pathname === `/agent/${chat.agentId}/${chat.chatId}`;
      } else {
        return pathname === `/chat/${chat.chatId}`;
      }
    },
    [pathname],
  );

  const getChatHref = useCallback((chat: any) => {
    if (chat.isAgentChat && chat.agentId) {
      return `/agent/${chat.agentId}/${chat.chatId}`;
    } else {
      return `/chat/${chat.chatId}`;
    }
  }, []);

  const handleChatClick = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  // Memoize categorized chats
  const { pinnedChats, categorizedChats } = useMemo(() => {
    if (!chats.length) {
      return {
        pinnedChats: [],
        categorizedChats: {
          today: [],
          yesterday: [],
          previous7Days: [],
          previous30Days: [],
          older: [],
        },
      };
    }

    const pinned = chats.filter((chat) => chat.isPinned);
    const recent = chats
      .filter((chat) => !chat.isPinned)
      .sort(
        (a, b) =>
          (b.updatedAt ?? b._creationTime ?? 0) -
          (a.updatedAt ?? a._creationTime ?? 0),
      );

    // Categorize chats by time
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

    recent.forEach((chat) => {
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

    return { pinnedChats: pinned, categorizedChats: categories };
  }, [chats]);

  // Memoize render function
  const renderChatItem = useCallback(
    (chat: any) => (
      <ChatItem
        key={chat.chatId}
        chat={chat}
        href={getChatHref(chat)}
        isActive={isChatActive(chat)}
        onChatClick={handleChatClick}
      />
    ),
    [isChatActive, getChatHref, handleChatClick],
  );

  // Early return if no chats
  if (!chats.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Icon
          className="mb-2 text-neutral-600"
          height={24}
          icon="mdi:chat-outline"
          width={24}
        />
        <span className="text-xs text-neutral-500">No chats yet</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Pinned Section - Brightest for importance */}
      <ChatSection
        chats={pinnedChats}
        headerColor="text-neutral-200"
        icon="solar:pin-bold"
        renderChatItem={renderChatItem}
        title="Pinned"
      />

      {/* Today Section - Bright for most recent */}
      <ChatSection
        chats={categorizedChats.today}
        headerColor="text-neutral-300"
        renderChatItem={renderChatItem}
        title="Today"
      />

      {/* Yesterday Section - Medium bright */}
      <ChatSection
        chats={categorizedChats.yesterday}
        headerColor="text-neutral-300"
        renderChatItem={renderChatItem}
        title="Yesterday"
      />

      {/* Previous 7 days - Medium */}
      <ChatSection
        chats={categorizedChats.previous7Days}
        headerColor="text-neutral-300"
        renderChatItem={renderChatItem}
        title="Previous 7 days"
      />

      {/* Previous 30 days - Darker */}
      <ChatSection
        chats={categorizedChats.previous30Days}
        headerColor="text-neutral-300"
        renderChatItem={renderChatItem}
        title="Previous 30 days"
      />

      {/* Older - Darkest for oldest */}
      <ChatSection
        chats={categorizedChats.older}
        headerColor="text-neutral-700"
        renderChatItem={renderChatItem}
        title="Older"
      />
    </div>
  );
}
