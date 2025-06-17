"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";

import SidebarProjectItem from "./SidebarProjectItem";

interface Chat {
  _id: string;
  chatId: string;
  title: string;
  projectId?: string;
  updatedAt?: number;
}

interface Project {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  instructions: string;
  userId: string;
  chats: Chat[];
  isExpanded?: boolean;
}

export default function SidebarProjectsList() {
  const user = useUser();
  const projectsData = useQuery(
    api.function.project.getProjectWithChats,
    user ? { userId: user._id } : "skip",
  );

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (projectsData) {
      setProjects(
        projectsData.map((project) => ({
          ...project,
          isExpanded: false,
        })),
      );
    }
  }, [projectsData]);

  const toggleProjectExpansion = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project._id === projectId
          ? { ...project, isExpanded: !project.isExpanded }
          : project,
      ),
    );
  };

  if (!user || !projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        {projects.map((project) => (
          <SidebarProjectItem
            key={project._id}
            project={project}
            onToggleExpansion={toggleProjectExpansion}
          />
        ))}
      </div>
    </div>
  );
}
