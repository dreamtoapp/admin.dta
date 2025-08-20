"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity
} from "lucide-react";

interface PerformanceChartsProps {
  userRole: string;
}

export default function PerformanceCharts({ userRole }: PerformanceChartsProps) {
  if (userRole !== 'ADMIN') {
    return null; // Only show for admin users
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Performance Overview */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Task Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">87%</div>
                <div className="text-sm text-primary">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">12.5</div>
                <div className="text-sm text-success">Avg. Days</div>
              </div>
            </div>

            {/* Task Status Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Task Status Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                  <Badge variant="secondary">45%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <Badge variant="secondary">32%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="secondary">18%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm">Overdue</span>
                  </div>
                  <Badge variant="destructive">5%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Activity & Productivity */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            Team Activity & Productivity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Productivity Score */}
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">92%</div>
              <div className="text-sm text-secondary">Overall Productivity</div>
            </div>

            {/* Team Performance */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Top Performers</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-success/10 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Ahmed Hassan</span>
                  </div>
                  <Badge variant="default">98%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Sarah Johnson</span>
                  </div>
                  <Badge variant="secondary">95%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-accent/10 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Mike Chen</span>
                  </div>
                  <Badge variant="outline">89%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Recent Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Weekly Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Weekly Progress</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasks Completed</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+15%</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Users</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+8%</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Time</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">-12%</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health & Alerts */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            System Health & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* System Status */}
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">Healthy</div>
              <div className="text-sm text-success">All systems operational</div>
            </div>

            {/* Active Alerts */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Active Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-accent/10 rounded">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <span className="text-sm">3 tasks approaching deadline</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">5 work logs pending review</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-success/10 rounded">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Database backup completed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
