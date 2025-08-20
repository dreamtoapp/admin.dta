import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsManagementClient from "./SettingsManagementClient";

export default async function SettingsManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Get system statistics for settings context
  const systemStats = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.workLog.count(),
    // Get recent activities count
    prisma.task.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
  ]);

  const [totalUsers, totalTasks, totalWorkLogs, recentActivity] = systemStats;

  // Get department list for management
  const departments = await prisma.user.groupBy({
    by: ['department'],
    where: {
      department: { not: null }
    },
    _count: { id: true }
  }).then(depts => depts.filter(d => d.department !== null).map(d => ({
    name: d.department as string,
    userCount: d._count.id
  })));

  const systemInfo = {
    totalUsers,
    totalTasks,
    totalWorkLogs,
    recentActivity,
    departments,
    version: "2.0.0",
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    uptime: "99.9%"
  };

  return (
    <SettingsManagementClient
      systemInfo={systemInfo}
      user={session.user}
    />
  );
}
