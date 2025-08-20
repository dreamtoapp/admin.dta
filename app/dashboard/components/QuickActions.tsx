import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Plus,
  ClipboardList,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Briefcase
} from "lucide-react";

interface QuickActionsProps {
  userRole: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const actions = getActionsForRole(userRole);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-muted/50 border-border"
              >
                <action.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium text-foreground">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        {/* Quick Stats for the role */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-3">
            {getQuickStatsForRole(userRole).map((stat, index) => (
              <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getActionsForRole(userRole: string) {
  switch (userRole) {
    case 'ADMIN':
      return [
        {
          title: "Add New Staff",
          description: "Create a new staff member account",
          href: "/dashboard/admin/staff/new",
          icon: UserPlus
        },
        {
          title: "Create Task",
          description: "Assign a new task to team members",
          href: "/dashboard/admin/tasks/create",
          icon: Plus
        },
        {
          title: "Performance Analytics",
          description: "View team performance and metrics",
          href: "/dashboard/admin/performance",
          icon: BarChart3
        },
        {
          title: "System Settings",
          description: "Configure system and security",
          href: "/dashboard/admin/settings",
          icon: Settings
        }
      ];

    case 'STAFF':
      return [
        {
          title: "View My Tasks",
          description: "See assigned tasks and deadlines",
          href: "/dashboard/staff/tasks",
          icon: ClipboardList
        },
        {
          title: "Log Work Hours",
          description: "Record time spent on projects",
          href: "/dashboard/staff/worklogs",
          icon: FileText
        },
        {
          title: "Update Profile",
          description: "Manage your personal information",
          href: "/dashboard/staff/profile",
          icon: User
        },
        {
          title: "Submit Report",
          description: "Share progress updates",
          href: "/dashboard/staff/reports",
          icon: FileText
        }
      ];

    case 'CLIENT':
    default:
      return [
        {
          title: "View Projects",
          description: "Track your project progress",
          href: "/dashboard/client/projects",
          icon: Briefcase
        },
        {
          title: "Book Consultation",
          description: "Schedule a meeting with our team",
          href: "/dashboard/client/consultations",
          icon: Calendar
        },
        {
          title: "Send Message",
          description: "Contact our support team",
          href: "/dashboard/client/messages",
          icon: MessageSquare
        },
        {
          title: "Profile Settings",
          description: "Update your account information",
          href: "/dashboard/client/profile",
          icon: User
        }
      ];
  }
}

function getQuickStatsForRole(userRole: string) {
  switch (userRole) {
    case 'ADMIN':
      return [
        { value: "12", label: "Active Staff" },
        { value: "8", label: "Pending Tasks" },
        { value: "94%", label: "System Health" },
        { value: "5", label: "New Reports" }
      ];

    case 'STAFF':
      return [
        { value: "3", label: "Active Tasks" },
        { value: "28h", label: "This Week" },
        { value: "2", label: "Pending Review" },
        { value: "95%", label: "Completion Rate" }
      ];

    case 'CLIENT':
    default:
      return [
        { value: "2", label: "Active Projects" },
        { value: "1", label: "Consultation" },
        { value: "5", label: "Messages" },
        { value: "100%", label: "Satisfaction" }
      ];
  }
}
