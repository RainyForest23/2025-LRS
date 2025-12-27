import { createClient } from "@/lib/supabase/server";
import { NavMenu } from "@/components/layout/nav-menu";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user role using regular client (RLS allows users to view their own profile)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (userError) {
    console.error('[Dashboard Layout] Error fetching user role:', userError);
  }

  const userRole = userData?.role || 'member';
  console.log('[Dashboard Layout] User role:', userRole);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">LRS - 강의체험단</h1>
            <NavMenu userRole={userRole} />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
