import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WorkLogsClient from "./WorkLogsClient";

export default async function WorkLogsPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch work logs data
  const workLogs = await prisma.workLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
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
  const stats = await prisma.workLog.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const workLogStats = {
    total: workLogs.length,
    pending: stats.find(s => s.status === 'PENDING')?._count.id || 0,
    approved: stats.find(s => s.status === 'APPROVED')?._count.id || 0,
    rejected: stats.find(s => s.status === 'REJECTED')?._count.id || 0
  };

  return (
    <WorkLogsClient
      workLogs={workLogs}
      stats={workLogStats}
    />
  );
}

