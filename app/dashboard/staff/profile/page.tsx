import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffProfileClient from "./StaffProfileClient";
import { UserRole } from "@/constant/enums";

export default async function StaffProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user?.role !== UserRole.STAFF && session.user?.role !== UserRole.CLIENT) redirect("/dashboard");

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ملفي الشخصي</h1>
        <p className="text-muted-foreground mt-2">تحديث معلوماتك الشخصية</p>
      </div>
      <StaffProfileClient />
    </div>
  );
}


