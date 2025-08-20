import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreateTaskClient from "./CreateTaskClient";

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
      email: true,
      department: true
    }
  });

  return (
    <CreateTaskClient user={{
      id: session.user.id,
      name: session.user.name || session.user.fullName || null,
      email: session.user.email || '',
      role: session.user.role || 'client'
    }} staff={staff} />
  );
}

