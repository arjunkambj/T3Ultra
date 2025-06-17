"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleViewProject = () => {
    router.push(`/project/${project.id}`);
  };

  const handleDelete = () => {
    addToast({
      title: "Delete project",
      description: "Delete project - Coming soon",
      color: "danger",
      timeout: 3000,
    });
  };

  return (
    <div className="group relative rounded-2xl border border-neutral-700 bg-neutral-900 shadow-sm">
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
            <Button
              isIconOnly
              className="bg-neutral-800 text-sm text-danger hover:bg-danger hover:text-white"
              size="sm"
              variant="flat"
              onPress={handleDelete}
            >
              <Icon icon="mdi:delete" width={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
