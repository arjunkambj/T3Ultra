"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import AgentItem from "./AgentItem";

// Mock data - replace with actual data from Convex
const mockAgents = [
  {
    id: "agent-1",
    name: "Code Assistant",
    description:
      "Specialized in helping with programming tasks, debugging, and code reviews",
    avatar: "🤖",
    category: "development",
    isPublic: true,
    isPinned: true,
    usageCount: 156,
    lastUsed: new Date().getTime() - 86400000,
    status: "active" as const,
    capabilities: ["coding", "debugging", "code-review"],
  },
  {
    id: "agent-2",
    name: "Writing Coach",
    description: "Expert in creative writing, editing, and content creation",
    avatar: "✍️",
    category: "writing",
    isPublic: false,
    isPinned: true,
    usageCount: 89,
    lastUsed: new Date().getTime() - 172800000,
    status: "active" as const,
    capabilities: ["writing", "editing", "creativity"],
  },
  {
    id: "agent-3",
    name: "Data Analyst",
    description:
      "Specialized in data analysis, visualization, and statistical insights",
    avatar: "📊",
    category: "analytics",
    isPublic: true,
    isPinned: false,
    usageCount: 234,
    lastUsed: new Date().getTime() - 259200000,
    status: "active" as const,
    capabilities: ["data-analysis", "visualization", "statistics"],
  },
  {
    id: "agent-4",
    name: "Language Tutor",
    description: "Helps with language learning and translation tasks",
    avatar: "🌍",
    category: "education",
    isPublic: false,
    isPinned: false,
    usageCount: 67,
    lastUsed: new Date().getTime() - 432000000,
    status: "archived" as const,
    capabilities: ["language", "translation", "education"],
  },
];

export default function AgentsList() {
  const [agents, setAgents] = useState(mockAgents);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Separate pinned and unpinned agents
  const pinnedAgents = agents.filter(
    (agent) => agent.isPinned && agent.status === "active",
  );
  const unpinnedAgents = agents.filter(
    (agent) => !agent.isPinned && agent.status === "active",
  );

  const toggleAgentPin = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, isPinned: !agent.isPinned } : agent,
      ),
    );
  };

  const deleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
  };

  const archiveAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status:
                agent.status === "active"
                  ? ("archived" as const)
                  : ("active" as const),
            }
          : agent,
      ),
    );
  };

  if (agents.filter((a) => a.status === "active").length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Agents Header */}
      <div className="mb-2 flex items-center justify-between py-0 pl-[10px] pr-2">
        <div className="flex items-center gap-2 text-small text-neutral-300">
          <Icon
            className="text-neutral-400"
            height={14}
            icon="mdi:robot"
            width={14}
          />
          Custom Agents
        </div>
        <button
          className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Icon
            icon={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-down"}
            width={16}
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-1">
          {/* Pinned Agents */}
          {pinnedAgents.length > 0 && (
            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2 py-0 pl-[10px] text-xs text-neutral-400">
                <Icon
                  className="text-neutral-500"
                  height={12}
                  icon="mdi:pin"
                  width={12}
                />
                Pinned
              </div>
              <div className="flex flex-col gap-1">
                {pinnedAgents.map((agent) => (
                  <AgentItem
                    key={agent.id}
                    agent={agent}
                    onArchive={archiveAgent}
                    onDelete={deleteAgent}
                    onTogglePin={toggleAgentPin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Agents */}
          {unpinnedAgents.length > 0 && (
            <div className="flex flex-col gap-1">
              {unpinnedAgents.map((agent) => (
                <AgentItem
                  key={agent.id}
                  agent={agent}
                  onArchive={archiveAgent}
                  onDelete={deleteAgent}
                  onTogglePin={toggleAgentPin}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
