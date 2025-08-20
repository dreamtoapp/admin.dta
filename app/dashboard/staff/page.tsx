import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "staff") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tasks and track your work progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">My Tasks</h3>
          <p className="text-muted-foreground mb-4">View and manage your assigned tasks</p>
          <Link
            href="/dashboard/staff/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Tasks
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Work Logs</h3>
          <p className="text-muted-foreground mb-4">Track your time and work activities</p>
          <Link
            href="/dashboard/staff/worklogs"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Work Logs
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Profile</h3>
          <p className="text-muted-foreground mb-4">Update your profile and preferences</p>
          <Link
            href="/dashboard/staff/profile"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/staff/tasks/create"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Start New Task
          </Link>
          <Link
            href="/dashboard/staff/worklogs/new"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Log Work Time
          </Link>
          <Link
            href="/dashboard/staff/settings"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
