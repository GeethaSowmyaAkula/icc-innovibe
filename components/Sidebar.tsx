'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRole } from './RoleContext';
import { RoleType } from '../lib/types';
import {
  Crown,
  TrendingUp,
  Activity,
  BarChart3,
  Bot,
  AlertTriangle,
  Zap,
  MessageSquare,
  FileText,
  ShieldCheck,
  Wrench,
  Users,
  Truck,
  Compass,
  Sparkles,
  ChevronRight,
  Lock,
  Layers,
  LayoutDashboard,
  Briefcase,
  UserCheck,
  ClipboardList,
  Clock,
  CalendarRange,
  IndianRupee,
  Award,
  GraduationCap,
  FolderOpen,
  Contact,
  Calendar,
  DoorOpen,
  Bell,
  Settings,
  CheckSquare,
  CheckCircle2,
  Database,
  Camera,
  Volume2,
  User,
  HelpCircle,
  ClipboardCheck,
  Inbox,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  color?: string;
  exactQuery?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const roleNavigationMap: Record<RoleType, { workspaceTitle: string; categories: NavCategory[] }> = {
  CEO: {
    workspaceTitle: 'CEO Executive Workspace',
    categories: [
      {
        title: 'Executive Suite',
        items: [
          { name: 'Executive Overview', path: '/dashboard/ceo', icon: Crown, color: 'text-amber-600' },
          { name: 'Business Performance', path: '/dashboard/ceo?module=business-performance', exactQuery: 'business-performance', icon: TrendingUp, color: 'text-emerald-600' },
          { name: 'Fleet Intelligence', path: '/dashboard/ceo?module=fleet-intelligence', exactQuery: 'fleet-intelligence', icon: Activity, color: 'text-sky-600' },
          { name: 'Department Performance', path: '/dashboard/ceo?module=department-performance', exactQuery: 'department-performance', icon: BarChart3, color: 'text-purple-600' },
        ],
      },
      {
        title: 'Operations & Intelligence',
        items: [
          { name: 'AI Command Center', path: '/dashboard/ai-command', icon: Bot, badge: 'n8n AI', color: 'text-sky-600' },
          { name: 'Alerts & Risk Center', path: '/dashboard/ceo?module=alerts-risk', exactQuery: 'alerts-risk', icon: AlertTriangle, badge: 'Live', color: 'text-red-500' },
          { name: 'Action Center', path: '/dashboard/ceo?module=action-center', exactQuery: 'action-center', icon: Zap, color: 'text-amber-500' },
          { name: 'Communication Hub', path: '/dashboard/ceo?module=communication-hub', exactQuery: 'communication-hub', icon: MessageSquare, color: 'text-indigo-600' },
        ],
      },
      {
        title: 'Governance & Controls',
        items: [
          { name: 'Reports & Analytics', path: '/dashboard/ceo?module=reports-analytics', exactQuery: 'reports-analytics', icon: FileText, color: 'text-blue-600' },
          { name: 'Role Access & Settings', path: '/dashboard/roles', icon: ShieldCheck, badge: 'RBAC', color: 'text-amber-600' },
        ],
      },
    ],
  },
  COO: {
    workspaceTitle: 'COO Operations Workspace',
    categories: [
      {
        title: 'Operations & Logistics',
        items: [
          { name: 'Operations Overview', path: '/dashboard/coo', icon: Activity, color: 'text-blue-600' },
          { name: 'Vendor Fleet Live Sync', path: '/dashboard/coo?module=fleet', exactQuery: 'fleet', icon: Truck, color: 'text-emerald-600' },
          { name: 'Dispatch Matrix', path: '/dashboard/coo?module=dispatch', exactQuery: 'dispatch', icon: Compass, color: 'text-purple-600' },
        ],
      },
      {
        title: 'Automation',
        items: [
          { name: 'AI Command Suite', path: '/dashboard/ai-command', icon: Bot, badge: 'n8n', color: 'text-sky-600' },
        ],
      },
    ],
  },
  CTO: {
    workspaceTitle: 'CTO Technology Workspace',
    categories: [
      {
        title: 'Telematics & Engineering',
        items: [
          { name: 'Telematics Overview', path: '/dashboard/cto', icon: Zap, color: 'text-purple-600' },
          { name: 'Sprint Management', path: '/dashboard/cto?module=sprint-management', exactQuery: 'sprint-management', icon: ClipboardList, color: 'text-emerald-600' },
          { name: 'Cybersecurity', path: '/dashboard/cto?module=cybersecurity', exactQuery: 'cybersecurity', icon: ShieldCheck, color: 'text-red-500' },
          { name: 'Integrations', path: '/dashboard/cto?module=integrations', exactQuery: 'integrations', icon: Layers, color: 'text-blue-600' },
        ],
      },
      {
        title: 'Governance & Analytics',
        items: [
          { name: 'Reports & Analytics', path: '/dashboard/cto?module=reports-analytics', exactQuery: 'reports-analytics', icon: FileText, color: 'text-purple-600' },
          { name: 'Notifications', path: '/dashboard/cto?module=notifications', exactQuery: 'notifications', icon: Bell, badge: '3', color: 'text-amber-500' },
          { name: 'AI Command Suite', path: '/dashboard/ai-command', icon: Bot, badge: 'n8n', color: 'text-sky-600' },
        ],
      },
    ],
  },
  SERVICE_MANAGER: {
    workspaceTitle: 'Service Hub Workspace',
    categories: [
      {
        title: 'Service Operations',
        items: [
          { name: 'Ticket Management Queue', path: '/dashboard/service-manager', icon: Wrench, color: 'text-emerald-600' },
          { name: 'AI Service Advisor', path: '/dashboard/service-manager?module=advisor', exactQuery: 'advisor', icon: Sparkles, color: 'text-sky-600' },
          { name: 'Technician Dispatcher', path: '/dashboard/service-manager?module=dispatcher', exactQuery: 'dispatcher', icon: Users, color: 'text-purple-600' },
        ],
      },
      {
        title: 'Automation',
        items: [
          { name: 'AI Command Suite', path: '/dashboard/ai-command', icon: Bot, badge: 'n8n', color: 'text-sky-600' },
        ],
      },
    ],
  },
  HR: {
    workspaceTitle: 'HR Staff Workspace',
    categories: [
      {
        title: 'Core HR',
        items: [
          { name: 'Dashboard', path: '/dashboard/hr?view=dashboard', exactQuery: 'dashboard', icon: LayoutDashboard, color: 'text-sky-600' },
          { name: 'Employee Management', path: '/dashboard/hr?view=employees', exactQuery: 'employees', icon: Users, color: 'text-blue-600' },
          { name: 'Attendance', path: '/dashboard/hr?view=attendance', exactQuery: 'attendance', icon: Clock, color: 'text-amber-600' },
          { name: 'Leave Management', path: '/dashboard/hr?view=leaves', exactQuery: 'leaves', icon: CalendarRange, color: 'text-rose-600' },
          { name: 'Payroll', path: '/dashboard/hr?view=payroll', exactQuery: 'payroll', icon: IndianRupee, color: 'text-emerald-600' },
          { name: 'Performance', path: '/dashboard/hr?view=performance', exactQuery: 'performance', icon: Award, color: 'text-amber-500' },
        ],
      },
      {
        title: 'Recruitment & Growth',
        items: [
          { name: 'Recruitment', path: '/dashboard/hr?view=recruitment', exactQuery: 'recruitment', icon: Briefcase, color: 'text-indigo-600' },
          { name: 'Candidate Management', path: '/dashboard/hr?view=candidates', exactQuery: 'candidates', icon: UserCheck, color: 'text-emerald-600' },
          { name: 'Onboarding', path: '/dashboard/hr?view=onboarding', exactQuery: 'onboarding', icon: ClipboardList, color: 'text-violet-600' },
          { name: 'Training & Learning', path: '/dashboard/hr?view=training', exactQuery: 'training', icon: GraduationCap, color: 'text-purple-600' },
          { name: 'Intern Management', path: '/dashboard/hr?view=interns', exactQuery: 'interns', icon: Sparkles, color: 'text-pink-500' },
        ],
      },
      {
        title: 'Administration',
        items: [
          { name: 'Employee Documents', path: '/dashboard/hr?view=documents', exactQuery: 'documents', icon: FolderOpen, color: 'text-teal-600' },
          { name: 'Employee ID Cards', path: '/dashboard/hr?view=id-cards', exactQuery: 'id-cards', icon: Contact, color: 'text-cyan-600' },
          { name: 'HR Policies', path: '/dashboard/hr?view=policies', exactQuery: 'policies', icon: FileText, color: 'text-slate-600' },
          { name: 'Holiday Calendar', path: '/dashboard/hr?view=holidays', exactQuery: 'holidays', icon: Calendar, color: 'text-orange-500' },
          { name: 'Exit Management', path: '/dashboard/hr?view=exit', exactQuery: 'exit', icon: DoorOpen, color: 'text-red-500' },
          { name: 'Reports', path: '/dashboard/hr?view=reports', exactQuery: 'reports', icon: BarChart3, color: 'text-indigo-600' },
          { name: 'Settings', path: '/dashboard/hr?view=settings', exactQuery: 'settings', icon: Settings, color: 'text-slate-600' },
        ],
      },
    ],
  },
  TECHNICIAN: {
    workspaceTitle: 'Technician Hub',
    categories: [
      {
        title: 'Field Operations',
        items: [
          { name: 'My Dashboard', path: '/dashboard/technician?view=dashboard', exactQuery: 'dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
          { name: 'Assigned Jobs', path: '/dashboard/technician?view=assigned-jobs', exactQuery: 'assigned-jobs', icon: Briefcase, color: 'text-indigo-600' },
          { name: 'Job Cards', path: '/dashboard/technician?view=job-cards', exactQuery: 'job-cards', icon: FileText, color: 'text-blue-500' },
          { name: 'Service Schedule', path: '/dashboard/technician?view=service-schedule', exactQuery: 'service-schedule', icon: Calendar, color: 'text-cyan-600' },
        ],
      },
      {
        title: 'Service & Diagnosis',
        items: [
          { name: 'Vehicle Inspection', path: '/dashboard/technician?view=inspection', exactQuery: 'inspection', icon: CheckSquare, color: 'text-amber-500' },
          { name: 'EV Diagnosis Reports', path: '/dashboard/technician?view=diagnosis', exactQuery: 'diagnosis', icon: TrendingUp, color: 'text-violet-600' },
          { name: 'Service Checklists', path: '/dashboard/technician?view=checklists', exactQuery: 'checklists', icon: ClipboardList, color: 'text-teal-600' },
          { name: 'Service Completion', path: '/dashboard/technician?view=completion', exactQuery: 'completion', icon: CheckCircle2, color: 'text-green-600' },
        ],
      },
      {
        title: 'Inventory & Approvals',
        items: [
          { name: 'Spare Parts Requests', path: '/dashboard/technician?view=spares', exactQuery: 'spares', icon: Database, color: 'text-purple-600' },
          { name: 'Inventory Requests', path: '/dashboard/technician?view=inventory', exactQuery: 'inventory', icon: Layers, color: 'text-pink-600' },
          { name: 'Customer Signature', path: '/dashboard/technician?view=signature', exactQuery: 'signature', icon: UserCheck, color: 'text-emerald-700' },
          { name: 'Photo Uploads', path: '/dashboard/technician?view=photos', exactQuery: 'photos', icon: Camera, color: 'text-indigo-500' },
        ],
      },
      {
        title: 'HR & Administration',
        items: [
          { name: 'Attendance', path: '/dashboard/technician?view=attendance', exactQuery: 'attendance', icon: Clock, color: 'text-emerald-600' },
          { name: 'Leave Requests', path: '/dashboard/technician?view=leaves', exactQuery: 'leaves', icon: CalendarRange, color: 'text-rose-600' },
          { name: 'Performance Dashboard', path: '/dashboard/technician?view=performance', exactQuery: 'performance', icon: Award, color: 'text-yellow-600' },
          { name: 'Payroll', path: '/dashboard/technician?view=payroll', exactQuery: 'payroll', icon: IndianRupee, color: 'text-teal-700' },
          { name: 'Incentives', path: '/dashboard/technician?view=incentives', exactQuery: 'incentives', icon: Zap, color: 'text-amber-600' },
          { name: 'Training', path: '/dashboard/technician?view=training', exactQuery: 'training', icon: GraduationCap, color: 'text-purple-700' },
        ],
      },
      {
        title: 'Communication',
        items: [
          { name: 'Announcements', path: '/dashboard/technician?view=announcements', exactQuery: 'announcements', icon: Volume2, color: 'text-slate-500' },
          { name: 'Notifications', path: '/dashboard/technician?view=notifications', exactQuery: 'notifications', icon: Bell, color: 'text-orange-500' },
          { name: 'My Profile', path: '/dashboard/technician?view=profile', exactQuery: 'profile', icon: User, color: 'text-slate-600' },
        ],
      },
    ],
  },
  EMPLOYEE: {
    workspaceTitle: 'Employee Workspace',
    categories: [
      {
        title: 'Daily Operations',
        items: [
          { name: 'My Dashboard', path: '/dashboard/employee?view=dashboard', exactQuery: 'dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
          { name: 'My Daily Tasks', path: '/dashboard/employee?view=tasks', exactQuery: 'tasks', icon: CheckSquare, color: 'text-indigo-600' },
          { name: 'Attendance & Roster', path: '/dashboard/employee?view=attendance', exactQuery: 'attendance', icon: Clock, color: 'text-emerald-600' },
        ],
      },
      {
        title: 'Time & Reports',
        items: [
          { name: 'Leave & Time Off', path: '/dashboard/employee?view=leave', exactQuery: 'leave', icon: CalendarRange, color: 'text-amber-500' },
          { name: 'Logout Reports', path: '/dashboard/employee?view=logout-reports', exactQuery: 'logout-reports', icon: ClipboardCheck, color: 'text-violet-600' },
          { name: 'Employee Reports', path: '/dashboard/employee?view=reports', exactQuery: 'reports', icon: BarChart3, color: 'text-blue-600' },
        ],
      },
      {
        title: 'Workspace & Communication',
        items: [
          { name: 'Notice Board', path: '/dashboard/employee?view=announcements', exactQuery: 'announcements', icon: Bell, color: 'text-orange-500' },
          { name: 'Internal Helpdesk', path: '/dashboard/employee?view=helpdesk', exactQuery: 'helpdesk', icon: HelpCircle, color: 'text-purple-600' },
          { name: 'Notifications', path: '/dashboard/employee?view=notifications', exactQuery: 'notifications', icon: Inbox, color: 'text-rose-500' },
          { name: 'My Profile', path: '/dashboard/employee?view=profile', exactQuery: 'profile', icon: User, color: 'text-slate-600' },
        ],
      },
    ],
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeRole, isSuperAdmin } = useRole();

  const currentModuleParam = searchParams ? (searchParams.get('module') || searchParams.get('view') || searchParams.get('tab')) : null;

  const currentWorkspace = roleNavigationMap[activeRole] || roleNavigationMap.CEO;

  const isItemActive = (itemPath: string, exactQuery?: string) => {
    const [basePath] = itemPath.split('?');
    if (pathname !== basePath) return false;
    if (exactQuery) {
      if ((exactQuery === 'dashboard' || exactQuery === 'overview') && (!currentModuleParam || currentModuleParam === exactQuery)) {
        return true;
      }
      return currentModuleParam === exactQuery;
    }
    return !currentModuleParam;
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 min-h-[calc(100vh-61px)] py-4 px-3 flex flex-col justify-between hidden md:flex text-left shrink-0 select-none">
      <div className="space-y-5">
        {/* Workspace Header */}
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 truncate">
              <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{currentWorkspace.workspaceTitle}</span>
            </p>
            {isSuperAdmin ? (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                SUPER ADMIN
              </span>
            ) : (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shrink-0">
                {activeRole}
              </span>
            )}
          </div>

          {/* Navigation Categories */}
          <div className="space-y-4">
            {currentWorkspace.categories.map((category) => (
              <div key={category.title} className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1.5">
                  {category.title}
                </p>
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path, item.exactQuery);

                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-white' : item.color || 'text-slate-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        !active && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Designation Privilege Status Card */}
      {isSuperAdmin ? (
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-left mt-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-3.5 w-3.5 text-amber-600 fill-amber-600 shrink-0" />
            <span className="text-[11px] font-bold text-amber-900 truncate">Super Admin Controls</span>
          </div>
          <p className="text-[10px] text-amber-800/80 leading-normal font-medium">
            Full system permissions active across all roles and workspaces.
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left mt-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-900 truncate">{activeRole} Workspace</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal font-medium">
            Dedicated scope navigation active for your session.
          </p>
        </div>
      )}
    </aside>
  );
}

