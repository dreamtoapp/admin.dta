"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Users, Clock, CheckCircle, ClipboardList, FileTextIcon } from "lucide-react";

interface TaskPerformance {
  status: string;
  _count: { id: number };
}

interface UserPerformance {
  id: string;
  name: string | null;
  department: string | null;
  _count: {
    tasks: number;
    workLogs: number;
  };
  tasks: Array<{
    status: string;
    createdAt: Date;
  }>;
}

interface DepartmentPerformance {
  department: string;
  _count: { id: number };
}

interface PerformanceClientProps {
  performanceStats: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalUsers: number;
    totalWorkLogs: number;
    approvedWorkLogs: number;
  };
  userPerformance: UserPerformance[];
  departmentPerformance: DepartmentPerformance[];
  taskPerformance: TaskPerformance[];
}

export default function PerformanceClient({
  performanceStats,
  userPerformance,
  departmentPerformance,
  taskPerformance
}: PerformanceClientProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'IN_PROGRESS':
        return 'text-blue-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'REVIEW':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'REVIEW':
        return <Target className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.completionRate}%</div>
            <Progress value={performanceStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {performanceStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Logs</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalWorkLogs}</div>
            <p className="text-xs text-muted-foreground">
              {performanceStats.approvedWorkLogs} approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taskPerformance.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="font-medium capitalize">{status.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{status._count.id}</span>
                  <span className="text-sm text-muted-foreground">
                    ({Math.round((status._count.id / performanceStats.totalTasks) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPerformance
              .filter(user => user._count.tasks > 0)
              .sort((a, b) => b._count.tasks - a._count.tasks)
              .slice(0, 5)
              .map((user, index) => {
                const completedTasks = user.tasks.filter(t => t.status === 'COMPLETED').length;
                const completionRate = user._count.tasks > 0
                  ? Math.round((completedTasks / user._count.tasks) * 100)
                  : 0;

                return (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.department || 'No Department'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{user._count.tasks} tasks</p>
                      <p className="text-sm text-muted-foreground">
                        {completionRate}% completion
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentPerformance.map((dept) => (
              <div key={dept.department} className="p-4 border rounded-lg">
                <h3 className="font-medium">{dept.department}</h3>
                <p className="text-2xl font-bold">{dept._count.id}</p>
                <p className="text-sm text-muted-foreground">staff members</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
