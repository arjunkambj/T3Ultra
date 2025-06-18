"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";

import SidebarAgent from "./SidebarAgent";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/hooks/useUser";

export default function SidebarAgentsList() {
  const user = useUser();
  const allAgents = useQuery(api.function.agent.getAgentByUserId, {
    userId: user?._id as Id<"users">,
  });

  const agents = allAgents?.filter((agent) => agent.isPinned);

  return (
    <div className="flex w-full flex-col">
      {agents &&
        agents.map((agent) => <SidebarAgent key={agent._id} agent={agent} />)}
    </div>
  );
}
