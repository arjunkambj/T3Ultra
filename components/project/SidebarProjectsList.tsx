"use client";

import { useState } from "react";

import SidebarProjectItem from "./SidebarProjectItem";

const mockProjects = [
  {
    id: "project-1",
    title: "E-commerce Platform",
    description: "Building a modern e-commerce solution",
    isExpanded: false,
    isPinned: true,
    chats: [
      {
        id: "chat-1",
        title: "Database Schema Design",
        projectId: "project-1",
        updatedAt: new Date().getTime(),
      },
      {
        id: "chat-2",
        title: "API Development",
        projectId: "project-1",
        updatedAt: new Date().getTime() - 86400000,
      },
      {
        id: "chat-3",
        title: "Frontend Components",
        projectId: "project-1",
        updatedAt: new Date().getTime() - 172800000,
      },
    ],
  },
  {
    id: "project-2",
    title: "AI Chat Application",
    description: "Building an intelligent chat system",
    isExpanded: false,
    isPinned: false,
    chats: [
      {
        id: "chat-4",
        title: "Model Integration",
        projectId: "project-2",
        updatedAt: new Date().getTime() - 259200000,
      },
      {
        id: "chat-5",
        title: "UI/UX Design",
        projectId: "project-2",
        updatedAt: new Date().getTime() - 345600000,
      },
    ],
  },
];

export default function SidebarProjectsList() {
  const [projects, setProjects] = useState(mockProjects);

  const toggleProjectExpansion = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, isExpanded: !project.isExpanded }
          : project,
      ),
    );
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {projects.length > 0 && (
        <div className="flex flex-col gap-1">
          {mockProjects.map((project) => (
            <SidebarProjectItem
              key={project.id}
              project={project}
              onToggleExpansion={toggleProjectExpansion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
