'use client';

import React, { useState } from 'react';
import { useCOOWebSocket } from '@/hooks/useCOOWebSocket';
import { Bell, Search, ShieldCheck, Wifi, FileText, Download, X, CheckSquare, Square, Layers, Database } from 'lucide-react';
import Link from 'next/link';

export function COONavbar() {
  const { isConnected } = useCOOWebSocket();
  const [showExportModal, setShowExportModal] = useState(false);

  // Available Modules State
  const moduleOptions = [
    { id: 'operations', label: 'Service Operations & Dispatch Queue', desc: 'Active tickets, SLA compliance & job throughput' },
    { id: 'fleet', label: 'Fleet Management & EV Telemetry', desc: 'Connected vehicle health, battery SOC & speed alerts' },
    { id: 'workshop', label: 'Workshop Capacity & Service Bays', desc: 'Service bay occupancy rate & daily repair volume' },
    { id: 'technicians', label: 'Technician Roster & CSAT Ratings', desc: 'Technician performance index, bonus & dispatch status' },
    { id: 'procurement', label: 'Procurement & Serialized Inventory', desc: 'Stock SKU levels, serial barcode logs & low-stock alerts' },
    { id: 'workforce', label: 'Workforce & HR Roster', desc: 'Department headcounts, daily attendance & leave logs' },
    { id: 'financials', label: 'Financial Oversight & Revenue (Read Only)', desc: 'Daily revenue, monthly gross totals & cost breakdown' },
  ];

  const [selectedModules, setSelectedModules] = useState<string[]>([
    'operations', 'fleet', 'workshop', 'technicians', 'procurement', 'workforce', 'financials'
  ]);
  const [selectAllCOOData, setSelectAllCOOData] = useState(true);

  // Toggle Entire COO Data Checkbox
  const handleToggleAllCOOData = () => {
    if (selectAllCOOData) {
      setSelectAllCOOData(false);
      setSelectedModules([]);
    } else {
      setSelectAllCOOData(true);
      setSelectedModules(moduleOptions.map((m) => m.id));
    }
  };

  // Toggle Individual Module Checkbox
  const handleToggleModule = (id: string) => {
    let updated: string[];
    if (selectedModules.includes(id)) {
      updated = selectedModules.filter((item) => item !== id);
    } else {
      updated = [...selectedModules, id];
    }
    setSelectedModules(updated);
    if (updated.length === moduleOptions.length) {
      setSelectAllCOOData(true);
    } else {
      setSelectAllCOOData(false);
    }
  };

  // Trigger Download
  const handleDownloadPDF = () => {
    let exportUrl = 'http://localhost:8000/api/coo/reports/export/pdf';
    if (selectAllCOOData || selectedModules.length === moduleOptions.length) {
      exportUrl += '?sections=all';
    } else {
      exportUrl += `?sections=${selectedModules.join(',')}`;
    }
    window.open(exportUrl, '_blank');
    setShowExportModal(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search & Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, VIN, parts, technicians..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Live System Indicators & Actions */}
      <div className="flex items-center space-x-4">
        {/* Real-time WebSocket Stream Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
          <Wifi className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
          <span>{isConnected ? 'Telemetry Stream Live' : 'Connecting Engine...'}</span>
        </div>

        {/* RBAC Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>COO RBAC Matrix</span>
        </div>

        {/* Export Summary PDF Button */}
        <button
          onClick={() => setShowExportModal(true)}
          className="btn-interactive flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold transition cursor-pointer shadow-sm hover:shadow-md active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>Export Summary PDF</span>
        </button>

        {/* Notification Bell */}
        <Link
          href="/dashboard/coo/collaboration#notifications"
          className="btn-interactive relative p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-full border border-slate-200 transition active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </Link>
      </div>

      {/* MODAL: Custom Executive PDF Export Options */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Custom Executive PDF Export</h2>
                  <p className="text-[11px] text-slate-500">Select which module summaries to include in your executive PDF report</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selectable Modules Checklist */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Available Operational Modules:</span>
              <div className="space-y-2">
                {moduleOptions.map((mod) => {
                  const isChecked = selectedModules.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      onClick={() => handleToggleModule(mod.id)}
                      className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition ${
                        isChecked ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">{mod.label}</span>
                        <span className="text-[11px] text-slate-500 block">{mod.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Special Checkbox: Summary of Entire Data Accessed by COO */}
            <div className="pt-3 border-t border-slate-200">
              <label
                onClick={handleToggleAllCOOData}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition ${
                  selectAllCOOData ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-100 border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectAllCOOData}
                  onChange={() => {}}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                />
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-black text-emerald-950 block">
                      Summary of the entire data accessed by the COO
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Includes complete operational ledger across all 7 hub modules
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold">
                {selectedModules.length} Modules Selected
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="btn-interactive px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedModules.length === 0}
                  onClick={handleDownloadPDF}
                  className="btn-interactive px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate & Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
