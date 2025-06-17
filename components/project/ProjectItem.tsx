"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

import ProjectDropdown from "./ProjectDropdown";
import ProjectChatItem from "./ProjectChatItem";

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
  onTogglePin: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectItem({
  project,
  onToggleExpansion,
  onTogglePin,
  onDelete,
}: ProjectItemProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleToggleExpansion = () => {
    onToggleExpansion(project.id);
  };

  const handleChatDelete = (chatId: string) => {
    addToast({
      title: "Delete chat",
      description: "Delete chat - Coming soon" + chatId,
      color: "danger",
      timeout: 3000,
    });
  };

  const handleChatPin = (chatId: string) => {
    // This would typically update the chat's pinned status
    addToast({
      title: "Pin chat",
      description: "Pin chat - Coming soon" + chatId,
      color: "success",
      timeout: 3000,
    });
  };

  return (
    <div className="w-full">
      {/* Project Header */}
      <div
        className="group relative flex w-full items-center rounded-medium hover:bg-neutral-800/50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Button
          aria-expanded={project.isExpanded}
          aria-label={`${project.isExpanded ? "Collapse" : "Expand"} project ${project.title}`}
          className="group relative flex h-9 w-full cursor-pointer items-center justify-start rounded-medium px-3 text-small outline-none transition-colors duration-100 hover:bg-neutral-800/50 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          type="button"
          onPress={handleToggleExpansion}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
              <Icon
                className="text-neutral-500"
                icon={
                  project.isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"
                }
                width={16}
              />
              <Icon className="text-neutral-500" icon="mdi:folder" width={16} />
              <span className="truncate text-left font-medium">
                {project.title}
              </span>
              {project.isPinned && (
                <Icon className="text-neutral-500" icon="mdi:pin" width={12} />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              {project.chats.length}
            </div>
          </div>
        </Button>

        {/* Project Dropdown */}
        {isHovering && (
          <div className="absolute right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ProjectDropdown
              project={project}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
            />
          </div>
        )}
      </div>

      {/* Expanded Chat List */}
      {project.isExpanded && project.chats.length > 0 && (
        <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-neutral-800 pl-3">
          {project.chats.map((chat) => (
            <ProjectChatItem
              key={chat.id}
              chat={chat}
              onDelete={handleChatDelete}
              onPin={handleChatPin}
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
