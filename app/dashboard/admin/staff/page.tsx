import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StaffManagementClient from "./StaffManagementClient";

export default async function StaffManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch all staff members with their departments and task counts
  const staff = await prisma.user.findMany({
    where: {
      role: { in: ['STAFF', 'ADMIN'] }
    },
    include: {
      _count: {
        select: {
          assignedTasks: true,
          workLogs: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get department statistics
  const departmentStats = await prisma.user.groupBy({
    by: ['department'],
    where: {
      role: { in: ['STAFF', 'ADMIN'] },
      department: { not: null }
    },
    _count: { id: true }
  }).then(stats => stats.filter(dept => dept.department !== null).map(dept => ({
    department: dept.department as string,
    _count: dept._count
  })));

  // Get staff statistics
  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.length, // All staff are considered active for now
    departments: departmentStats.length,
    totalTasks: staff.reduce((sum, s) => sum + s._count.assignedTasks, 0),
    totalWorkLogs: staff.reduce((sum, s) => sum + s._count.workLogs, 0)
  };

  return (
    <StaffManagementClient
      staff={staff}
      stats={stats}
      departmentStats={departmentStats}
      user={session.user}
    />
  );
}
