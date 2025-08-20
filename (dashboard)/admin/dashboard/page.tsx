import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Ensure user has required properties
  if (!session!.user.name) {
    redirect('/auth/signin');
  }

  // Create a properly typed user object with null safety
  const typedUser = {
    id: session!.user.id,
    name: session!.user.name || null,
    email: session!.user.email || '',
    role: session!.user.role,
    department: session!.user.department || undefined
  };

  // Fetch comprehensive admin data including work logs
  const [
    totalUsers,
    totalTasks,
    tasksByStatus,
    tasksByDepartment,
    recentActivity,
    performanceMetrics,
    workLogStatsRaw
  ] = await Promise.all([
    // Total users count
    prisma.user.count(),

    // Total tasks count
    prisma.task.count(),

    // Tasks by status
    prisma.task.groupBy({
      by: ['status'],
      _count: { status: true }
    }),

    // Tasks by department
    prisma.user.groupBy({
      by: ['department'],
      _count: { id: true },
      where: { department: { not: null } }
    }),

    // Recent activity (last 10 actions)
    prisma.taskHistory.findMany({
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        task: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),

    // Performance metrics
    prisma.task.groupBy({
      by: ['status'],
      _count: { status: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    }),

    // Work log statistics for staff productivity
    prisma.workLog.groupBy({
      by: ['status'],
      _count: { id: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
  ]);

  // Calculate stats
  const stats = {
    totalUsers,
    totalTasks,
    pendingTasks: tasksByStatus.find(t => t.status === 'PENDING')?._count.status || 0,
    inProgressTasks: tasksByStatus.find(t => t.status === 'IN_PROGRESS')?._count.status || 0,
    reviewTasks: tasksByStatus.find(t => t.status === 'REVIEW')?._count.status || 0,
    completedTasks: tasksByStatus.find(t => t.status === 'COMPLETED')?._count.status || 0,
    overdueTasks: 0, // TODO: Calculate based on due dates
    completionRate: totalTasks > 0 ? Math.round((tasksByStatus.find(t => t.status === 'COMPLETED')?._count.status || 0) / totalTasks * 100) : 0
  };

  // Department stats
  const departmentStats = tasksByDepartment
    .filter(dept => dept.department !== null)
    .map(dept => ({
      department: dept.department as string,
      userCount: dept._count.id
    }));

  // Work log stats for today
  const workLogStats = {
    pendingReviews: workLogStatsRaw.find(w => w.status === 'PENDING')?._count.id || 0,
    approvedToday: workLogStatsRaw.find(w => w.status === 'APPROVED')?._count.id || 0,
    rejectedToday: workLogStatsRaw.find(w => w.status === 'REJECTED')?._count.id || 0
  };

  // Filter out null values from recent activity
  const filteredRecentActivity = recentActivity
    .filter(activity => activity.user.name !== null)
    .map(activity => ({
      ...activity,
      user: {
        ...activity.user,
        name: activity.user.name as string
      },
      details: activity.details || undefined
    }));

  return (
    <AdminDashboardClient
      user={typedUser}
      stats={stats}
      departmentStats={departmentStats}
      recentActivity={filteredRecentActivity}
      performanceMetrics={performanceMetrics}
      workLogStats={workLogStats}
    />
  );
}
