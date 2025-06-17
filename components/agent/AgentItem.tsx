"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import AgentDropdown from "./AgentDropdown";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  isPublic: boolean;
  isPinned: boolean;
  usageCount: number;
  lastUsed: number;
  status: "active" | "archived";
  capabilities: string[];
}

interface AgentItemProps {
  agent: Agent;
  onTogglePin: (agentId: string) => void;
  onDelete: (agentId: string) => void;
  onArchive: (agentId: string) => void;
}

export default function AgentItem({
  agent,
  onTogglePin,
  onDelete,
  onArchive,
}: AgentItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  const isAgentActive = () => {
    return pathname === `/agent/${agent.id}`;
  };

  const formatUsageCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }

    return count.toString();
  };

  return (
    <div className="w-full">
      <div
        className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link
          className={`group relative flex h-9 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/50 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
            isAgentActive()
              ? "rounded-xl bg-neutral-800 text-neutral-200"
              : "text-neutral-400"
          }`}
          href={`/agent/${agent.id}`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs">
                {agent.avatar}
              </div>
              <span className="truncate text-left font-medium">
                {agent.name}
              </span>
              {agent.isPinned && (
                <Icon className="text-neutral-500" icon="mdi:pin" width={12} />
              )}
              {!agent.isPublic && (
                <Icon className="text-neutral-500" icon="mdi:lock" width={12} />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              {formatUsageCount(agent.usageCount)}
            </div>
          </div>
        </Link>

        {/* Agent Dropdown */}
        {isHovering && (
          <div className="absolute right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <AgentDropdown
              agent={agent}
              onArchive={onArchive}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          </div>
        )}
      </div>
    </div>
  );
}
