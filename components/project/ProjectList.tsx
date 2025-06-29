"use client";

import React from "react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";

import ProjectCard from "./ProjectCard";

import { api } from "@/convex/_generated/api";

const ProjectList = React.memo(function ProjectList() {
  const user = useQuery(api.function.users.currentUser);

  const projects = useQuery(
    api.function.project.getProjects,
    user ? { userId: user._id } : "skip",
  );

  const loadingState = React.useMemo(
    () => (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner color="white" size="md" />
          <p className="text-sm text-neutral-500">Loading your projects...</p>
        </div>
      </div>
    ),
    [],
  );

  const emptyState = React.useMemo(
    () => (
      <div className="flex flex-col items-center justify-center gap-6 py-16">
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 scale-150 rounded-full" />
          <div className="relative rounded-2xl border border-neutral-700/50 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-6">
            <Icon
              className="text-neutral-400"
              icon="mdi:folder-plus-outline"
              width={56}
            />
          </div>
        </div>

        <div className="max-w-md space-y-3 text-center">
          <h3 className="text-xl font-semibold text-neutral-200">
            No projects yet
          </h3>
          <p className="leading-relaxed text-neutral-400">
            Create your first project to start organizing your chats and boost
            your productivity
          </p>
        </div>
      </div>
    ),
    [],
  );

  if (!projects) {
    return loadingState;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {projects.length > 0 ? (
        <div className="space-y-6">
          {/* Projects count */}
          <div className="flex items-center gap-2 px-1">
            <Icon
              className="text-neutral-500"
              icon="mdi:folder-multiple"
              width={16}
            />
            <span className="text-sm text-neutral-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        emptyState
      )}
    </div>
  );
});

export default ProjectList;
