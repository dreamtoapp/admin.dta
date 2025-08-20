import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "client") {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Client Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your projects and communicate with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">My Projects</h3>
          <p className="text-muted-foreground mb-4">View the status of your ongoing projects</p>
          <Link
            href="/dashboard/client/projects"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Projects
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Consultations</h3>
          <p className="text-muted-foreground mb-4">Schedule and manage consultation sessions</p>
          <Link
            href="/dashboard/client/consultations"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Consultations
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Profile</h3>
          <p className="text-muted-foreground mb-4">Update your profile and preferences</p>
          <Link
            href="/dashboard/client/profile"
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
            href="/dashboard/client/projects/new"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Start New Project
          </Link>
          <Link
            href="/dashboard/client/consultations/new"
            className="px-4 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors"
          >
            Book Consultation
          </Link>
          <Link
            href="/dashboard/client/settings"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
