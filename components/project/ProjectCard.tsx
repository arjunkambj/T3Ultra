"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Id } from "@/convex/_generated/dataModel";
import ProjectDeleteModel from "./sub/ProjectDeleteModel";

interface Project {
  _id: Id<"projects">;
  projectId: string;
  title: string;
  description: string;
  instructions: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleViewProject = () => {
    router.push(`/project/${project.projectId}`);
  };

  return (
    <div className="group relative rounded-2xl border border-neutral-700 bg-neutral-900 shadow-none">
      <div className="flex w-full justify-between p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-neutral-100">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400">{project.description}</p>
        </div>

        <div className="flex items-end">
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-200 transition-colors hover:bg-neutral-700"
              onPress={handleViewProject}
            >
              <Icon icon="mdi:chat" width={16} />
              Start Chat
            </Button>
            <ProjectDeleteModel projectId={project._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
