import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ViewTasksClient from "./ViewTasksClient";

export default async function ViewTasksPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch all tasks with related data
  const tasks = await prisma.task.findMany({
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true
        }
      },
      assigner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get task statistics
  const taskStats = await prisma.task.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const stats = {
    total: tasks.length,
    pending: taskStats.find(t => t.status === 'PENDING')?._count.id || 0,
    inProgress: taskStats.find(t => t.status === 'IN_PROGRESS')?._count.id || 0,
    review: taskStats.find(t => t.status === 'REVIEW')?._count.id || 0,
    completed: taskStats.find(t => t.status === 'COMPLETED')?._count.id || 0
  };

  return (
    <ViewTasksClient tasks={tasks} stats={stats} user={{
      id: session.user.id,
      name: session.user.name || session.user.fullName || null,
      email: session.user.email || '',
      role: session.user.role || 'client'
    }} />
  );
}

