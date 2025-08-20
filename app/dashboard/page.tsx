import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardStats from "./components/DashboardStats";
import PerformanceCharts from "./components/PerformanceCharts";
import RealTimeData from "./components/RealTimeData";
import RecentActivity from "./components/RecentActivity";
import AdminOverview from "./components/AdminOverview";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const userRole = session.user?.role || "client";

  return (
    <div className="p-6 space-y-6">
      

      {/* Admin Overview - Admin Only */}
      {userRole === 'ADMIN' && (
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-muted rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>}>
          <AdminOverview userRole={userRole} />
        </Suspense>
      )}

      {/* Stats Cards */}
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>}>
        <DashboardStats userRole={userRole} userId={session.user?.id} />
      </Suspense>

      {/* Performance Charts - Admin Only */}
      {userRole === 'ADMIN' && (
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-muted rounded w-3/4"></div>
                ))}
              </div>
            </div>
          ))}
        </div>}>
          <PerformanceCharts userRole={userRole} />
        </Suspense>
      )}

      {/* Real-Time Data - Admin Only */}
      {userRole === 'ADMIN' && (
        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>}>
          <RealTimeData userRole={userRole} />
        </Suspense>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Suspense fallback={<div className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>}>
            <RecentActivity userRole={userRole} userId={session.user?.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
