import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TaskManagementClient from "./TaskManagementClient";

export default async function TaskManagementPage() {
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
          fullName: true,
          email: true,
          department: true
        }
      },
      assigner: {
        select: {
          id: true,
          name: true,
          fullName: true,
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
    completed: taskStats.find(t => t.status === 'COMPLETED')?._count.id || 0,
    overdue: tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
    ).length
  };

  // Get staff members for assignment
  const staff = await prisma.user.findMany({
    where: {
      role: { in: ['STAFF', 'ADMIN'] }
    },
    select: {
      id: true,
      name: true,
      fullName: true,
      email: true,
      department: true
    }
  });

  return (
    <TaskManagementClient
      tasks={tasks}
      stats={stats}
      staff={staff}
      user={session.user}
    />
  );
}
