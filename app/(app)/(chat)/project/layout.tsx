import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAuthenticatedNextjs();

  if (!isAuthenticated) {
    redirect("/chat");
  }

  return <>{children}</>;
}
