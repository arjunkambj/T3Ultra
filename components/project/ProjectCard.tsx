"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

import ProjectDeleteModel from "./sub/ProjectDeleteModel";

import { Id } from "@/convex/_generated/dataModel";

interface ProjectCardProps {
  project: {
    _id: Id<"projects">;
    userId: Id<"users">;
    projectId?: string;
    title: string;
    description: string;
    instructions: string;
  };
}

const ProjectCard = React.memo(function ProjectCard({
  project,
}: ProjectCardProps) {
  const router = useRouter();

  const handleViewProject = React.useCallback(() => {
    router.push(`/project/${project.projectId}`);
  }, [router, project.projectId]);

  return (
    <div className="group relative h-full rounded-2xl border border-neutral-700/50 transition-all duration-300 hover:border-neutral-600/50 hover:shadow-lg hover:shadow-neutral-900/20">
      {/* Background glow effect on hover */}

      <div className="relative flex h-full flex-col justify-between p-6">
        {/* Content Section */}
        <div className="space-y-4">
          {/* Header with icon */}
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-2.5 shadow-sm">
              <Icon className="text-neutral-300" icon="mdi:folder" width={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold leading-tight text-neutral-100">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
            {project.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4">
          <Button
            className="flex-1 bg-neutral-100 font-medium text-neutral-900 transition-all duration-200 hover:bg-neutral-200"
            startContent={<Icon icon="mdi:chat" width={16} />}
            onPress={handleViewProject}
          >
            Start Chat
          </Button>

          <div className="opacity-60 transition-opacity duration-200 group-hover:opacity-100">
            <ProjectDeleteModel id={project._id} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
