"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Image } from "@heroui/image";

import { Agent } from "@/types";

interface AgentItemProps {
  agent: Agent;
}

const SidebarAgent = React.memo(({ agent }: AgentItemProps) => {
  const pathname = usePathname();

  const isAgentActive = useMemo(() => {
    return pathname === `/agent/${agent._id}`;
  }, [pathname, agent._id]);

  const handleMobileClose = useCallback(() => {
    if (window.innerWidth < 768) {
      // Close sidebar on mobile after navigation
    }
  }, []);

  return (
    <div className="w-full">
      <div className="group relative flex w-full items-center rounded-lg transition-colors hover:bg-neutral-800/30">
        <Link
          className={`group relative flex h-8 w-full cursor-pointer items-center justify-start rounded-lg px-3 text-sm outline-none transition-colors duration-150 hover:bg-neutral-800/30 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
            isAgentActive
              ? "bg-neutral-800/50 text-neutral-100"
              : "text-neutral-400"
          }`}
          href={`/agent/${agent._id}`}
          onClick={handleMobileClose}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800/50">
                {agent.avatar && agent.avatar.startsWith("http") ? (
                  <Image
                    alt={agent.name || "Agent Avatar"}
                    className="h-5 w-5 rounded-full object-cover"
                    height={20}
                    src={agent.avatar}
                    width={20}
                  />
                ) : (
                  <Icon
                    className="text-neutral-400"
                    icon="mdi:robot"
                    width={12}
                  />
                )}
              </div>
              <span className="truncate text-left text-xs font-medium">
                {agent.name}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

SidebarAgent.displayName = "SidebarAgent";

export default SidebarAgent;
