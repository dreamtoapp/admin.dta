import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreateTaskForm from "./CreateTaskForm";

export default async function CreateTaskPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  // Fetch staff members for assignment
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-2">Assign a new task to team members</p>
      </div>

      <CreateTaskForm staff={staff} user={session.user} />
    </div>
  );
}
