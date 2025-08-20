"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Clock,
  Activity,
  Eye,
  CheckCircle,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  Settings,
  AlertTriangle,
  Download,
  RefreshCw
} from "lucide-react";

interface DepartmentStat {
  department: string;
  userCount: number;
}

interface RecentActivity {
  id: string;
  action: string;
  details?: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  task: {
    title: string;
  };
}

interface WorkLogStats {
  pendingReviews: number;
  approvedToday: number;
  rejectedToday: number;
}

interface Stats {
  totalUsers: number;
  pendingTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
}

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: Stats;
  departmentStats: DepartmentStat[];
  recentActivity: RecentActivity[];
  workLogStats: WorkLogStats;
  formatDate: (date: Date) => string;
}

export default function DashboardTabs({
  activeTab,
  setActiveTab,
  stats,
  departmentStats,
  recentActivity,
  workLogStats,
  formatDate
}: DashboardTabsProps) {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "overview"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("worklogs")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "worklogs"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Work Logs
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "staff"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Staff
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "performance"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "settings"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Settings
        </button>
      </div>
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <BarChart3 className="h-5 w-5" />
                  Task Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-left">Pending</span>
                  </div>
                  <Badge variant="secondary">{stats.pendingTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-left">In Progress</span>
                  </div>
                  <Badge variant="secondary">{stats.inProgressTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-left">Review</span>
                  </div>
                  <Badge variant="secondary">{stats.reviewTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-left">Completed</span>
                  </div>
                  <Badge variant="secondary">{stats.completedTasks}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Users className="h-5 w-5" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between">
                    <span className="text-left">{dept.department}</span>
                    <Badge variant="outline">{dept.userCount} users</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-left">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {activity.user.name?.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground text-left">
                        {activity.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground text-left">
                        {activity.action} - {activity.task.title}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground text-left">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Work Logs Tab */}
      {activeTab === "worklogs" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-left">Staff Work Logs Review</h2>
            <Button className="bg-primary hover:bg-primary/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <FileText className="h-5 w-5" />
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {workLogStats.pendingReviews}
                </div>
                <p className="text-sm text-muted-foreground text-left">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <CheckCircle2 className="h-5 w-5" />
                  Approved Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {workLogStats.approvedToday}
                </div>
                <p className="text-sm text-muted-foreground text-left">Work logs approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <XCircle className="h-5 w-5" />
                  Rejected Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {workLogStats.rejectedToday}
                </div>
                <p className="text-sm text-muted-foreground text-left">Work logs rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Work Log Review Interface Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Work Log Review Queue</CardTitle>
              <CardDescription className="text-left">
                Review and approve/reject staff work submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-left">Work log review interface will be implemented here</p>
                <p className="text-sm text-left">Features: Review submissions, approve/reject with notes, productivity tracking</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Staff Management Tab */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-left">Staff Management</h2>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Users className="h-5 w-5" />
                  Total Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.totalUsers - 1}
                </div>
                <p className="text-sm text-muted-foreground text-left">Excluding admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Shield className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.totalUsers}
                </div>
                <p className="text-sm text-muted-foreground text-left">All accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Settings className="h-5 w-5" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {departmentStats.length}
                </div>
                <p className="text-sm text-muted-foreground text-left">Active departments</p>
              </CardContent>
            </Card>
          </div>

          {/* Staff Directory Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Staff Directory</CardTitle>
              <CardDescription className="text-left">
                Manage staff accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-left">Staff directory and management interface will be implemented here</p>
                <p className="text-sm text-left">Features: Add/Edit staff, role management, permissions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <TrendingUp className="h-5 w-5" />
                  Task Completion Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-left">Performance charts and analytics will be displayed here</p>
                  <p className="text-sm text-left">Monthly trends, team comparisons, productivity metrics</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Activity className="h-5 w-5" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-left">Team performance metrics and comparisons</p>
                  <p className="text-sm text-left">Individual stats, department rankings, workload distribution</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export and Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-left">Reports & Analytics</CardTitle>
              <CardDescription className="text-left">
                Generate and export performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Performance Report
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Analytics
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-left">Password Policy</span>
                  <Badge variant="outline">Configure</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-left">Session Timeout</span>
                  <Badge variant="outline">8 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-left">Two-Factor Auth</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-left">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-left">Email Notifications</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-left">Auto Backup</span>
                  <Badge variant="outline">Daily</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-left">Maintenance Mode</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive text-left">
                <AlertTriangle className="h-5 w-5" />
                Emergency Controls
              </CardTitle>
              <CardDescription className="text-left">
                Critical system controls for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="destructive">
                  <Shield className="h-4 w-4 mr-2" />
                  System Lockdown
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Emergency Backup
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk User Operations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
