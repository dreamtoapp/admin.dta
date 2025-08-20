"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, UserPlus, User, Plus, Eye, Home, FileText as FileTextIcon, UserCheck, BarChart, Cog } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarItems = [
  {
    title: "Overview",
    value: "overview",
    icon: Home,
  },
  {
    title: "Work Logs",
    value: "worklogs",
    icon: FileTextIcon,
  },
  {
    title: "Staff Management",
    value: "staff",
    icon: UserCheck,
  },
  {
    title: "Performance",
    value: "performance",
    icon: BarChart,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Cog,
  }
];

const quickActions = [
  {
    title: "New Staff",
    icon: UserPlus,
    action: "newStaff",
  },
  {
    title: "New Client",
    icon: User,
    action: "newClient",
  },
  {
    title: "Create Task",
    icon: Plus,
    action: "createTask",
  },
  {
    title: "View Tasks",
    icon: Eye,
    action: "viewTasks",
    description: "View all tasks"
  }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-detect active tab from current pathname
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const currentTab = pathSegments[pathSegments.length - 1];

    if (currentTab === 'dashboard') {
      setActiveTab('overview');
    } else if (['worklogs', 'staff', 'performance', 'settings'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [pathname]);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    // Get current locale from pathname
    const pathSegments = pathname.split('/');
    const locale = pathSegments[1];

    if (tab === 'overview') {
      router.push(`/${locale}/admin/dashboard`);
    } else {
      router.push(`/${locale}/admin/dashboard/${tab}`);
    }
  };

  const handleQuickAction = (action: string) => {
    // Get current locale from pathname
    const pathSegments = pathname.split('/');
    const locale = pathSegments[1];

    switch (action) {
      case 'newStaff':
        router.push(`/${locale}/admin/dashboard/new-staff`);
        break;
      case 'newClient':
        router.push(`/${locale}/admin/dashboard/new-client`);
        break;
      case 'createTask':
        router.push(`/${locale}/admin/dashboard/create-task`);
        break;
      case 'viewTasks':
        router.push(`/${locale}/admin/dashboard/view-tasks`);
        break;
      default:
        console.log('Quick action:', action);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
         fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
       `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="px-2 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.value)}
                  className="flex w-full justify-between items-center h-auto p-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </Button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="border-t px-2 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Quick Actions
            </h3>
            <div>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.action}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="flex w-full justify-start items-center gap-2 h-auto p-2 text-sm hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="bg-background shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
