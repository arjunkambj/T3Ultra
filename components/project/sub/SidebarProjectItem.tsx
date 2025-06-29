"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import SidebarProjectChat from "./SidebarProjectChat";

import { Id } from "@/convex/_generated/dataModel";

interface Chat {
  _id: string;
  chatId: string;
  title: string;
}

interface Project {
  _id: Id<"projects">;
  projectId?: string;
  title: string;
  description: string;
  instructions: string;
  userId: Id<"users">;
  chats?: Chat[];
}

interface ProjectItemProps {
  project: Project;
}

const SidebarProjectItem = React.memo(function SidebarProjectItem({
  project,
}: ProjectItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Use pre-fetched chats from the project object instead of making separate query
  const chats = project.chats || [];

  const [expandedProject, setExpandedProject] = useState<boolean>(false);

  const handleToggleExpansion = useCallback(() => {
    setExpandedProject((prev) => !prev);
  }, []);

  const handleProjectClick = useCallback(() => {
    setExpandedProject(true);
    router.push(`/project/${project.projectId}`);
  }, [router, project.projectId]);

  const isProjectActive = useMemo(() => {
    return pathname === `/project/${project.projectId}`;
  }, [pathname, project.projectId]);

  const chatCount = chats.length;

  const chatElements = useMemo(
    () =>
      chats.map((chat) => (
        <SidebarProjectChat
          key={chat._id}
          chatId={chat.chatId}
          projectId={project.projectId || ""}
          title={chat.title}
        />
      )),
    [chats, project.projectId],
  );

  const emptyState = useMemo(
    () => (
      <div className="ml-6 mt-2 border-l border-neutral-800/30 pl-3">
        <div className="flex items-center gap-2 py-2 text-xs text-neutral-600">
          <Icon icon="mdi:chat-plus" width={12} />
          <span>No chats yet</span>
        </div>
      </div>
    ),
    [],
  );

  return (
    <div className="w-full">
      {/* Project Header */}
      <div
        className={`group relative flex h-8 w-full items-center rounded-lg transition-colors hover:bg-neutral-800/30 ${
          isProjectActive
            ? "bg-neutral-800/50 text-neutral-100"
            : "text-neutral-400"
        }`}
      >
        <Button
          aria-expanded={expandedProject}
          aria-label={`${expandedProject ? "Collapse" : "Expand"} project ${project.title}`}
          className="group relative flex h-8 w-full cursor-pointer items-center justify-between rounded-lg bg-transparent pl-3 pr-1 text-sm outline-none transition-colors duration-150 hover:bg-transparent hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          type="button"
          onPress={handleProjectClick}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              className="flex-shrink-0 text-neutral-500"
              icon="mdi:folder"
              width={14}
            />
            <span className="truncate text-xs">{project.title}</span>
            {chatCount > 0 && (
              <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-700 px-1 text-xs text-neutral-300">
                {chatCount}
              </span>
            )}
          </div>
        </Button>
        <Button
          isIconOnly
          className="h-6 w-6 bg-transparent p-0 hover:bg-neutral-700/50"
          size="sm"
          variant="light"
          onPress={handleToggleExpansion}
        >
          <Icon
            className="text-neutral-500 transition-transform duration-150"
            icon={expandedProject ? "mdi:chevron-down" : "mdi:chevron-right"}
            width={14}
          />
        </Button>
      </div>

      {/* Expanded Chat List */}
      {expandedProject && chatCount > 0 && (
        <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-neutral-800/30 pl-3">
          {chatElements}
        </div>
      )}

      {/* Empty State for Expanded Project */}
      {expandedProject && chatCount === 0 && emptyState}
    </div>
  );
});

export default SidebarProjectItem;
