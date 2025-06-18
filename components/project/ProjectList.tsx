"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";

import ProjectCard from "./ProjectCard";

import { api } from "@/convex/_generated/api";

export default function ProjectList() {
  const user = useQuery(api.function.users.currentUser);

  const projects = useQuery(
    api.function.project.getProjects,
    user ? { userId: user._id } : "skip",
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            {projects.map((project) => (
              <div key={project._id} className="flex flex-col gap-4">
                <ProjectCard project={project} />
              </div>
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
    </>
  );
}
