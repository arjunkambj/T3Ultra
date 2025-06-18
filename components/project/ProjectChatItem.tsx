"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import ProjectChatDropdown from "./sub/ProjectChatDropdown";

interface Chat {
  id: string;
  title: string;
  projectId: string;
  updatedAt: number;
}

interface ProjectChatItemProps {
  chat: Chat;
  onDelete: (chatId: string) => void;
  onPin: (chatId: string) => void;
}

export default function ProjectChatItem({
  chat,
  onDelete,
  onPin,
}: ProjectChatItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  const isChatActive = () => {
    return pathname === `/chat/${chat.id}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div
      className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/30"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        className={`group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
          isChatActive()
            ? "rounded-xl bg-neutral-800/50 text-neutral-200"
            : "text-neutral-500"
        }`}
        href={`/chat/${chat.id}`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <Icon className="text-neutral-600" icon="mdi:chat" width={14} />
            <span className="truncate text-left text-xs">{chat.title}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            {formatTimeAgo(chat.updatedAt)}
          </div>
        </div>
      </Link>

      {/* Chat Dropdown */}
      {isHovering && (
        <div className="absolute right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ProjectChatDropdown chat={chat} onDelete={onDelete} onPin={onPin} />
        </div>
      )}
    </div>
  );
}
