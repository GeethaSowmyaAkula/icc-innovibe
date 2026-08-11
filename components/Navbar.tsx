'use client';

import React, { useState } from 'react';
import { useRole } from './RoleContext';
import { useRouter, usePathname } from 'next/navigation';
import { RoleType } from '../lib/types';
import { initialProfiles } from '../lib/mock-data';
import { Zap, Sparkles, LogOut, Search, Activity, Bell, Settings } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { activeRole, currentProfile, logout, isSuperAdmin } = useRole();

  const getEffectiveRole = (): RoleType => {
    if (pathname.startsWith('/dashboard/hr')) return 'HR';
    if (pathname.startsWith('/dashboard/cto')) return 'CTO';
    if (pathname.startsWith('/dashboard/coo')) return 'COO';
    if (pathname.startsWith('/dashboard/service-manager')) return 'SERVICE_MANAGER';
    if (pathname.startsWith('/dashboard/technician')) return 'TECHNICIAN';
    if (pathname.startsWith('/dashboard/ceo')) return 'CEO';
    return activeRole;
  };

  const effectiveRole = getEffectiveRole();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const roleLabels: Record<RoleType, { title: string; badgeColor: string }> = {
    CEO: { title: 'CEO Dashboard (Super Admin)', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
    COO: { title: 'COO Dashboard (Operations)', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
    CTO: { title: 'CTO Dashboard (Technology)', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
    SERVICE_MANAGER: { title: 'Service Manager Dashboard', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    HR: { title: 'HR Dashboard (Human Resources)', badgeColor: 'bg-pink-100 text-pink-900 border-pink-300' },
    TECHNICIAN: { title: 'Technician Portal', badgeColor: 'bg-teal-100 text-teal-900 border-teal-300' },
  };

  const displayProfile = (currentProfile && currentProfile.role === effectiveRole)
    ? currentProfile
    : (initialProfiles[effectiveRole] || currentProfile || initialProfiles.CEO);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs font-sans">
      {/* Left Branding & Role Indicator */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#92400e] flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-gotham font-black text-lg tracking-tight text-slate-900 leading-none">INNOVIBE</span>
              <span className="font-apfel text-[10px] px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-extrabold border border-[#fde68a]">
                ICC v1.0
              </span>
            </div>
            <p className="font-montserrat text-[11px] text-slate-400 font-semibold tracking-tight mt-0.5">Mobility Command Center</p>
          </div>
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block" />

        {/* Active Designation Badge */}
        <div className="hidden lg:flex items-center gap-2">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border ${roleLabels[effectiveRole]?.badgeColor || roleLabels.CEO.badgeColor} flex items-center gap-1.5 shadow-xs`}>
            <Sparkles className="h-3.5 w-3.5" />
            {roleLabels[effectiveRole]?.title || roleLabels.CEO.title}
          </span>
          {effectiveRole === 'CEO' && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Activity className="h-3 w-3 text-emerald-600 animate-pulse" /> Live Tracking Active
            </span>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center justify-between bg-slate-50/80 border border-slate-200/70 rounded-xl px-3.5 py-1.5 w-[420px] shadow-2xs focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
        <div className="flex items-center gap-2 w-full">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tickets, vehicles, telematics, staff..."
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full font-sans font-medium"
          />
        </div>
        <kbd className="font-apfel text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs font-mono shrink-0 ml-2">
          ⌘K
        </kbd>
      </div>

      {/* Right User & Logout Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white"></span>
          </button>
          
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">2 New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">System Update</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">InnoVibe Command Center v1.0 has been successfully deployed.</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">10 mins ago</p>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">New Task Assigned</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">You have a new high-voltage EV diagnostic task pending in your queue.</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50">
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-1" suppressHydrationWarning>
          <img
            src={displayProfile.avatar}
            alt={displayProfile.name}
            className="h-9 w-9 rounded-full object-cover border-2 border-sky-500 shadow-xs"
            suppressHydrationWarning
          />
          <div className="hidden sm:block text-left" suppressHydrationWarning>
            <p className="text-xs font-bold text-slate-900 leading-none" suppressHydrationWarning>{displayProfile.name}</p>
            <p className="text-[10px] text-sky-700 font-medium mt-0.5" suppressHydrationWarning>{displayProfile.title}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log Out"
          className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all ml-1"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
