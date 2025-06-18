"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";

import SidebarProjectItem from "./sub/SidebarProjectItem";

import { api } from "@/convex/_generated/api";

export default function SidebarProjectsList() {
  const user = useQuery(api.function.users.currentUser);

  const projects = useQuery(
    api.function.project.getProjectWithChats,
    user ? { userId: user._id } : "skip",
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        {projects &&
          projects.map((project) => (
            <SidebarProjectItem key={project._id} project={project} />
          ))}
      </div>
    </div>
  );
}
