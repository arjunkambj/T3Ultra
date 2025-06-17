"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";

import SidebarProjectChat from "./SidebarProjectChat";

interface Chat {
  id: string;
  title: string;
  projectId: string;
  updatedAt: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  isPinned: boolean;
  chats: Chat[];
}

interface ProjectItemProps {
  project: Project;
  onToggleExpansion: (projectId: string) => void;
}

export default function SidebarProjectItem({
  project,
  onToggleExpansion,
}: ProjectItemProps) {
  const handleToggleExpansion = () => {
    onToggleExpansion(project.id);
  };

  return (
    <div className="w-full">
      {/* Project Header */}
      <div className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/50">
        <Button
          aria-expanded={project.isExpanded}
          aria-label={`${project.isExpanded ? "Collapse" : "Expand"} project ${project.title}`}
          className="group relative flex h-8 w-full cursor-pointer items-center justify-between rounded-medium bg-transparent px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/50 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          type="button"
          onPress={handleToggleExpansion}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              className="flex-shrink-0 text-neutral-500"
              icon="mdi:folder"
              width={16}
            />
            <span className="truncate">{project.title}</span>
          </div>
          <Icon
            className="ml-2 flex-shrink-0 text-neutral-500"
            icon={project.isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"}
            width={16}
          />
        </Button>
      </div>

      {/* Expanded Chat List */}
      {project.isExpanded && project.chats.length > 0 && (
        <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-neutral-800 pl-3">
          {project.chats.map((chat) => (
            <SidebarProjectChat
              key={chat.id}
              chatId={chat.id}
              isProject={true}
              title={chat.title}
              updatedAt={chat.updatedAt}
            />
          ))}
        </div>
      )}

      {/* Empty State for Expanded Project */}
      {project.isExpanded && project.chats.length === 0 && (
        <div className="ml-6 mt-1 border-l border-neutral-800 pl-3">
          <div className="flex items-center gap-2 py-2 text-xs text-neutral-500">
            <Icon icon="mdi:chat-plus" width={14} />
            No chats in this project
          </div>
        </div>
      )}
    </div>
  );
}
