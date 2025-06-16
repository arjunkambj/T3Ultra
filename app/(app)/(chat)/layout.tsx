import Sidebar from "@/components/chat/Sidebar";
import TopMenuBar from "@/components/chat/TopMenuBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex max-h-dvh w-full overflow-hidden">
      <Sidebar />
      <main className="relative w-full">{children}</main>
    </section>
  );
}
