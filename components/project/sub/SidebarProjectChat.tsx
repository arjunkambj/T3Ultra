"use client";

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

export default function SidebarProjectChat({
  title,
  chatId,
  projectId,
}: ProjectChatItemProps) {
  const pathname = usePathname();
  const deleteChat = useMutation(api.function.chats.deleteChatByChatId);

  const isActive = () => {
    return pathname === `/project/${projectId}/${chatId}`;
  };

  const getHref = () => {
    return `/project/${projectId}/${chatId}`;
  };

  const handleDeleteChat = () => {
    deleteChat({ chatId });
  };

  return (
    <div
      className={`group relative flex w-full items-center rounded-medium hover:bg-neutral-800/30 ${
        isActive()
          ? "rounded-xl bg-neutral-800/50 text-neutral-200"
          : "text-neutral-500"
      }`}
    >
      <Link
        className={`group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900`}
        href={getHref()}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <span className="truncate text-left text-xs">{title}</span>
          </div>
        </div>
      </Link>
      <div className="hover absolute right-2 flex items-center opacity-0 hover:cursor-pointer group-hover:opacity-100">
        <Button isIconOnly size="sm" variant="light" onPress={handleDeleteChat}>
          <Icon icon="mdi:delete" width={16} />
        </Button>
      </div>
    </div>
  );
}
