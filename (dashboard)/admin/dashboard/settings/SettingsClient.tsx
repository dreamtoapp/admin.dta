"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Settings,
  Shield,
  Database,
  Bell,
  Key,
  Globe,
  Building2,
  ClipboardList,
  FileText,
  History
} from "lucide-react";

interface SettingsClientProps {
  settings: {
    userCounts: Record<string, number>;
    departments: (string | null)[];
    systemStats: {
      total_users: number;
      total_tasks: number;
      total_worklogs: number;
      total_history: number;
    };
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export default function SettingsClient({ settings, user }: SettingsClientProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
              <p className="text-2xl font-bold">{settings.systemStats.total_users}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold">{settings.systemStats.total_tasks}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Work Logs</span>
              </div>
              <p className="text-2xl font-bold">{settings.systemStats.total_worklogs}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">History</span>
              </div>
              <p className="text-2xl font-bold">{settings.systemStats.total_history}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Distribution</span>
              <Button variant="outline" size="sm">Manage Users</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(settings.userCounts).map(([role, count]) => (
                <div key={role} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{role}</Badge>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available Departments</span>
              <Button variant="outline" size="sm">Add Department</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.departments.map((dept, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <span className="font-medium">{dept}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role Permissions</span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Keys</span>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Notifications</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Alerts</span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <Button variant="outline" size="sm">Backup</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Logs</span>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Maintenance</span>
              <Button variant="outline" size="sm">Schedule</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User ID</span>
              <span className="text-sm text-muted-foreground">{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Name</span>
              <span className="text-sm text-muted-foreground">{user.name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role</span>
              <Badge variant="default">{user.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

