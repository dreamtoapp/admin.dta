import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WorkLogsManagementClient from "./WorkLogsManagementClient";

export default async function WorkLogsManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch all work logs with related data
  const workLogs = await prisma.workLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
          department: true
        }
      },
      task: {
        select: {
          id: true,
          title: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get work log statistics
  const workLogStats = await prisma.workLog.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const stats = {
    total: workLogs.length,
    pending: workLogs.filter(w => w.status === 'PENDING').length,
    approved: workLogs.filter(w => w.status === 'APPROVED').length,
    rejected: workLogs.filter(w => w.status === 'REJECTED').length,
    totalHours: workLogs.reduce((sum, w) => sum + (w.timeSpentMin / 60), 0),
    pendingReviews: workLogs.filter(w => w.status === 'PENDING').length
  };

  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = {
    approvedToday: workLogs.filter(w =>
      w.status === 'APPROVED' &&
      w.updatedAt >= today
    ).length,
    rejectedToday: workLogs.filter(w =>
      w.status === 'REJECTED' &&
      w.updatedAt >= today
    ).length,
    hoursToday: workLogs.filter(w =>
      w.status === 'APPROVED' &&
      w.updatedAt >= today
    ).reduce((sum, w) => sum + (w.timeSpentMin / 60), 0)
  };

  return (
    <WorkLogsManagementClient
      workLogs={workLogs}
      stats={stats}
      todayStats={todayStats}
      user={session.user}
    />
  );
}
