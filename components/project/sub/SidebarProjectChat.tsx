"use client";

import React, { useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

interface ProjectChatItemProps {
  title: string;
  chatId: string;
  projectId: string;
}

const SidebarProjectChat = React.memo(function SidebarProjectChat({
  title,
  chatId,
  projectId,
}: ProjectChatItemProps) {
  const pathname = usePathname();
  const deleteChat = useMutation(api.function.chats.deleteChatByChatId);

  const isActive = useMemo(() => {
    return pathname === `/project/${projectId}/${chatId}`;
  }, [pathname, projectId, chatId]);

  const href = useMemo(() => {
    return `/project/${projectId}/${chatId}`;
  }, [projectId, chatId]);

  const handleDeleteChat = useCallback(() => {
    deleteChat({ chatId });
  }, [deleteChat, chatId]);

  return (
    <div
      className={`group relative flex w-full items-center rounded-lg transition-colors hover:bg-neutral-800/30 ${
        isActive ? "bg-neutral-800/50 text-neutral-100" : "text-neutral-400"
      }`}
    >
      <Link
        className="group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-lg px-3 text-xs outline-none transition-colors duration-150 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
        href={href}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <Icon
              className="flex-shrink-0 text-neutral-500"
              icon="mdi:chat-outline"
              width={12}
            />
            <span className="truncate text-left">{title}</span>
          </div>
        </div>
      </Link>

      <Button
        isIconOnly
        className="h-6 w-6 bg-transparent p-0 opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
        size="sm"
        variant="light"
        onPress={handleDeleteChat}
      >
        <Icon className="h-3 w-3" icon="mdi:delete" />
      </Button>
    </div>
  );
});

export default SidebarProjectChat;
