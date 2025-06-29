"use client";

import React from "react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import SidebarProjectItem from "./sub/SidebarProjectItem";

import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";

const SidebarProjectsList = React.memo(() => {
  const user = useUser();

  const projects = useQuery(
    api.function.project.getProjectWithChats,
    user ? { userId: user._id } : "skip",
  );

  if (!projects?.length) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        {projects.map((project) => (
          <SidebarProjectItem key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
});

SidebarProjectsList.displayName = "SidebarProjectsList";

export default SidebarProjectsList;
