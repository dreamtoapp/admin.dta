"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Target,
  Award,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Zap
} from "lucide-react";

interface TaskStat {
  status: string;
  _count: { id: number };
}

interface UserPerformance {
  id: string;
  name: string | null;
  fullName: string | null;
  email: string;
  department: string | null;
  _count: {
    assignedTasks: number;
    workLogs: number;
  };
  assignedTasks: Array<{
    id: string;
    completedAt: Date | null;
    createdAt: Date;
  }>;
}

interface DepartmentStat {
  department: string;
  _count: { id: number };
}

interface WorkLogStat {
  status: string;
  _count: { id: number };
  _sum: { timeSpentMin: number | null };
}

interface PerformanceMetrics {
  taskCompletionRate: number;
  totalTasks: number;
  averageTasksPerUser: number;
  totalWorkHours: number;
  productivityScore: number;
}

interface PerformanceAnalyticsClientProps {
  taskStats: TaskStat[];
  userPerformance: UserPerformance[];
  departmentStats: DepartmentStat[];
  workLogStats: WorkLogStat[];
  performanceMetrics: PerformanceMetrics;
  monthlyTrends: TaskStat[];
  user: any;
}

export default function PerformanceAnalyticsClient({
  taskStats,
  userPerformance,
  departmentStats,
  workLogStats,
  performanceMetrics,
  monthlyTrends,
  user
}: PerformanceAnalyticsClientProps) {
  const [timeFilter, setTimeFilter] = useState("30");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Calculate completion rate
  const completionRate = performanceMetrics.totalTasks > 0
    ? (performanceMetrics.taskCompletionRate / performanceMetrics.totalTasks * 100).toFixed(1)
    : "0";

  // Calculate top performers
  const topPerformers = userPerformance
    .map(user => ({
      ...user,
      completedTasks: user.assignedTasks.length,
      completionRate: user._count.assignedTasks > 0
        ? (user.assignedTasks.length / user._count.assignedTasks * 100).toFixed(1)
        : "0"
    }))
    .sort((a, b) => b.completedTasks - a.completedTasks)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground mt-2">Track team productivity and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Time Period:</span>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm font-medium ml-4">Department:</span>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentStats
                  .filter((dept) => dept.department && dept.department.trim() !== '')
                  .map((dept) => (
                    <SelectItem key={dept.department} value={dept.department}>
                      {dept.department}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task Completion Rate</p>
                <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">+5.2% from last month</span>
                </div>
              </div>
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
                <p className="text-3xl font-bold text-foreground">{performanceMetrics.productivityScore}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-primary mr-1" />
                  <span className="text-sm text-primary">Excellent</span>
                </div>
              </div>
              <Zap className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Work Hours</p>
                <p className="text-3xl font-bold text-foreground">{performanceMetrics.totalWorkHours.toFixed(0)}h</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-accent mr-1" />
                  <span className="text-sm text-accent">This month</span>
                </div>
              </div>
              <Clock className="h-12 w-12 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Tasks/User</p>
                <p className="text-3xl font-bold text-foreground">{performanceMetrics.averageTasksPerUser.toFixed(1)}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-secondary mr-1" />
                  <span className="text-sm text-secondary">Per team member</span>
                </div>
              </div>
              <Target className="h-12 w-12 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskStats.map((stat) => {
                const percentage = performanceMetrics.totalTasks > 0
                  ? (stat._count.id / performanceMetrics.totalTasks * 100).toFixed(1)
                  : "0";

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'COMPLETED': return 'bg-success';
                    case 'IN_PROGRESS': return 'bg-primary';
                    case 'PENDING': return 'bg-accent';
                    case 'REVIEW': return 'bg-secondary';
                    default: return 'bg-muted';
                  }
                };

                return (
                  <div key={stat.status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{stat.status}</span>
                      <span className="text-sm text-muted-foreground">{stat._count.id} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(stat.status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-accent' : index === 1 ? 'bg-muted' : index === 2 ? 'bg-secondary' : 'bg-primary'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {performer.fullName || performer.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">{performer.department || 'No Department'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{performer.completedTasks} tasks</p>
                    <p className="text-sm text-muted-foreground">{performer.completionRate}% completion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => {
              const deptUsers = userPerformance.filter(u => u.department === dept.department);
              const totalTasks = deptUsers.reduce((sum, u) => sum + u._count.assignedTasks, 0);
              const completedTasks = deptUsers.reduce((sum, u) => sum + u.assignedTasks.length, 0);
              const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : "0";

              return (
                <div key={dept.department} className="p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">{dept.department}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Members:</span>
                      <span className="font-medium">{dept._count.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Tasks:</span>
                      <span className="font-medium">{totalTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate:</span>
                      <Badge variant={parseFloat(completionRate) > 75 ? "default" : "secondary"}>
                        {completionRate}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Work Log Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Work Log Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workLogStats.map((stat) => {
              const hours = stat._sum.timeSpentMin ? (stat._sum.timeSpentMin / 60).toFixed(1) : "0";
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'APPROVED': return 'text-success bg-success/10';
                  case 'PENDING': return 'text-accent bg-accent/10';
                  case 'REJECTED': return 'text-destructive bg-destructive/10';
                  default: return 'text-muted-foreground bg-muted/10';
                }
              };

              return (
                <div key={stat.status} className="text-center p-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stat.status)}`}>
                    {stat.status}
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat._count.id}</p>
                  <p className="text-sm text-muted-foreground">logs ({hours}h)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
