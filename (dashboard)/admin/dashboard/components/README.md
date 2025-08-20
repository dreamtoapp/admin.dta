# Admin Dashboard Components

This directory contains the modular components that make up the admin dashboard.

## Components

### 1. Sidebar (`Sidebar.tsx`)
The main sidebar navigation component that includes:
- **Header**: Admin Panel title with toggle button
- **Quick Actions**: New Staff, New Client, Create Task, View Tasks
- **Navigation Menu**: Overview, Work Logs, Staff Management, Performance, Settings
- **User Info**: User avatar, name, and role

**Props:**
```tsx
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string | null; role: string; };
  onNewStaff: () => void;
  onNewClient: () => void;
  onCreateTask: () => void;
  onViewTasks: () => void;
}
```

### 2. StatsCards (`StatsCards.tsx`)
Displays the top 4 statistics cards:
- Total Users
- Total Tasks
- Completion Rate
- Overdue Tasks

**Props:**
```tsx
interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalTasks: number;
    completionRate: number;
    overdueTasks: number;
  };
}
```

### 3. DashboardTabs (`DashboardTabs.tsx`)
Handles all the tab content sections:
- **Overview**: Task status overview, department overview, recent activity
- **Work Logs**: Work log review statistics and interface
- **Staff Management**: Staff statistics and directory
- **Performance**: Performance metrics and reports
- **Settings**: Security and system configuration

**Props:**
```tsx
interface DashboardTabsProps {
  activeTab: string;
  stats: Stats;
  departmentStats: DepartmentStat[];
  recentActivity: RecentActivity[];
  workLogStats: WorkLogStats;
  formatDate: (date: Date) => string;
}
```

## Usage

```tsx
import { Sidebar, StatsCards, DashboardTabs } from "./components";

// In your main component
<Sidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  user={user}
  onNewStaff={handleNewStaff}
  onNewClient={handleNewClient}
  onCreateTask={handleCreateTask}
  onViewTasks={handleViewTasks}
/>

<StatsCards stats={stats} />

<DashboardTabs
  activeTab={activeTab}
  stats={stats}
  departmentStats={departmentStats}
  recentActivity={recentActivity}
  workLogStats={workLogStats}
  formatDate={formatDate}
/>
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Maintainability**: Easier to debug and update individual components
4. **Testing**: Each component can be tested independently
5. **Performance**: Better code splitting and lazy loading opportunities
6. **Team Development**: Multiple developers can work on different components simultaneously

## File Structure

```
components/
├── index.ts          # Exports all components
├── Sidebar.tsx       # Sidebar navigation component
├── StatsCards.tsx    # Statistics cards component
├── DashboardTabs.tsx # Tab content component
└── README.md         # This documentation
```
