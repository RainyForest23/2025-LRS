import { AdminNav } from "@/components/layout/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">LRS - 관리자</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <AdminNav />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
