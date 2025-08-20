import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewClientClient from "./NewClientClient";

export default async function NewClientPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <NewClientClient user={{
      id: session.user.id,
      name: session.user.name || session.user.fullName || null,
      email: session.user.email || '',
      role: session.user.role || 'client'
    }} />
  );
}

