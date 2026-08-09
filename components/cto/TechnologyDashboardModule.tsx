'use client';

import React, { useState } from 'react';
import {
  Zap,
  Activity,
  BarChart3,
  Brain,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Cpu,
  Database,
  Download,
  FileText,
  Filter,
  Flame,
  Globe,
  HardDrive,
  HeartPulse,
  Info,
  Kanban,
  Layers,
  Lock,
  Maximize2,
  Network,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function TechnologyDashboardModule() {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 12 Exact Executive Technology Domain Matrix KPIs matching Geetha Sowmya's screenshot
  const domainCategories = [
    {
      name: 'Connected Mobility',
      badgeCount: 3,
      icon: Car,
      kpis: [
        { title: 'CONNECTED EVS', value: '45,200', status: 'Optimal', trend: '+12.4% MoM', source: 'EVcare.AI', route: 'telemetry-platform' },
        { title: 'DAILY ACTIVE VEHICLES', value: '38,400', status: 'Optimal', trend: '85% active rate', source: 'EVcare.AI', route: 'iot-device-management' },
        { title: 'FLEET HEALTH SCORE', value: '99.2%', status: 'Optimal', trend: '+0.4% baseline', source: 'EVcare.AI', route: 'ai-diagnostics' },
      ],
    },
    {
      name: 'Artificial Intelligence',
      badgeCount: 2,
      icon: Brain,
      kpis: [
        { title: 'AI DIAGNOSTICS TODAY', value: '45,200', status: 'Optimal', trend: '12.5M inferences today', source: 'AI', route: 'evcare-ai-dashboard' },
        { title: 'MODEL ACCURACY', value: '98.2%', status: 'Optimal', trend: '+2.4% vs last version', source: 'AI', route: 'ai-models' },
      ],
    },
    {
      name: 'Engineering',
      badgeCount: 3,
      icon: Code,
      kpis: [
        { title: 'ENGINEERING VELOCITY', value: '94.2%', status: 'Optimal', trend: '+4.1% completion rate', source: 'Sprint', route: 'sprint-management' },
        { title: 'OPEN CRITICAL BUGS', value: '0 Critical', status: 'Optimal', trend: '8 Non-Critical', source: 'Bug', route: 'bug-tracking' },
        { title: 'SYSTEM UPTIME', value: '99.98%', status: 'Optimal', trend: 'SLA compliant', source: 'Cloud', route: 'cloud-infrastructure' },
      ],
    },
    {
      name: 'Platform',
      badgeCount: 2,
      icon: Server,
      kpis: [
        { title: 'API RESPONSE TIME', value: '12ms', status: 'Optimal', trend: '-4ms speedup', source: 'API', route: 'api-management' },
        { title: 'CLOUD COST', value: '$42.8K/mo', status: 'Optimal', trend: '-3.2% optimization', source: 'Cloud', route: 'cloud-infrastructure' },
      ],
    },
    {
      name: 'Business',
      badgeCount: 2,
      icon: TrendingUp,
      kpis: [
        { title: 'ACTIVE FLEET CUSTOMERS', value: '142 Enterprise', status: 'Optimal', trend: '+12 new fleet', source: 'Customer', route: 'reports-analytics' },
        { title: 'MONTHLY RECURRING REVENUE', value: '$1.42M MRR', status: 'Optimal', trend: '+14.2% YoY', source: 'Reports', route: 'reports-analytics' },
      ],
    },
  ];

  // Upcoming Major Releases matching Geetha Sowmya's backend
  const upcomingReleases = [
    { name: 'EVcare.AI Platform v3.5', date: 'Aug 18, 2026', stage: 'Staging Validation', owner: 'Backend AI Team', readiness: '96%', confidence: 'High', version: 'v3.5.0-rc1', risk: 'Low' },
    { name: 'Mobile App BLE Sync v2.9', date: 'Aug 24, 2026', stage: 'QA Testing', owner: 'Mobile Squad', readiness: '84%', confidence: 'Medium', version: 'v2.9.0-beta', risk: 'Medium' },
    { name: 'Telemetry Gateway v4.0', date: 'Sep 02, 2026', stage: 'Architecture Review', owner: 'EV Telematics', readiness: '91%', confidence: 'High', version: 'v4.0.0-alpha', risk: 'Low' },
  ];

  // Boardroom Charts Data
  const deliveryData = [
    { month: 'Apr', velocity: 88, deploys: 240 },
    { month: 'May', velocity: 91, deploys: 275 },
    { month: 'Jun', velocity: 89, deploys: 290 },
    { month: 'Jul', velocity: 93, deploys: 305 },
    { month: 'Aug', velocity: 95, deploys: 312 },
  ];

  const qualityData = [
    { month: 'Apr', coverage: 82, quality: 89 },
    { month: 'May', coverage: 84, quality: 90 },
    { month: 'Jun', coverage: 85, quality: 91 },
    { month: 'Jul', coverage: 87, quality: 92 },
    { month: 'Aug', coverage: 88.5, quality: 92.4 },
  ];

  const slaData = [
    { month: 'Apr', sla: 99.95, latency: 48 },
    { month: 'May', sla: 99.98, latency: 45 },
    { month: 'Jun', sla: 99.99, latency: 44 },
    { month: 'Jul', sla: 99.99, latency: 43 },
    { month: 'Aug', sla: 99.99, latency: 42 },
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* TOP ACTION TOOLBAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => alert('Generating Executive Report PDF...')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" /> Generate Executive Report
          </button>
          <button onClick={() => alert('Exporting CTO Dashboard View...')} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-2">
            <Download className="h-3.5 w-3.5 text-slate-500" /> Export Dashboard
          </button>
          <button onClick={() => alert('AI Executive Summary...')} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-slate-500" /> AI Executive Summary
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => window.location.reload()} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" /> Refresh Dashboard
          </button>
          <button onClick={() => alert('Opening Dashboard Settings...')} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-slate-500" /> Dashboard Settings
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search across all CTO modules, releases, AI models, connected EVs, infrastructure..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none">
            <option value="all">Domain: All CTO Modules</option>
            <option value="connected">Connected Mobility</option>
            <option value="ai">AI & ML Intelligence</option>
            <option value="infra">Cloud Infrastructure</option>
          </select>

          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none">
            <option value="all">Region: All India Fleets</option>
            <option value="mumbai">Mumbai Region</option>
            <option value="bengaluru">Bengaluru Region</option>
          </select>
        </div>
      </div>

      {/* EXECUTIVE TECHNOLOGY DOMAIN MATRIX (5 COLUMNS MATCHING GEETHA SOWMYA'S SCREENSHOT) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" /> Executive Technology Domain Matrix
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">13 High-impact executive KPIs aggregated directly from source module data layers</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button onClick={() => setSelectedDomain('all')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              All Domains (13)
            </button>
            <button onClick={() => setSelectedDomain('mobility')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'mobility' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Mobility
            </button>
            <button onClick={() => setSelectedDomain('intelligence')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'intelligence' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              AI & ML
            </button>
            <button onClick={() => setSelectedDomain('engineering')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'engineering' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Engineering
            </button>
            <button onClick={() => setSelectedDomain('platform')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'platform' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Platform
            </button>
            <button onClick={() => setSelectedDomain('business')} className={`px-3 py-1 rounded-md transition-all ${selectedDomain === 'business' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Business
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {domainCategories.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <div key={catIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <CatIcon className="h-3.5 w-3.5 text-blue-600" /> {cat.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                    {cat.badgeCount}
                  </span>
                </div>

                <div className="space-y-2">
                  {cat.kpis.map((kpi, kpiIdx) => (
                    <div
                      key={kpiIdx}
                      className="bg-white p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                        <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px] flex items-center gap-1">
                          {kpi.trend} <Info className="h-2.5 w-2.5 text-blue-500 fill-blue-500 text-white" />
                        </span>
                      </div>
                      <p className="text-base font-black text-slate-900 mt-1">{kpi.value}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>← {kpi.source}</span>
                        <span className="text-blue-600 font-bold hover:underline">Go →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UPCOMING MAJOR RELEASES BOARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-600" /> Upcoming Major Releases Board
            </h2>
            <p className="text-xs text-slate-500 font-medium">Executive release pipeline across products, AI models, and core platform services</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
            3 Upcoming Releases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingReleases.map((rel, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-900">{rel.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                    {rel.version}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 font-medium">
                  <p>Target Date: <strong className="text-slate-900">{rel.date}</strong></p>
                  <p>Stage: <strong className="text-blue-600">{rel.stage}</strong></p>
                  <p>Owner Team: <strong className="text-slate-900">{rel.owner}</strong></p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Readiness:</span>
                <span className="font-bold text-emerald-600">{rel.readiness} (Confidence: {rel.confidence})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXECUTIVE BOARDROOM ANALYTICS ENGINE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" /> Executive Boardroom Analytics Engine
            </h2>
            <p className="text-xs text-slate-500 font-medium">Presentation-grade executive intelligence for engineering delivery, code quality & SLA uptime</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            Live Boardroom View
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart 1 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Are engineering teams delivering as expected?
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-2">1. Engineering Delivery Performance</h3>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-blue-600">94.2%</span>
                <span className="text-xs font-bold text-emerald-600">+4.1% vs Q2</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3">Sprint Completion: 96% | Release Success: 99.4%</p>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="velocity" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 font-medium">
              <strong>Summary:</strong> Milestone velocity reached 94.2% with 99.4% release success rate across 312 CI/CD deploys.
            </p>
          </div>

          {/* Chart 2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                Is our codebase healthy and sustainable?
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-2">2. Code Quality & Excellence</h3>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-purple-600">92.4% Score</span>
                <span className="text-xs font-bold text-emerald-600">88.5% Coverage</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3">Tech Debt: 4.2% | Critical Vulnerabilities: 0</p>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="quality" stroke="#9333ea" fill="#f3e8ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 font-medium">
              <strong>Summary:</strong> Code quality remains above enterprise standards (92.4%) with zero open critical vulnerabilities.
            </p>
          </div>

          {/* Chart 3 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Are cloud infrastructure & IoT streams reliable?
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-2">3. Platform Uptime & SLA</h3>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-emerald-600">99.99%</span>
                <span className="text-xs font-bold text-emerald-600">42ms Latency</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3">MQTT Ingestion: 14.2k/s | Zero Outages</p>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={slaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[99.9, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sla" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 font-medium">
              <strong>Summary:</strong> AWS EKS clusters and IoT telemetry streams sustained 99.99% uptime with 42ms latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
