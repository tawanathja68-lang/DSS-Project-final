"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Filter,
  Grid3X3,
  BarChart,
  ArrowDownUp,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DimProduct, DimStore, FactSale } from "@/lib/types";
import { filterAndAggregateSales, generatePivotMatrix } from "@/lib/analytics";

interface OLAPTabProps {
  sales: FactSale[];
  stores: DimStore[];
  products: DimProduct[];
}

export const OLAPTab: React.FC<OLAPTabProps> = ({ sales, stores, products }) => {
  // Slicing & Dicing filters
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedStore, setSelectedStore] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Roll-up / Drill-down dimension
  const [drillDimension, setDrillDimension] = useState<"store" | "category">("store");

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const regions = Array.from(new Set(stores.map((s) => s.region)));

  // Filter sales
  const { filteredSales, totalSales, grossProfit, marginPct, totalUnits } =
    filterAndAggregateSales(sales, {
      region: selectedRegion,
      storeId: selectedStore,
      category: selectedCategory,
    });

  // Pivot Matrix
  const { categories: matrixCategories, rows: pivotRows } = generatePivotMatrix(filteredSales);

  // Chart data according to drill dimension
  const chartData =
    drillDimension === "store"
      ? stores.map((st) => {
          const storeSales = filteredSales
            .filter((s) => s.store_id === st.store_id)
            .reduce((sum, s) => sum + s.total_sales, 0);
          return {
            name: st.store_name.replace("สาขา", ""),
            ยอดขาย: Math.round(storeSales),
          };
        })
      : categories.map((cat) => {
          const catSales = filteredSales
            .filter((s) => s.product?.category === cat)
            .reduce((sum, s) => sum + s.total_sales, 0);
          return {
            name: cat,
            ยอดขาย: Math.round(catSales),
          };
        });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 mb-2">
          <GitBranch className="w-3.5 h-3.5" /> Online Analytical Processing (OLAP)
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          การวิเคราะห์หลายมิติ (Multidimensional OLAP Cube)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          เครื่องมือ Slice &amp; Dice, Roll-up, Drill-down และ Pivot Table สำหรับวิเคราะห์ผลการดำเนินงานแบบเรียลไทม์
        </p>
      </div>

      {/* Slice & Dice Filter Controls */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>การกรองมิติข้อมูล (Slice &amp; Dice Operations)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Slice 1: Region */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              มิติภูมิภาค (Region Dimension)
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedStore("ALL"); // Reset store when region changes
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกลู่ภูมิภาค (All Regions)</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Slice 2: Store */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              มิติสาขา (Store Dimension)
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกสาขา (All Stores)</option>
              {stores
                .filter((s) => selectedRegion === "ALL" || s.region === selectedRegion)
                .map((s) => (
                  <option key={s.store_id} value={s.store_id}>
                    {s.store_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Slice 3: Category */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              มิติหมวดหมู่สินค้า (Product Category)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกหมวดหมู่ (All Categories)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Aggregated KPIs from Sliced View */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">ยอดขายตามเงื่อนไข:</span>
            <div className="text-base font-bold text-white mt-0.5">
              ฿{totalSales.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">กำไรขั้นต้น:</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              ฿{grossProfit.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">Profit Margin:</span>
            <div className="text-base font-bold text-blue-400 mt-0.5">{marginPct.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-slate-400">ปริมาณขาย (Units):</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">{totalUnits.toLocaleString()} ชิ้น</div>
          </div>
        </div>
      </div>

      {/* Drill-down / Roll-up Chart */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Roll-up &amp; Drill-down: วิเคราะห์เทียบมิติ {drillDimension === "store" ? "สาขา" : "หมวดหมู่สินค้า"}
            </h2>
            <p className="text-xs text-slate-400">
              กดปุ่มสลับมิติเพื่อ Roll-up (สรุประดับสูง) หรือ Drill-down (เจาะลึก)
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDrillDimension("store")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                drillDimension === "store"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              มิติสาขา (By Store)
            </button>
            <button
              onClick={() => setDrillDimension("category")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                drillDimension === "category"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              มิติหมวดหมู่ (By Category)
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                formatter={(v: any) => [`฿${Number(v).toLocaleString()}`, "ยอดขาย"]}
              />
              <Bar dataKey="ยอดขาย" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multidimensional Pivot Matrix Table */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white">ตารางสรุปข้ามมิติ (OLAP Pivot Matrix)</h2>
              <p className="text-xs text-slate-400">มิติสาขา (แถว) x มิติหมวดหมู่สินค้า (คอลัมน์)</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            Pivot View
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-slate-900 z-10">สาขา \ หมวดหมู่</th>
                {matrixCategories.map((cat) => (
                  <th key={cat} className="py-3 px-4 text-right whitespace-nowrap">
                    {cat}
                  </th>
                ))}
                <th className="py-3 px-4 text-right bg-blue-900/30 text-blue-300 font-bold whitespace-nowrap">
                  ยอดรวมสาขา (Total)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {pivotRows.map((row) => (
                <tr key={row.storeId} className="hover:bg-slate-700/30">
                  <td className="py-2.5 px-4 font-medium text-white sticky left-0 bg-slate-800 whitespace-nowrap">
                    {row.storeName}
                  </td>
                  {matrixCategories.map((cat) => (
                    <td key={cat} className="py-2.5 px-4 text-right font-mono">
                      ฿{(row[cat] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400 bg-blue-900/10">
                    ฿{row.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
