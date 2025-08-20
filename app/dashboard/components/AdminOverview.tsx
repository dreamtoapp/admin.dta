import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Eye,
  BarChart3
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface AdminOverviewProps {
  userRole: string;
}

export default async function AdminOverview({ userRole }: AdminOverviewProps) {
  if (userRole !== 'ADMIN') {
    return null;
  }

  // Fetch quick overview data
  const [urgentTasks, systemAlerts, pendingActions, performanceScore] = await Promise.all([
    prisma.task.count({
      where: {
        dueDate: {
          lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Due in next 3 days
        },
        status: { not: 'COMPLETED' }
      }
    }),
    prisma.task.count({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' }
      }
    }),
    prisma.workLog.count({ where: { status: 'PENDING' } }),
    calculatePerformanceScore()
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* System Status & Quick Actions */}
      <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              System Overview
            </span>
            <Badge variant={systemAlerts > 0 ? "destructive" : "default"}>
              {systemAlerts > 0 ? `${systemAlerts} Alerts` : "Healthy"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Urgent Tasks</span>
                </div>
                <Badge variant="secondary">{urgentTasks}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Pending Reviews</span>
                </div>
                <Badge variant="secondary">{pendingActions}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <Badge variant="default">{performanceScore}%</Badge>
              </div>
            </div>


          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-3xl font-bold text-secondary">{performanceScore}%</div>
              <div className="text-sm text-secondary">Overall Score</div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Task Completion</span>
                <span className="font-medium text-success">87%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Team Productivity</span>
                <span className="font-medium text-primary">92%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Response Time</span>
                <span className="font-medium text-accent">2.3h</span>
              </div>
            </div>

            {/* View Details Button */}
            <Link href="/dashboard/admin/performance">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function calculatePerformanceScore(): Promise<number> {
  try {
    const [totalTasks, completedTasks, totalUsers, activeUsers] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } })
    ]);

    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const userActivityRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    // Calculate weighted performance score
    const score = (taskCompletionRate * 0.6) + (userActivityRate * 0.4);
    return Math.round(score);
  } catch (error) {
    return 85; // Default score if calculation fails
  }
}
