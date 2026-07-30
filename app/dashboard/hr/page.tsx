'use client';

import React, { useState } from 'react';
import { useRole } from '../../../components/RoleContext';
import { mockTechnicians } from '../../../lib/mock-data';
import { Users, Star, Award, CheckCircle, TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HRDashboard() {
  const { currentProfile } = useRole();
  const [techs] = useState(mockTechnicians);

  const productivityChartData = techs.map((t) => ({
    name: t.name.split(' ')[0],
    completed: t.completedJobsMonth,
    rating: t.customerRating,
  }));

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-pink-600" />
            <span className="text-xs font-black uppercase tracking-widest text-pink-700">Human Resources Office</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Technician Productivity & Staff Analytics</h1>
          <p className="text-xs text-slate-600 max-w-xl font-medium">
            Monitoring technician SLAs, monthly job output, customer rating indices, and service hub attendance rosters.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs">
            <UserCheck className="h-4 w-4 text-pink-600" /> Total Staff: 64 Employed
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Technician CSAT</p>
          <p className="text-2xl font-black text-amber-600 mt-2 flex items-center gap-1">
            4.88 <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block font-medium">Based on 1,240 Customer Reviews</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Completed Jobs</p>
          <p className="text-2xl font-black text-slate-900 mt-2">1,410 Jobs</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">+14% Productivity Growth</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Compliance Rate</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">97.6%</p>
          <span className="text-xs text-slate-500 mt-1 inline-block font-medium">On-time service execution</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Technicians On-Duty</p>
          <p className="text-2xl font-black text-slate-900 mt-2">48 Active</p>
          <span className="text-xs text-slate-500 mt-1 inline-block font-medium">16 On Shift Break / Training</span>
        </div>
      </div>

      {/* Productivity Chart & Technician Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Monthly Technician Job Output</h2>
          <p className="text-xs text-slate-500 font-medium mb-4">Comparison of completed EV service jobs across staff members</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityChartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="completed" fill="#db2777" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Performance Index */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900">Top Performers</h2>
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {techs.map((tech) => (
                <div key={tech.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{tech.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{tech.completedJobsMonth} Jobs • Rating {tech.customerRating}★</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{tech.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
