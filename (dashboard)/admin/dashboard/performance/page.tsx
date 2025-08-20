import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PerformanceClient from "./PerformanceClient";

export default async function PerformancePage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch performance data for the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    taskPerformance,
    userPerformance,
    departmentPerformance,
    workLogPerformance
  ] = await Promise.all([
    // Task completion rates by status
    prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    }),

    // User performance metrics
    prisma.user.findMany({
      where: {
        role: { in: ['STAFF', 'ADMIN'] }
      },
      select: {
        id: true,
        name: true,
        department: true,
        _count: {
          select: {
            tasks: true,
            workLogs: true
          }
        },
        tasks: {
          where: {
            createdAt: { gte: thirtyDaysAgo }
          },
          select: {
            status: true,
            createdAt: true
          }
        }
      }
    }),

    // Department performance
    prisma.user.groupBy({
      by: ['department'],
      where: {
        department: { not: null },
        role: { in: ['STAFF', 'ADMIN'] }
      },
      _count: { id: true }
    }),

    // Work log performance
    prisma.workLog.groupBy({
      by: ['status'],
      _count: { id: true },
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })
  ]);

  // Calculate performance metrics
  const totalTasks = taskPerformance.reduce((sum, t) => sum + t._count.id, 0);
  const completedTasks = taskPerformance.find(t => t.status === 'COMPLETED')?._count.id || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const performanceStats = {
    totalTasks,
    completedTasks,
    completionRate,
    totalUsers: userPerformance.length,
    totalWorkLogs: workLogPerformance.reduce((sum, w) => sum + w._count.id, 0),
    approvedWorkLogs: workLogPerformance.find(w => w.status === 'APPROVED')?._count.id || 0
  };

  return (
    <PerformanceClient
      performanceStats={performanceStats}
      userPerformance={userPerformance}
      departmentPerformance={departmentPerformance.filter(dept => dept.department !== null).map(dept => ({
        department: dept.department as string,
        _count: dept._count
      }))}
      taskPerformance={taskPerformance}
    />
  );
}
