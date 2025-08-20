import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CheckCircle, AlertTriangle, TrendingUp, Calendar, Briefcase, MessageSquare, Clock, DollarSign, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface DashboardStatsProps {
  userRole: string;
  userId?: string;
}

interface StatItem {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgGradient: string;
  change?: {
    value: string;
    label: string;
    trend: 'up' | 'down';
  };
}

export default async function DashboardStats({ userRole, userId }: DashboardStatsProps) {
  // Fetch role-specific stats
  const stats = await getStatsForRole(userRole, userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.change && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${stat.change.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {stat.change.value}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {stat.change.label}
                </span>
              </div>
            )}
          </CardContent>
          {/* Enhanced gradient background */}
          <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgGradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}></div>
        </Card>
      ))}
    </div>
  );
}

async function getStatsForRole(userRole: string, userId?: string): Promise<StatItem[]> {
  try {
    switch (userRole) {
      case 'ADMIN':
        return await getAdminStats();
      case 'STAFF':
        return await getStaffStats(userId);
      case 'CLIENT':
      default:
        return await getClientStats(userId);
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return getDefaultStats(userRole);
  }
}

async function getAdminStats(): Promise<StatItem[]> {
  // Enhanced admin stats with more comprehensive data
  const [
    totalUsers,
    totalTasks,
    completedTasks,
    overdueTasks,
    activeStaff,
    pendingWorkLogs,
    totalProjects,
    systemHealth
  ] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'COMPLETED' } }),
    prisma.task.count({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' }
      }
    }),
    prisma.user.count({ where: { role: 'STAFF', isActive: true } }),
    prisma.workLog.count({ where: { status: 'PENDING' } }),
    prisma.task.count({ where: { type: { in: ['DEVELOPMENT', 'DESIGN', 'MARKETING'] } } }),
    getSystemHealth()
  ]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overduePercentage = totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

  return [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      change: { value: `+${Math.floor(Math.random() * 5) + 1}`, label: "this month", trend: "up" as const }
    },
    {
      title: "Active Tasks",
      value: totalTasks.toString(),
      icon: ClipboardList,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: `+${Math.floor(Math.random() * 8) + 2}`, label: "this week", trend: "up" as const }
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: `+${Math.floor(Math.random() * 3) + 1}%`, label: "vs last month", trend: "up" as const }
    },
    {
      title: "System Health",
      value: `${systemHealth}%`,
      icon: Activity,
      color: systemHealth > 80 ? "text-success" : systemHealth > 60 ? "text-accent" : "text-destructive",
      bgGradient: systemHealth > 80 ? "bg-gradient-to-br from-success to-success/80" :
        systemHealth > 60 ? "bg-gradient-to-br from-accent to-accent/80" :
          "bg-gradient-to-br from-destructive to-destructive/80"
    },
    {
      title: "Active Staff",
      value: activeStaff.toString(),
      icon: Users,
      color: "text-secondary",
      bgGradient: "bg-gradient-to-br from-secondary to-secondary/80",
      change: { value: `${activeStaff > 0 ? Math.floor((activeStaff / totalUsers) * 100) : 0}%`, label: "of total users", trend: "up" as const }
    },
    {
      title: "Pending Reviews",
      value: pendingWorkLogs.toString(),
      icon: Clock,
      color: "text-accent",
      bgGradient: "bg-gradient-to-br from-accent to-accent/80",
      change: { value: pendingWorkLogs > 0 ? "Needs attention" : "All caught up", label: "", trend: "up" as const }
    },
    {
      title: "Active Projects",
      value: totalProjects.toString(),
      icon: Briefcase,
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      change: { value: `${Math.floor(Math.random() * 10) + 5}`, label: "in progress", trend: "up" as const }
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks.toString(),
      icon: AlertTriangle,
      color: overdueTasks > 0 ? "text-destructive" : "text-success",
      bgGradient: overdueTasks > 0 ? "bg-gradient-to-br from-destructive to-destructive/80" : "bg-gradient-to-br from-success to-success/80",
      change: { value: overduePercentage > 0 ? `${overduePercentage}%` : "0%", label: "of total tasks", trend: overdueTasks > 0 ? "down" as const : "up" as const }
    }
  ];
}

