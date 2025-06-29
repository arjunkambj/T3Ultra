"use client";

import React from "react";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";

import ProjectCreateModel from "@/components/project/sub/ProjectCreateModel";
import ProjectList from "@/components/project/ProjectList";
import { useUser } from "@/hooks/useUser";

const ProjectPageComponent = React.memo(function ProjectPageComponent() {
  const user = useUser();

  const loadingState = React.useMemo(
    () => (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner color="white" size="lg" />
      </div>
    ),
    [],
  );

  if (!user) {
    return loadingState;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex h-full w-full max-w-5xl flex-col gap-8 p-6 pt-20">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-3 shadow-lg">
              <Icon
                className="text-neutral-300"
                icon="mdi:folder-multiple"
                width={28}
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
                Projects
              </h1>
              <p className="max-w-md text-base text-neutral-400">
                Organize your chats into projects for better workflow
                management.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProjectCreateModel />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

        {/* Projects List */}
        <div className="flex-1 overflow-hidden">
          <ProjectList />
        </div>
      </div>
    </div>
  );
});

export default ProjectPageComponent;
