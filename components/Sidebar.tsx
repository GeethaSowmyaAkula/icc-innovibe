'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useRole } from './RoleContext';
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Activity,
  BarChart3,
  Bot,
  AlertTriangle,
  Zap,
  MessageSquare,
  FileText,
  ShieldCheck,
  Shield,
  ChevronDown,
} from 'lucide-react';

interface SubmenuItem {
  name: string;
  path: string;
  exactQuery: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  badgeType?: 'default' | 'live' | 'rbac' | 'beta';
  exactQuery?: string;
  isExpandable?: boolean;
  children?: SubmenuItem[];
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const tmsSubmenuItems: SubmenuItem[] = [
  { name: 'Dashboard', path: '/dashboard/ceo?module=tms-dashboard', exactQuery: 'tms-dashboard' },
  { name: 'Tasks', path: '/dashboard/ceo?module=tms-tasks', exactQuery: 'tms-tasks' },
  { name: 'Attendance', path: '/dashboard/ceo?module=tms-attendance', exactQuery: 'tms-attendance' },
  { name: 'Departments', path: '/dashboard/ceo?module=tms-departments', exactQuery: 'tms-departments' },
  { name: 'Employees', path: '/dashboard/ceo?module=tms-employees', exactQuery: 'tms-employees' },
  { name: 'Leave Approvals', path: '/dashboard/ceo?module=tms-leave-approvals', exactQuery: 'tms-leave-approvals' },
  { name: 'Reports', path: '/dashboard/ceo?module=tms-reports', exactQuery: 'tms-reports' },
  { name: 'Logout Reports', path: '/dashboard/ceo?module=tms-logout-reports', exactQuery: 'tms-logout-reports' },
  { name: 'Announcements', path: '/dashboard/ceo?module=tms-announcements', exactQuery: 'tms-announcements' },
  { name: 'Notifications', path: '/dashboard/ceo?module=tms-notifications', exactQuery: 'tms-notifications' },
  { name: 'Settings', path: '/dashboard/ceo?module=tms-settings', exactQuery: 'tms-settings' },
];

const ceoNavigationCategories: NavCategory[] = [
  {
    title: 'EXECUTIVE SUITE',
    items: [
      { name: 'Executive Overview', path: '/dashboard/ceo', icon: LayoutDashboard },
      {
        name: 'TMS',
        path: '/dashboard/ceo?module=tms-dashboard',
        icon: CheckSquare,
        badge: 'HR',
        badgeType: 'live',
        isExpandable: true,
        children: tmsSubmenuItems,
      },
      { name: 'Business Performance', path: '/dashboard/ceo?module=business-performance', exactQuery: 'business-performance', icon: TrendingUp },
      { name: 'Fleet Intelligence', path: '/dashboard/ceo?module=fleet-intelligence', exactQuery: 'fleet-intelligence', icon: Activity },
      { name: 'Department Performance', path: '/dashboard/ceo?module=department-performance', exactQuery: 'department-performance', icon: BarChart3 },
    ],
  },
  {
    title: 'OPERATIONS & INTELLIGENCE',
    items: [
      { name: 'AI Command Center', path: '/dashboard/ai-command', icon: Bot, badge: 'Beta', badgeType: 'beta' },
      { name: 'Alerts & Risk Center', path: '/dashboard/ceo?module=alerts-risk', exactQuery: 'alerts-risk', icon: AlertTriangle, badge: 'Live', badgeType: 'live' },
      { name: 'Action Center', path: '/dashboard/ceo?module=action-center', exactQuery: 'action-center', icon: Zap },
      { name: 'Communication Hub', path: '/dashboard/ceo?module=communication-hub', exactQuery: 'communication-hub', icon: MessageSquare },
    ],
  },
  {
    title: 'GOVERNANCE & CONTROL',
    items: [
      { name: 'Reports & Analytics', path: '/dashboard/ceo?module=reports-analytics', exactQuery: 'reports-analytics', icon: FileText },
      { name: 'Role Access & Settings', path: '/dashboard/roles', icon: ShieldCheck, badge: 'RBAC', badgeType: 'rbac' },
    ],
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentModuleParam = searchParams ? (searchParams.get('module') || searchParams.get('view')) : null;

  // Check if current active route belongs to TMS
  const isTmsActive =
    currentModuleParam === 'tms' || (currentModuleParam ? currentModuleParam.startsWith('tms-') : false);

  const [isTmsExpanded, setIsTmsExpanded] = useState<boolean>(isTmsActive);

  // Re-evaluate expanded state on searchParams change or page refresh
  useEffect(() => {
    if (isTmsActive) {
      setIsTmsExpanded(true);
    }
  }, [isTmsActive, currentModuleParam]);

  const isItemActive = (itemPath: string, exactQuery?: string) => {
    const [basePath] = itemPath.split('?');
    if (pathname !== basePath) return false;
    if (exactQuery) {
      return currentModuleParam === exactQuery;
    }
    return !currentModuleParam;
  };

  const handleTmsParentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTmsExpanded) {
      setIsTmsExpanded(true);
      router.push('/dashboard/ceo?module=tms-dashboard');
    } else {
      // Toggle collapse if already expanded
      setIsTmsExpanded(!isTmsExpanded);
    }
  };

