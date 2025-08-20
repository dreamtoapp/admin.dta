"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { AdminManagedInfo } from "./mockupData";

interface AdminManagedCardProps {
  data: AdminManagedInfo;
  readOnly?: boolean;
}

export default function AdminManagedCard({ data, readOnly = true }: AdminManagedCardProps) {
  const {
    employeeId,
    department,
    jobTitle,
    hireDate,
    contractType,
    employmentStatus,
    directManager,
    basicSalary,
    bonus,
    workSchedule,
    workLocation
  } = data;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContractColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'FULL_TIME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PART_TIME':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CONTRACT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Employment Information
          {readOnly && (
            <Badge variant="secondary" className="text-xs">
              Admin Managed (Read-Only)
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee ID & Department */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
              <div className="text-sm font-mono bg-muted px-3 py-2 rounded-md">
                {employeeId || "Not assigned"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <div className="text-sm font-medium">
                {department || "Not assigned"}
              </div>
            </div>
          </div>

          {/* Job Title & Hire Date */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Job Title</label>
              <div className="text-sm font-medium">
                {jobTitle || "Not assigned"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
              <div className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {hireDate ? new Date(hireDate).toLocaleDateString() : "Not set"}
              </div>
            </div>
          </div>

          {/* Contract & Status */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Contract Type</label>
              <div className="text-sm">
                {contractType ? (
                  <Badge variant="outline" className={`text-xs ${getContractColor(contractType)}`}>
                    {contractType.replace('_', ' ')}
                  </Badge>
                ) : (
                  "Not specified"
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
              <div className="text-sm">
                {employmentStatus ? (
                  <Badge variant="outline" className={`text-xs ${getStatusColor(employmentStatus)}`}>
                    {employmentStatus}
                  </Badge>
                ) : (
                  "Not specified"
                )}
              </div>
            </div>
          </div>

          {/* Manager & Schedule */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Direct Manager</label>
              <div className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {directManager || "Not assigned"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Work Schedule</label>
              <div className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {workSchedule ? workSchedule.replace('_', ' ') : "Not specified"}
              </div>
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Work Location</label>
              <div className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {workLocation ? workLocation.replace('_', ' ') : "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Basic Salary</label>
              <div className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {basicSalary || "Not disclosed"}
              </div>
            </div>
          </div>

          {/* Bonus */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Bonus</label>
              <div className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {bonus || "Not applicable"}
              </div>
            </div>
          </div>
        </div>

        {/* Note about admin management */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">ℹ️ Information Notice</p>
            <p>This employment information is managed by your HR administrator. Please contact your manager or HR department if you need to update any of these details.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
