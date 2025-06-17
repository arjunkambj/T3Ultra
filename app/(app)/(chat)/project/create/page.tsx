import ProjectFoam from "@/components/project/CreateProjectFoam";

export default function CreateProjectPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0F0F10]">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0F0F10]">
        <h1 className="text-2xl font-bold">Create Project</h1>
        <ProjectFoam />
      </div>
    </div>
  );
}
