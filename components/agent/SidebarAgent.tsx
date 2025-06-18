"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  isPinned: boolean;
}

interface AgentItemProps {
  agent: Agent;
}

export default function AgentItem({ agent }: AgentItemProps) {
  const pathname = usePathname();

  const isAgentActive = (agentId: string) => {
    return pathname === `/agent/${agentId}`;
  };

  return (
    <div className="w-full">
      <div className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/50">
        <Link
          className={`group relative flex h-9 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/50 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
            isAgentActive(agent.id)
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
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
