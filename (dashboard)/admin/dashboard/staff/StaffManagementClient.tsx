"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Building2, ClipboardList } from "lucide-react";

interface StaffMember {
  id: string;
  name: string | null;
  email: string;
  department: string | null;
  role: string;
  createdAt: Date;
  _count: {
    tasks: number;
    workLogs: number;
  };
}

interface StaffManagementClientProps {
  staff: StaffMember[];
  stats: {
    totalStaff: number;
    activeStaff: number;
    departments: number;
    totalTasks: number;
  };
  departmentStats: Array<{
    department: string;
    _count: { id: number };
  }>;
}

export default function StaffManagementClient({ staff, stats, departmentStats }: StaffManagementClientProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'STAFF':
        return <Badge variant="secondary">Staff</Badge>;
      case 'ADMIN':
        return <Badge variant="default">Admin</Badge>;
      case 'CLIENT':
        return <Badge variant="outline">Client</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string | null) => {
    if (!department) return <Badge variant="outline">No Department</Badge>;
    return <Badge variant="outline">{department}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStaff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="p-4 border rounded-lg">
                <h3 className="font-medium">{dept.department}</h3>
                <p className="text-2xl font-bold">{dept._count.id}</p>
                <p className="text-sm text-muted-foreground">staff members</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {member.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex gap-2 mt-1">
                      {getRoleBadge(member.role)}
                      {getDepartmentBadge(member.department)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tasks: {member._count.tasks}</p>
                  <p className="text-sm text-muted-foreground">Work Logs: {member._count.workLogs}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
