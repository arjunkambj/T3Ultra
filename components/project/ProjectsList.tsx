"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import ProjectItem from "./ProjectItem";

// Mock data - replace with actual data from Convex
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
  {
    id: "project-3",
    title: "Mobile App Development",
    description: "Cross-platform mobile application",
    isExpanded: false,
    isPinned: false,
    chats: [
      {
        id: "chat-6",
        title: "React Native Setup",
        projectId: "project-3",
        updatedAt: new Date().getTime() - 432000000,
      },
    ],
  },
];

export default function ProjectsList() {
  const [projects, setProjects] = useState(mockProjects);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Separate pinned and unpinned projects
  const pinnedProjects = projects.filter((project) => project.isPinned);
  const unpinnedProjects = projects.filter((project) => !project.isPinned);

  const toggleProjectExpansion = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, isExpanded: !project.isExpanded }
          : project,
      ),
    );
  };

  const toggleProjectPin = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, isPinned: !project.isPinned }
          : project,
      ),
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Projects Header */}
      <div className="mb-2 flex items-center justify-between py-0 pl-[10px] pr-2">
        <div className="flex items-center gap-2 text-small text-neutral-300">
          <Icon
            className="text-neutral-400"
            height={14}
            icon="mdi:folder-multiple"
            width={14}
          />
          Projects
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
          {/* Pinned Projects */}
          {pinnedProjects.length > 0 && (
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
                {pinnedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onDelete={deleteProject}
                    onToggleExpansion={toggleProjectExpansion}
                    onTogglePin={toggleProjectPin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Projects */}
          {unpinnedProjects.length > 0 && (
            <div className="flex flex-col gap-1">
              {unpinnedProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onDelete={deleteProject}
                  onToggleExpansion={toggleProjectExpansion}
                  onTogglePin={toggleProjectPin}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
