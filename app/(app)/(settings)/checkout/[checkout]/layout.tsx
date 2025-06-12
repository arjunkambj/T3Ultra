export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center from-slate-50 to-gray-100">
      {children}
    </div>
  );
}
