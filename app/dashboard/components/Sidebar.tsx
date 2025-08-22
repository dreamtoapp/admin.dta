"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Users,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  UserPlus,
  Plus,
  Eye,
  LogOut,
  Menu,
  X,
  User,
  Building2,
  Calendar,
  MessageSquare,
  Briefcase,
  Play
} from "lucide-react";

interface SidebarProps {
  user: {
    name: string | null;
    email: string;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = {
    admin: [
      { name: "نظرة عامة", href: "/dashboard/admin", icon: Home },
      { name: "إدارة المهام", href: "/dashboard/admin/tasks", icon: ClipboardList },
      { name: "إدارة الموظفين", href: "/dashboard/admin/staff", icon: Users },
      { name: "سجلات العمل", href: "/dashboard/admin/worklogs", icon: FileText },
      { name: "الأداء", href: "/dashboard/admin/performance", icon: BarChart3 },
      { name: "الإعدادات", href: "/dashboard/admin/settings", icon: Settings },
    ],
    staff: [
      { name: "لوحة التحكم", href: "/dashboard/staff", icon: Home },
      { name: "مهامي", href: "/dashboard/staff/tasks", icon: ClipboardList },
      { name: "سجلات العمل", href: "/dashboard/staff/worklogs", icon: FileText },
      { name: "الملف الشخصي", href: "/dashboard/staff/profile", icon: User },
    ],
    client: [
      { name: "لوحة التحكم", href: "/dashboard/client", icon: Home },
      { name: "مشاريعي", href: "/dashboard/client/projects", icon: Briefcase },
      { name: "الاستشارات", href: "/dashboard/client/consultations", icon: MessageSquare },
      { name: "الملف الشخصي", href: "/dashboard/client/profile", icon: User },
    ],
  };

  const quickActions = {
    admin: [
      { name: "عميل جديد", href: "/dashboard/admin/new-client", icon: Users, color: "bg-secondary" },
      { name: "إضافة موظف", href: "/dashboard/admin/staff/new", icon: UserPlus, color: "bg-success" },
      { name: "إنشاء مهمة جديدة", href: "/dashboard/admin/tasks/create", icon: Plus, color: "bg-primary" },
    ],
    staff: [
      { name: "بدء مهمة", href: "/dashboard/staff/tasks/start", icon: Play, color: "bg-success" },
      { name: "تسجيل عمل", href: "/dashboard/staff/worklogs/new", icon: FileText, color: "bg-primary" },
    ],
    client: [
      { name: "مشروع جديد", href: "/dashboard/client/projects/new", icon: Plus, color: "bg-success" },
      { name: "حجز استشارة", href: "/dashboard/client/consultations/new", icon: Calendar, color: "bg-primary" },
    ],
  };

  const currentRole = user.role.toLowerCase() as keyof typeof navigationItems;
  const currentNavItems = navigationItems[currentRole] || navigationItems.client;
  const currentQuickActions = quickActions[currentRole] || [];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-foreground">DreamToApp</h2>
                <p className="text-xs text-muted-foreground capitalize">لوحة تحكم {user.role === 'STAFF' ? 'الموظفين' : user.role === 'ADMIN' ? 'المدير' : 'العميل'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || 'مستخدم'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {user.role === 'STAFF' ? 'موظف' : user.role === 'ADMIN' ? 'مدير' : 'عميل'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-2 py-4 space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          {currentQuickActions.length > 0 && (
            <div className="border-t border-border px-2 py-4">
              <div className="space-y-1">
                {currentQuickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                      <div className={`p-1 rounded ${action.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      {action.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="bg-card shadow-lg border border-border"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
