"use client";

import React from "react";
import {
  Database,
  BarChart3,
  Layers,
  Sparkles,
  Truck,
  SlidersHorizontal,
  RefreshCw,
  GitBranch,
  CodeXml,
  Store,
} from "lucide-react";

export type TabKey =
  | "overview"
  | "etl"
  | "starschema"
  | "olap"
  | "mining"
  | "dss"
  | "whatif"
  | "supabase";

interface NavbarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  dataSource: "SUPABASE" | "MOCK";
  lastSyncAt: string;
  isSyncing: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dataSource,
  lastSyncAt,
  isSyncing,
  onRefresh,
}) => {
  const tabs = [
    { key: "overview", label: "ภาพรวมผู้บริหาร", icon: BarChart3 },
    { key: "etl", label: "ETL Console", icon: RefreshCw },
    { key: "starschema", label: "Data Warehouse", icon: Layers },
    { key: "olap", label: "OLAP วิเคราะห์หลายมิติ", icon: GitBranch },
    { key: "mining", label: "Data Mining เหมืองข้อมูล", icon: Sparkles },
    { key: "dss", label: "DSS สั่งเติมสินค้า", icon: Truck },
    { key: "whatif", label: "What-If Simulation", icon: SlidersHorizontal },
    { key: "supabase", label: "SQL & Supabase", icon: CodeXml },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">RetailDSS</span>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-500/30">
                  Decision Support System
                </span>
              </div>
              <p className="text-xs text-slate-400">ระบบวิเคราะห์ยอดขายและวางแผนการเติมสินค้าร้านค้า</p>
            </div>
          </div>

          {/* Database Status & Refresh */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  dataSource === "SUPABASE"
                    ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-slate-300">
                {dataSource === "SUPABASE" ? "Supabase Live DB" : "In-Memory Engine (Ready)"}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{lastSyncAt}</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isSyncing}
              title="รีเฟรชข้อมูล"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
