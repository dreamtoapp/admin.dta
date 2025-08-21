import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffProfileClient from "./StaffProfileClient";
import { UserRole } from "@/constant/enums";

export default async function StaffProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user?.role !== UserRole.STAFF && session.user?.role !== UserRole.CLIENT) redirect("/dashboard");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Update your personal information</p>
      </div>
      <StaffProfileClient user={{
        id: session.user.id,
        name: session.user.name || session.user.fullName || null,
        email: session.user.email || "",
        role: session.user.role,
        department: (session.user as any).department,
      }} />
    </div>
  );
}


