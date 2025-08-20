import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateStaffForm from "./CreateStaffForm";

export default async function CreateStaffPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Staff Member</h1>
        <p className="text-gray-600 mt-2">Create a new staff account for your team</p>
      </div>

      <CreateStaffForm user={session.user} />
    </div>
  );
}
