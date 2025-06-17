"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import ProjectCard from "./ProjectCard";

// Mock data - replace with actual data from Convex
const projects = [
  {
    id: "project-1",
    title: "E-commerce Platform",
    description:
      "Building a modern e-commerce solution with Next.js and Stripe integration",
  },
  {
    id: "project-2",
    title: "AI Chat Application",
    description:
      "Intelligent chat system with multiple AI models and context awareness",
  },
  {
    id: "project-3",
    title: "Mobile App Development",
    description: "Cross-platform mobile application using React Native",
  },
];

export default function ProjectPage() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/create-project");
  };

  return (
    <div className="flex h-full w-full max-w-4xl flex-col gap-6 p-6 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">Projects</h1>
            <p className="text-sm text-neutral-400">
              Organize your chats into projects for better workflow management
            </p>
          </div>
        </div>

        <Button
          className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          startContent={<Icon icon="mdi:plus" width={20} />}
          onPress={handleCreateProject}
        >
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-neutral-400">
              Create your first project to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
