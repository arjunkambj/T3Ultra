"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex-helpers/react/cache/hooks";

import SidebarProjectChat from "./SidebarProjectChat";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Chat {
  _id: string;
  chatId: string;
  title: string;
  projectId?: string;
  updatedAt?: number;
}

interface Project {
  _id: Id<"projects">;
  projectId?: string;
  title: string;
  description: string;
  instructions: string;
  userId: Id<"users">;
}

interface ProjectItemProps {
  project: Project;
}

export default function SidebarProjectItem({ project }: ProjectItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const chats = useQuery(api.function.chats.getChatsByProjectId, {
    projectId: project.projectId,
  });

  const [expandedProject, setExpandedProject] = useState<boolean>(false);

  const handleToggleExpansion = () => {
    setExpandedProject(!expandedProject);
  };

  const handleProjectClick = () => {
    setExpandedProject(true);
    router.push(`/project/${project.projectId}`);
  };

  const isProjectActive = (projectId: string) => {
    return pathname === `/project/${projectId}`;
  };

  return (
    <div className="w-full">
      {/* Project Header */}
      <div
        className={`group relative flex h-8 w-full items-center rounded-medium p-0 hover:bg-neutral-800/50 ${
          isProjectActive(project.projectId || "")
            ? "rounded-xl bg-default-100 text-default-200"
            : "text-neutral-400"
        }`}
      >
        <Button
          aria-expanded={expandedProject}
          aria-label={`${expandedProject ? "Collapse" : "Expand"} project ${project.title}`}
          className="group relative flex h-8 w-full cursor-pointer items-center justify-between rounded-medium bg-transparent pl-3 pr-0 text-small outline-none transition-colors duration-100 hover:bg-transparent hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          type="button"
          onPress={handleProjectClick}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              className="flex-shrink-0 text-neutral-500"
              icon="mdi:folder"
              width={16}
            />
            <span className="truncate">{project.title}</span>
          </div>
        </Button>
        <Button
          isIconOnly
          className="grroup h-8 bg-transparent px-0 py-0 hover:bg-transparent"
          variant="flat"
          onPress={handleToggleExpansion}
        >
          <Icon
            className="text-neutral-400"
            icon={expandedProject ? "mdi:chevron-down" : "mdi:chevron-right"}
            width={18}
          />
        </Button>
      </div>

      {/* Expanded Chat List */}
      {expandedProject && chats && chats.length > 0 && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-neutral-800 pl-1">
          {chats?.map((chat) => (
            <SidebarProjectChat
              key={chat._id}
              chatId={chat.chatId}
              projectId={project.projectId || ""}
              title={chat.title}
              updatedAt={chat.updatedAt}
            />
          ))}
        </div>
      )}

      {/* Empty State for Expanded Project */}
      {expandedProject && chats?.length === 0 && (
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
