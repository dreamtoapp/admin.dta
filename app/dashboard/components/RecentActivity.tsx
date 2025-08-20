import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  Calendar,
  Briefcase,
  TrendingUp
} from "lucide-react";
import { prisma } from "@/lib/prisma";

interface RecentActivityProps {
  userRole: string;
  userId?: string;
}

export default async function RecentActivity({ userRole, userId }: RecentActivityProps) {
  const activities = await getActivitiesForRole(userRole, userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.iconBg}`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    {activity.badge && (
                      <Badge variant={activity.badge.variant as any} className="text-xs">
                        {activity.badge.text}
                      </Badge>
                    )}
                  </div>
                </div>
                {activity.avatar && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">Activity will appear here as you use the system</p>
            </div>
          )}
        </div>

        {/* View all activity link */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View all activity →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function getActivitiesForRole(userRole: string, userId?: string) {
  try {
    switch (userRole) {
      case 'ADMIN':
        return await getAdminActivities();
      case 'STAFF':
        return await getStaffActivities(userId);
      case 'CLIENT':
      default:
        return await getClientActivities(userId);
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
    return getDefaultActivities(userRole);
  }
}

async function getAdminActivities() {
  // Get recent tasks, user registrations, etc.
  const [recentTasks, recentUsers] = await Promise.all([
    prisma.task.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { assignee: true, assigner: true }
    }),
    prisma.user.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      where: { role: { in: ['STAFF', 'CLIENT'] } }
    })
  ]);

  const activities: any[] = [];

  // Add task activities
  recentTasks.forEach(task => {
    activities.push({
      title: `New task created: ${task.title}`,
      description: `Assigned to ${task.assignee?.fullName || 'Unassigned'}`,
      timestamp: formatRelativeTime(task.createdAt),
      icon: CheckCircle,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      badge: { text: task.status, variant: getStatusVariant(task.status) },
      initials: task.assignee?.fullName?.split(' ').map(n => n[0]).join('') || 'UN'
    });
  });

  // Add user activities
  recentUsers.forEach(user => {
    activities.push({
      title: `New ${user.role?.toLowerCase()} joined`,
      description: user.fullName || user.email,
      timestamp: formatRelativeTime(user.createdAt),
      icon: User,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      badge: { text: user.role, variant: 'secondary' },
      initials: user.fullName?.split(' ').map(n => n[0]).join('') || 'U'
    });
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
}

async function getStaffActivities(userId?: string) {
  if (!userId) return getDefaultActivities('STAFF');

  const [recentTasks, recentWorkLogs] = await Promise.all([
    prisma.task.findMany({
      take: 3,
      where: { assignedTo: userId },
      orderBy: { updatedAt: 'desc' },
      include: { assigner: true }
    }),
    prisma.workLog.findMany({
      take: 2,
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const activities: any[] = [];

  // Add task activities
  recentTasks.forEach(task => {
    activities.push({
      title: `Task updated: ${task.title}`,
      description: `Status: ${task.status}`,
      timestamp: formatRelativeTime(task.updatedAt),
      icon: Clipboard,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      badge: { text: task.status, variant: getStatusVariant(task.status) }
    });
  });

  // Add work log activities
  recentWorkLogs.forEach(workLog => {
    activities.push({
      title: `Work log submitted`,
      description: `${(workLog.timeSpentMin / 60).toFixed(1)}h - ${workLog.summary}`,
      timestamp: formatRelativeTime(workLog.createdAt),
      icon: FileText,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      badge: { text: workLog.status, variant: getStatusVariant(workLog.status) }
    });
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
}

async function getClientActivities(userId?: string) {
  // For now, return placeholder activities as client-specific schema might need implementation
  return [
    {
      title: "Welcome to DreamToApp!",
      description: "Your dashboard is ready for use",
      timestamp: "2 hours ago",
      icon: CheckCircle,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      badge: { text: 'Welcome', variant: 'secondary' }
    },
    {
      title: "Profile created",
      description: "Your account setup is complete",
      timestamp: "1 day ago",
      icon: User,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      badge: { text: 'Complete', variant: 'secondary' }
    }
  ];
}

function getDefaultActivities(userRole: string) {
  return [
    {
      title: "Welcome to your dashboard!",
      description: "Your unified dashboard is ready to use",
      timestamp: "Just now",
      icon: CheckCircle,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      badge: { text: 'New', variant: 'secondary' }
    },
    {
      title: "System status: Online",
      description: "All systems are operational",
      timestamp: "5 minutes ago",
      icon: TrendingUp,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      badge: { text: 'Healthy', variant: 'secondary' }
    }
  ];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'default';
    case 'IN_PROGRESS':
      return 'secondary';
    case 'PENDING':
      return 'outline';
    case 'OVERDUE':
    case 'REJECTED':
      return 'destructive';
    default:
      return 'secondary';
  }
}
