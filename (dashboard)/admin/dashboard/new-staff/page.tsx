import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewStaffClient from "./NewStaffClient";

export default async function NewStaffPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <NewStaffClient user={{
      id: session.user.id,
      fullName: session.user.fullName || session.user.name || null,
      email: session.user.email || '',
      role: session.user.role || 'client'
    }} />
  );
}
