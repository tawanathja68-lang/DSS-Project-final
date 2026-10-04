"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Coins,
  Warehouse,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { FactInventory, WhatIfScenarioInput } from "@/lib/types";
import { simulateWhatIfScenario } from "@/lib/analytics";

interface WhatIfTabProps {
  inventory: FactInventory[];
}

export const WhatIfTab: React.FC<WhatIfTabProps> = ({ inventory }) => {
  // Baseline input
  const defaultScenario: WhatIfScenarioInput = {
    demandSurgePct: 0,
    leadTimeDelayDays: 0,
    serviceLevelPct: 95,
    holdingCostRatePct: 15,
  };

  const [scenario, setScenario] = useState<WhatIfScenarioInput>(defaultScenario);

  // Run simulation
  const baselineResult = simulateWhatIfScenario(inventory, defaultScenario);
  const simulatedResult = simulateWhatIfScenario(inventory, scenario);

  const handleReset = () => {
    setScenario(defaultScenario);
  };

  // Comparison Chart Data
  const comparisonData = [
    {
      metric: "Safety Stock เฉลี่ย (ชิ้น)",
      Baseline: baselineResult.newSafetyStockAvg,
      Simulation: simulatedResult.newSafetyStockAvg,
    },
    {
      metric: "Reorder Point เฉลี่ย (ชิ้น)",
      Baseline: baselineResult.newReorderPointAvg,
      Simulation: simulatedResult.newReorderPointAvg,
    },
    {
      metric: "จำนวนชิ้นที่ต้องสั่งเพิ่ม (Units)",
      Baseline: baselineResult.totalOrderUnits,
      Simulation: simulatedResult.totalOrderUnits,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Simulation &amp; Sensitivity Analysis
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            การจำลองสถานการณ์เพื่อการตัดสินใจ (Interactive What-If Scenario Analysis)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            ปรับเปลี่ยนตัวแปรความต้องการของตลาด, ความล่าช้าในการจัดส่ง และระดับการบริการเพื่อดูผลกระทบต่อสต็อกและเงินทุนหมุนเวียน
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl border border-slate-600 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          รีเซ็ตเป็นค่าเริ่มต้น
        </button>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <span>กำหนดตัวแปรสถานการณ์จำลอง (Scenario Parameters)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Demand Surge */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">
                ดีมานด์เพิ่ม/ลด (Demand Surge)
              </label>
              <span className="text-xs font-mono font-bold text-blue-400">
                {scenario.demandSurgePct >= 0 ? "+" : ""}
                {scenario.demandSurgePct}%
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={scenario.demandSurgePct}
              onChange={(e) =>
                setScenario({ ...scenario, demandSurgePct: Number(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-30% (Low Season)</span>
              <span>+50% (Promo Peak)</span>
            </div>
          </div>

          {/* Slider 2: Lead Time Delay */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">
                ความล่าช้าขนส่ง (Lead Time Delay)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                +{scenario.leadTimeDelayDays} วัน
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={scenario.leadTimeDelayDays}
              onChange={(e) =>
                setScenario({ ...scenario, leadTimeDelayDays: Number(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 วัน (ปกติ)</span>
              <span>+7 วัน (วิกฤตขนส่ง)</span>
            </div>
          </div>

          {/* Slider 3: Service Level Target */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">
                ระดับการบริการ (Service Level)
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {scenario.serviceLevelPct}%
              </span>
            </div>
            <input
              type="range"
              min="85"
              max="99"
              step="1"
              value={scenario.serviceLevelPct}
              onChange={(e) =>
                setScenario({ ...scenario, serviceLevelPct: Number(e.target.value) })
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>85% (Z=1.04)</span>
              <span>99% (Z=2.33)</span>
            </div>
          </div>

          {/* Slider 4: Holding Cost Rate */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">
                ต้นทุนการเก็บรักษา (Carrying Rate)
              </label>
              <span className="text-xs font-mono font-bold text-purple-400">
                {scenario.holdingCostRatePct}% ต่อปี
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={scenario.holdingCostRatePct}
              onChange={(e) =>
                setScenario({ ...scenario, holdingCostRatePct: Number(e.target.value) })
              }
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Impact Summary Alert Box */}
        <div className="mt-5 p-4 rounded-xl bg-blue-900/20 border border-blue-700/40 text-xs text-blue-200 flex items-start gap-2.5">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-white">ข้อสรุปผลกระทบเชิงกลยุทธ์ (DSS Executive Assessment):</div>
            <p className="mt-0.5">{simulatedResult.impactSummary}</p>
          </div>
        </div>
      </div>

      {/* Comparison KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Safety Stock */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Safety Stock เฉลี่ยต่อ SKU</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">{simulatedResult.newSafetyStockAvg} ชิ้น</span>
            <span className="text-xs text-slate-400">
              (เดิม: {baselineResult.newSafetyStockAvg} ชิ้น)
            </span>
          </div>
          <div className="text-xs mt-1 text-blue-400">
            {simulatedResult.newSafetyStockAvg >= baselineResult.newSafetyStockAvg ? "▲ เพิ่มขึ้น" : "▼ ลดลง"}{" "}
            {Math.abs(simulatedResult.newSafetyStockAvg - baselineResult.newSafetyStockAvg)} ชิ้น
          </div>
        </div>

        {/* Metric 2: Working Capital */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">เงินทุนหมุนเวียนที่ต้องสำรอง</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-400">
              ฿{simulatedResult.totalWorkingCapitalNeeded.toLocaleString()}
            </span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            เดิม: ฿{baselineResult.totalWorkingCapitalNeeded.toLocaleString()}
          </div>
        </div>

        {/* Metric 3: Stockout Risk */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">ความเสี่ยงสินค้าขาดสต็อก (Stockout)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-2xl font-bold ${
                simulatedResult.stockoutRiskPct > 15
                  ? "text-rose-400"
                  : simulatedResult.stockoutRiskPct > 5
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {simulatedResult.stockoutRiskPct}%
            </span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            สัดส่วนสินค้าที่เสี่ยงหมดสต็อกระหว่างรอส่ง
          </div>
        </div>

        {/* Metric 4: Carrying Cost */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">ต้นทุนการถือครองสต็อกต่อปี</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-purple-400">
              ฿{simulatedResult.totalCarryingCostAnnual.toLocaleString()}
            </span>
          </div>
          <div className="text-xs mt-1 text-slate-400">
            คำนวณจากอัตรา {scenario.holdingCostRatePct}% ต่อปี
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <h2 className="text-base font-bold text-white mb-1">
          เปรียบเทียบผลลัพธ์: สภาพแวดล้อมปัจจุบัน (Baseline) vs สถานการณ์จำลอง (Simulation)
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          แสดงความแตกต่างของตัวชี้วัดสำคัญเพื่อช่วยผู้บริหารตัดสินใจปรับแผนการสั่งซื้อ
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="Baseline" fill="#64748b" name="สถานการณ์ปัจจุบัน (Baseline)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Simulation" fill="#3b82f6" name="สถานการณ์จำลอง (What-If)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
