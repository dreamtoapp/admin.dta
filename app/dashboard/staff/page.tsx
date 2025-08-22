import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "STAFF") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">لوحة تحكم الموظفين</h1>
        <p className="text-muted-foreground mt-2">
          إدارة مهامك وتتبع تقدم عملك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">مهامي</h3>
          <p className="text-muted-foreground mb-4">عرض وإدارة المهام الموكلة إليك</p>
          <Link
            href="/dashboard/staff/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            عرض المهام
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">سجلات العمل</h3>
          <p className="text-muted-foreground mb-4">تتبع وقتك وأنشطة عملك</p>
          <Link
            href="/dashboard/staff/worklogs"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            إدارة سجلات العمل
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">الملف الشخصي</h3>
          <p className="text-muted-foreground mb-4">تحديث ملفك الشخصي وتفضيلاتك</p>
          <Link
            href="/dashboard/staff/profile"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            تعديل الملف الشخصي
          </Link>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">إجراءات سريعة</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/staff/tasks/create"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            بدء مهمة جديدة
          </Link>
          <Link
            href="/dashboard/staff/worklogs/new"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            تسجيل وقت العمل
          </Link>
          <Link
            href="/dashboard/staff/settings"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
          >
            الإعدادات
          </Link>
        </div>
      </div>
    </div>
  );
}
