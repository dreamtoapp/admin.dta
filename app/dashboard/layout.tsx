import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-background">
        <Suspense fallback={<div className="w-64 bg-card border-r border-border animate-pulse" />}>
          <Sidebar user={{
            name: session.user.name || session.user.fullName || null,
            email: session.user.email || '',
            role: session.user.role || 'client'
          }} />
        </Suspense>

        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div className="p-6 animate-pulse">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </SessionProvider>
  );
}
