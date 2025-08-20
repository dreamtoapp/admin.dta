"use client";

import { useState, useEffect } from "react";
import { StatsCards, DashboardTabs } from "./components";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department?: string;
}

interface Stats {
  totalUsers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

interface DepartmentStat {
  department: string;
  userCount: number;
}

interface RecentActivity {
  id: string;
  action: string;
  details?: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  task: {
    title: string;
  };
}

interface AdminDashboardClientProps {
  user: User;
  stats: Stats;
  departmentStats: DepartmentStat[];
  recentActivity: RecentActivity[];
  performanceMetrics: any[];
  workLogStats: {
    pendingReviews: number;
    approvedToday: number;
    rejectedToday: number;
  };
}

export default function AdminDashboardClient({
  user,
  stats,
  departmentStats,
  recentActivity,
  performanceMetrics,
  workLogStats
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format date safely to avoid hydration mismatch
  const formatDate = (date: Date) => {
    if (!isClient) return ""; // Return empty string on server
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        {/* Quick Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tab Content */}
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          departmentStats={departmentStats}
          recentActivity={recentActivity}
          workLogStats={workLogStats}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
