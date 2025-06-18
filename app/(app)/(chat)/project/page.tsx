"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";
import { Spinner } from "@heroui/spinner";

import { api } from "@/convex/_generated/api";
import ProjectCreateModel from "@/components/project/sub/ProjectCreateModel";
import ProjectList from "@/components/project/ProjectList";

export default function ProjectPageComponent() {
  const user = useQuery(api.function.users.currentUser);

  if (!user) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex h-full w-full max-w-4xl flex-col gap-6 p-6 pt-16">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">Projects</h1>
              <p className="text-sm text-neutral-400">
                Organize your chats into projects for better workflow management
              </p>
            </div>
          </div>

          <ProjectCreateModel />
        </div>

        <ProjectList />
      </div>
    </div>
  );
}