  return (
    <aside className="w-64 bg-white/90 border-r border-slate-100 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between hidden md:flex shrink-0 text-left font-sans">
      <div className="space-y-6">
        {/* Navigation Categories */}
        {ceoNavigationCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <p className="font-montserrat text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3.5 mb-2">
              {category.title}
            </p>

            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;

                if (item.isExpandable && item.children) {
                  return (
                    <div key={item.name} className="space-y-1">
                      {/* TMS Parent Navigation Button */}
                      <button
                        type="button"
                        onClick={handleTmsParentClick}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-apfel font-bold transition-all ${
                          isTmsActive
                            ? 'bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/70 to-[#fef3c7] text-[#92400e] border border-[#fde68a]/80 shadow-2xs font-extrabold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Icon className={`h-4 w-4 shrink-0 ${isTmsActive ? 'text-[#d97706]' : 'text-slate-500'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className="font-apfel text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                              isTmsExpanded ? 'rotate-180 text-[#d97706]' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* TMS Submenu Items */}
                      {isTmsExpanded && (
                        <div className="ml-4 pl-3 border-l-2 border-amber-200/80 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {item.children.map((child) => {
                            const isChildActive = currentModuleParam === child.exactQuery || (child.exactQuery === 'tms-dashboard' && currentModuleParam === 'tms');

                            return (
                              <Link
                                key={child.name}
                                href={child.path}
                                className={`block px-3 py-1.5 rounded-xl text-[11px] font-apfel transition-all ${
                                  isChildActive
                                    ? 'bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/90 to-[#fef3c7] text-[#92400e] font-extrabold border border-[#fde68a] shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-[#fef3c7]/40 font-semibold'
                                }`}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const active = isItemActive(item.path, item.exactQuery);

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-apfel font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/70 to-[#fef3c7] text-[#92400e] border border-[#fde68a]/80 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#d97706]' : 'text-slate-500'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`font-apfel text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                          item.badgeType === 'live'
                            ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                            : item.badgeType === 'beta'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status Card with 3D Gold Ribbon Mesh Graphic */}
      <div className="bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/90 to-[#fde68a]/50 border border-[#fde68a] rounded-3xl p-4 relative overflow-hidden text-left mt-6 shadow-2xs">
        <div className="relative z-10 max-w-[155px]">
          <div className="h-7 w-7 rounded-xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center mb-2 shadow-2xs">
            <Shield className="h-4 w-4 text-[#d97706]" />
          </div>
          <h4 className="font-montserrat text-xs font-black text-[#92400e] mb-1 leading-tight">Executive Workspace Active</h4>
          <p className="font-sans text-[10px] text-[#b45309] font-medium leading-relaxed mb-3">
            Dedicated CEO environment with real-time intelligence and priority controls.
          </p>
          <div className="flex items-center gap-1.5 font-apfel text-[10px] font-extrabold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

        <img
          src="/ceo_sidebar_gold_wave.png"
          alt="3D Gold Ribbon Graphic"
          className="absolute -bottom-2 -right-3 w-28 h-28 object-contain pointer-events-none opacity-85 z-0"
        />
      </div>
    </aside>
  );
}
