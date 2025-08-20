import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch system settings and configuration
  const [
    userCounts,
    systemStats,
    departments
  ] = await Promise.all([
    // User counts by role
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    }),

    // System statistics using proper Prisma queries
    Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.workLog.count(),
      prisma.taskHistory.count()
    ]),

    // Available departments
    prisma.user.groupBy({
      by: ['department'],
      where: { department: { not: null } },
      _count: { id: true }
    })
  ]);

  const [totalUsers, totalTasks, totalWorkLogs, totalHistory] = systemStats;

  const settings = {
    userCounts: userCounts.reduce((acc, curr) => {
      acc[curr.role] = curr._count.id;
      return acc;
    }, {} as Record<string, number>),
    departments: departments.map(d => d.department),
    systemStats: {
      total_users: totalUsers,
      total_tasks: totalTasks,
      total_worklogs: totalWorkLogs,
      total_history: totalHistory
    }
  };

  return (
    <SettingsClient
      settings={settings}
      user={{
        id: session.user.id,
        name: session.user.name || session.user.fullName || null,
        email: session.user.email || '',
        role: session.user.role || 'client'
      }}
    />
  );
}
