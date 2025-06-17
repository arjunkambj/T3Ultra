"use client";
import ProjectCard from "./ProjectCard";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@heroui/spinner";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectList({ userId }: { userId: Id<"users"> }) {
  const projects = useQuery(
    api.function.project.getProjects,
    userId ? { userId: userId } : "skip",
  );

  if (!projects) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="mt-10 text-neutral-400">
              Create your first project to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
