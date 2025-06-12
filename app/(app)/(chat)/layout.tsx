import Sidebar from "@/components/chat/Sidebar";
import SidebarToggle from "@/components/chat/sub/sidebar-toggle";
import Upgrade from "@/components/pricing/Upgrade";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex max-h-dvh w-full overflow-hidden">
      <Sidebar />
      <main className="relative w-full">
        <SidebarToggle className="absolute left-1 top-3 z-50" />
        {children}
      </main>
    </section>
  );
}
