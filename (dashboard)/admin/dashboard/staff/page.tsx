import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StaffManagementClient from "./StaffManagementClient";

export default async function StaffManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch staff data
  const staff = await prisma.user.findMany({
    where: {
      role: {
        in: ['STAFF', 'ADMIN']
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          tasks: true,
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
      department: { not: null },
      role: { in: ['STAFF', 'ADMIN'] }
    },
    _count: { id: true }
  });

  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s._count.tasks > 0).length,
    departments: departmentStats.length,
    totalTasks: staff.reduce((sum, s) => sum + s._count.tasks, 0)
  };

  return (
    <StaffManagementClient
      staff={staff}
      stats={stats}
      departmentStats={departmentStats.filter(dept => dept.department !== null).map(dept => ({
        department: dept.department as string,
        _count: dept._count
      }))}
    />
  );
}