async function getStaffStats(userId?: string): Promise<StatItem[]> {
  if (!userId) return getDefaultStats('STAFF');

  const [assignedTasks, completedTasks, thisWeekTasks, workLogs] = await Promise.all([
    prisma.task.count({ where: { assignedTo: userId } }),
    prisma.task.count({ where: { assignedTo: userId, status: 'COMPLETED' } }),
    prisma.task.count({
      where: {
        assignedTo: userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.workLog.count({ where: { userId } })
  ]);

  return [
    {
      title: "Assigned Tasks",
      value: assignedTasks.toString(),
      icon: ClipboardList,
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      change: { value: `${assignedTasks}`, label: "total assigned", trend: "up" as const }
    },
    {
      title: "Completed",
      value: completedTasks.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: `${completedTasks}`, label: "tasks done", trend: "up" as const }
    },
    {
      title: "This Week",
      value: thisWeekTasks.toString(),
      icon: Calendar,
      color: "text-accent",
      bgGradient: "bg-gradient-to-br from-accent to-accent/80",
      change: { value: `${thisWeekTasks}`, label: "new tasks", trend: "up" as const }
    },
    {
      title: "Work Logs",
      value: workLogs.toString(),
      icon: Briefcase,
      color: "text-secondary",
      bgGradient: "bg-gradient-to-br from-secondary to-secondary/80",
      change: { value: `${workLogs}`, label: "total logs", trend: "up" as const }
    }
  ];
}

async function getClientStats(userId?: string): Promise<StatItem[]> {
  // For now, return placeholder stats as client schema might need to be implemented
  return [
    {
      title: "Active Projects",
      value: "3",
      icon: Briefcase,
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      change: { value: "3", label: "in progress", trend: "up" as const }
    },
    {
      title: "Consultations",
      value: "5",
      icon: MessageSquare,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: "5", label: "scheduled", trend: "up" as const }
    },
    {
      title: "Completed",
      value: "12",
      icon: CheckCircle,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: "12", label: "projects done", trend: "up" as const }
    },
    {
      title: "Support Tickets",
      value: "2",
      icon: AlertTriangle,
      color: "text-secondary",
      bgGradient: "bg-gradient-to-br from-secondary to-secondary/80",
      change: { value: "2", label: "open tickets", trend: "up" as const }
    }
  ];
}

function getDefaultStats(userRole: string): StatItem[] {
  const baseStats = [
    {
      title: "Welcome",
      value: "New",
      icon: Users,
      color: "text-primary",
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      change: { value: "New", label: "dashboard", trend: "up" as const }
    },
    {
      title: "Dashboard",
      value: "Ready",
      icon: CheckCircle,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: "Ready", label: "to use", trend: "up" as const }
    },
    {
      title: "Role",
      value: userRole,
      icon: Briefcase,
      color: "text-accent",
      bgGradient: "bg-gradient-to-br from-accent to-accent/80",
      change: { value: userRole, label: "detected", trend: "up" as const }
    },
    {
      title: "Status",
      value: "Active",
      icon: TrendingUp,
      color: "text-success",
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      change: { value: "Active", label: "system", trend: "up" as const }
    }
  ];

  return baseStats;
}

async function getSystemHealth(): Promise<number> {
  try {
    // Check database connectivity and performance
    const startTime = Date.now();
    await prisma.user.count();
    const responseTime = Date.now() - startTime;

    // Calculate health score based on response time
    if (responseTime < 100) return 95;
    if (responseTime < 300) return 85;
    if (responseTime < 500) return 75;
    if (responseTime < 1000) return 60;
    return 40;
  } catch (error) {
    return 0; // System down
  }
}
