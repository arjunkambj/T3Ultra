"use client";

import SidebarAgent from "./SidebarAgent";

// Mock data - replace with actual data from Convex
const mockAgents = [
  {
    id: "agent-1",
    name: "Code Assistant",
    description:
      "Specialized in helping with programming tasks, debugging, and code reviews",
    avatar: "🤖",
    isPinned: true,
  },
  {
    id: "agent-2",
    name: "Writing Coach",
    description: "Expert in creative writing, editing, and content creation",
    avatar: "✍️",
    isPinned: true,
  },
];

export default function SidebarAgentsList() {
  return (
    <div className="flex w-full flex-col">
      {mockAgents.map((agent) => (
        <SidebarAgent key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
