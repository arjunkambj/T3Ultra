import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function AgentLayout({
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
