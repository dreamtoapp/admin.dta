import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization, staff, and projects from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Staff Management</h3>
          <p className="text-muted-foreground mb-4">Manage team members and their roles</p>
          <Link
            href="/dashboard/admin/staff"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Staff
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Task Management</h3>
          <p className="text-muted-foreground mb-4">Create and assign tasks to team members</p>
          <Link
            href="/dashboard/admin/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Tasks
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Performance Analytics</h3>
          <p className="text-muted-foreground mb-4">Track team performance and productivity</p>
          <Link
            href="/dashboard/admin/performance"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Analytics
          </Link>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/admin/staff/new"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Add New Staff
          </Link>
          <Link
            href="/dashboard/admin/tasks/create"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Create Task
          </Link>
          <Link
            href="/dashboard/admin/settings"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
