"use client";

import React from "react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import SidebarAgent from "./SidebarAgent";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/hooks/useUser";

const SidebarAgentsList = React.memo(() => {
  const user = useUser();
  const allAgents = useQuery(api.function.agent.getAgentByUserId, {
    userId: user?._id as Id<"users">,
  });

  const agents = allAgents?.filter((agent) => agent.isPinned);

  if (!agents?.length) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {agents.map((agent) => (
        <SidebarAgent key={agent._id} agent={agent} />
      ))}
    </div>
  );
});

SidebarAgentsList.displayName = "SidebarAgentsList";

export default SidebarAgentsList;
