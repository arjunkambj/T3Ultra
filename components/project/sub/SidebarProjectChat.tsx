"use client";

import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ProjectChatItemProps {
  title: string;
  chatId: string;
  projectId: string;
  updatedAt?: number;
}

export default function SidebarProjectChat({
  title,
  chatId,
  projectId,
  updatedAt,
}: ProjectChatItemProps) {
  const pathname = usePathname();

  const isActive = () => {
    return pathname === `/project/${projectId}/${chatId}`;
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "";

    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "now";
    }
  };

  const getHref = () => {
    return `/project/${projectId}/${chatId}`;
  };

  const getIcon = () => {
    return "mdi:chat";
  };

  return (
    <div className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/30">
      <Link
        className={`group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
          isActive()
            ? "rounded-xl bg-neutral-800/50 text-neutral-200"
            : "text-neutral-500"
        }`}
        href={getHref()}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <Icon className="text-neutral-600" icon={getIcon()} width={14} />
            <span className="truncate text-left text-xs">{title}</span>
          </div>
          {updatedAt && (
            <div className="flex items-center gap-1 text-xs text-neutral-600">
              {formatTimeAgo(updatedAt)}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
