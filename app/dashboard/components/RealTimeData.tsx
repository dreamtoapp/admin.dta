import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  FileText,
  MessageSquare,
  Eye,
  ArrowRight
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface RealTimeDataProps {
  userRole: string;
}

export default async function RealTimeData({ userRole }: RealTimeDataProps) {
  if (userRole !== 'ADMIN') {
    return null; // Only show for admin users
  }

  // Fetch real-time data
  const [recentTasks, pendingWorkLogs, newUsers, systemNotifications] = await Promise.all([
    prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: { select: { fullName: true, email: true } },
        assigner: { select: { fullName: true } }
      }
    }),
    prisma.workLog.findMany({
      take: 5,
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true } } }
    }),
    prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      where: { role: { in: ['STAFF', 'CLIENT'] } }
    }),
    getSystemNotifications()
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Tasks */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Tasks
          </CardTitle>
          <Link href="/dashboard/admin/tasks">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {task.assignee?.fullName || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getTaskStatusVariant(task.status)}>
                      {task.status}
                    </Badge>
                    <Link href={`/dashboard/admin/tasks/${task.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No recent tasks</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Work Logs */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Pending Reviews
          </CardTitle>
          <Link href="/dashboard/admin/worklogs">
            <Button variant="ghost" size="sm">
              Review All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingWorkLogs.length > 0 ? (
              pendingWorkLogs.map((workLog) => (
                <div key={workLog.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {workLog.user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {workLog.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workLog.user.fullName || workLog.user.email} • {(workLog.timeSpentMin / 60).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/admin/worklogs/${workLog.id}`}>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
                <p className="text-sm text-muted-foreground">All work logs reviewed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-success" />
            New Users
          </CardTitle>
          <Link href="/dashboard/admin/staff">
            <Button variant="ghost" size="sm">
              Manage Users
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {newUsers.length > 0 ? (
              newUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="text-xs">
                        {user.fullName?.split(' ').map(n => n[0]).join('') || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.fullName || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <UserPlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No new users</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-secondary" />
            System Notifications
          </CardTitle>
          <Button variant="ghost" size="sm">
            Mark All Read
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemNotifications.length > 0 ? (
              systemNotifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'info' ? 'bg-primary' :
                    notification.type === 'warning' ? 'bg-accent' : 'bg-success'
                    }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getTaskStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'default';
    case 'IN_PROGRESS':
      return 'secondary';
    case 'PENDING':
      return 'outline';
    case 'OVERDUE':
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

async function getSystemNotifications() {
  // Simulate system notifications - in a real app, these would come from a notifications table
  return [
    {
      type: 'info' as const,
      title: 'System Update',
      message: 'Database backup completed successfully',
      timestamp: '2 minutes ago'
    },
    {
      type: 'warning' as const,
      title: 'Performance Alert',
      message: '3 tasks approaching deadline this week',
      timestamp: '15 minutes ago'
    },
    {
      type: 'success' as const,
      title: 'New Feature',
      message: 'Work log review system is now live',
      timestamp: '1 hour ago'
    }
  ];
}
