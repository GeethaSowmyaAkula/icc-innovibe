'use client';

import React from 'react';
import { useRole } from './RoleContext';
import { useRouter } from 'next/navigation';
import { Zap, Bell, Settings, Search } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const router = useRouter();
  const { currentProfile, logout } = useRole();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-2xs font-sans">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
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

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Tracking Active Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-apfel font-bold px-3 py-1.5 rounded-full bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Tracking Active</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 border-l border-slate-100 pl-3">
          <button
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 border-2 border-white" />
          </button>
          <button
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            title="Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Profile Card */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          title="Click to Log Out"
        >
          <img
            src={currentProfile.avatar}
            alt={currentProfile.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-2xs"
          />
          <div className="hidden sm:block text-left">
            <p className="font-gotham text-xs font-bold text-slate-900 leading-tight">{currentProfile.name}</p>
            <p className="font-sans text-[10px] text-slate-500 font-medium mt-0.5">{currentProfile.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
