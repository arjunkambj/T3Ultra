import Sidebar from "@/components/dashboard/Sidebar";
import UserProfile from "@/components/dashboard/UserProfile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex max-h-dvh w-full overflow-hidden">
      <Sidebar />
      <main className="relative w-full bg-[#0F0F10]">{children}</main>
      <UserProfile />
    </section>
  );
}
