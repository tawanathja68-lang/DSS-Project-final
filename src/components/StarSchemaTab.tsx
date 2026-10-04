"use client";

import React, { useState } from "react";
import {
  Layers,
  Table as TableIcon,
  Key,
  Database,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { DimDate, DimProduct, DimStore, FactInventory, FactSale } from "@/lib/types";

interface StarSchemaTabProps {
  stores: DimStore[];
  products: DimProduct[];
  dates: DimDate[];
  sales: FactSale[];
  inventory: FactInventory[];
}

export const StarSchemaTab: React.FC<StarSchemaTabProps> = ({
  stores,
  products,
  dates,
  sales,
  inventory,
}) => {
  const [selectedTable, setSelectedTable] = useState<
    "fact_sales" | "fact_inventory" | "dim_store" | "dim_product" | "dim_date"
  >("fact_sales");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-2">
          <Layers className="w-3.5 h-3.5" /> Data Warehouse Architecture
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          สถาปัตยกรรมคลังข้อมูลแบบ Star Schema (Fact & Dimension Tables)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          โครงสร้างตารางออกแบบตามหลัก Dimensional Modeling สำหรับระบบ OLAP เพื่อเพิ่มความเร็วในการสืบค้นและวิเคราะห์หลายมิติ
        </p>
      </div>

      {/* Interactive Visual Star Schema Diagram */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-sm overflow-x-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center justify-between">
          <span>แผนผัง Star Schema Diagram (มิติและตารางข้อเท็จจริง)</span>
          <span className="text-blue-400 font-normal">คลิกตารางด้านล่างเพื่อดูโครงสร้างจริง</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-5xl mx-auto">
          {/* Left Dimensions */}
          <div className="space-y-6">
            {/* Dim Store */}
            <div
              onClick={() => setSelectedTable("dim_store")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTable === "dim_store"
                  ? "bg-blue-900/40 border-blue-400 shadow-md shadow-blue-500/20"
                  : "bg-slate-800/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-blue-300">dim_store (มิติสาขา)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Dimension</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Key className="w-3 h-3" /> store_id (PK)
                </li>
                <li>• store_name</li>
                <li>• region</li>
                <li>• city</li>
                <li>• store_type</li>
              </ul>
            </div>

            {/* Dim Date */}
            <div
              onClick={() => setSelectedTable("dim_date")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTable === "dim_date"
                  ? "bg-purple-900/40 border-purple-400 shadow-md shadow-purple-500/20"
                  : "bg-slate-800/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-purple-300">dim_date (มิติเวลา)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">Dimension</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Key className="w-3 h-3" /> date_id (PK)
                </li>
                <li>• full_date</li>
                <li>• month_name</li>
                <li>• quarter</li>
                <li>• year, is_weekend</li>
              </ul>
            </div>
          </div>

          {/* Center: Fact Tables */}
          <div className="space-y-6">
            {/* Fact Sales */}
            <div
              onClick={() => setSelectedTable("fact_sales")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTable === "fact_sales"
                  ? "bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400"
                  : "bg-slate-800 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base text-emerald-400">fact_sales</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Core Fact Table
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">บันทึกธุรกรรมยอดขายและมาตรวัดทางการเงิน</p>
              <ul className="text-xs space-y-1 text-slate-300 font-mono">
                <li className="text-amber-300 flex items-center gap-1.5"><Key className="w-3 h-3" /> sales_id (PK)</li>
                <li className="text-indigo-300">&gt; date_id (FK)</li>
                <li className="text-indigo-300">&gt; store_id (FK)</li>
                <li className="text-indigo-300">&gt; product_id (FK)</li>
                <li className="text-emerald-300 font-semibold">+ quantity_sold (Measure)</li>
                <li className="text-emerald-300 font-semibold">+ total_sales (Measure)</li>
                <li className="text-emerald-300 font-semibold">+ gross_profit (Measure)</li>
              </ul>
            </div>

            {/* Fact Inventory */}
            <div
              onClick={() => setSelectedTable("fact_inventory")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTable === "fact_inventory"
                  ? "bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400"
                  : "bg-slate-800 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base text-amber-400">fact_inventory</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  Inventory Fact Table
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">บันทึกระดับสต็อก, ROP, และความเร่งด่วน</p>
              <ul className="text-xs space-y-1 text-slate-300 font-mono">
                <li className="text-amber-300 flex items-center gap-1.5"><Key className="w-3 h-3" /> inventory_id (PK)</li>
                <li className="text-indigo-300">&gt; store_id (FK)</li>
                <li className="text-indigo-300">&gt; product_id (FK)</li>
                <li className="text-amber-300 font-semibold">+ current_stock (Measure)</li>
                <li className="text-amber-300 font-semibold">+ safety_stock (Measure)</li>
                <li className="text-amber-300 font-semibold">+ reorder_point (Measure)</li>
              </ul>
            </div>
          </div>

          {/* Right Dimension: Dim Product */}
          <div>
            <div
              onClick={() => setSelectedTable("dim_product")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTable === "dim_product"
                  ? "bg-rose-900/40 border-rose-400 shadow-md shadow-rose-500/20"
                  : "bg-slate-800/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-rose-300">dim_product (มิติสินค้า)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Dimension</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Key className="w-3 h-3" /> product_id (PK)
                </li>
                <li>• product_name</li>
                <li>• category</li>
                <li>• unit_cost</li>
                <li>• unit_price</li>
                <li>• supplier_name</li>
                <li>• lead_time_days</li>
                <li>• min_order_qty (MOQ)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Table Data Browser */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ตารางข้อมูล: {selectedTable}</h2>
              <p className="text-xs text-slate-400">ตรวจสอบแถวข้อมูลจริงภายใน Data Warehouse</p>
            </div>
          </div>

          {/* Table Switcher Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                "fact_sales",
                "fact_inventory",
                "dim_product",
                "dim_store",
                "dim_date",
              ] as const
            ).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedTable === t
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Data View */}
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          {selectedTable === "fact_sales" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Sales ID</th>
                  <th className="py-3 px-4">Date ID</th>
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Total Sales</th>
                  <th className="py-3 px-4">Profit</th>
                  <th className="py-3 px-4">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {sales.slice(0, 8).map((s) => (
                  <tr key={s.sales_id} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-4 font-mono">{s.sales_id}</td>
                    <td className="py-2.5 px-4 font-mono text-purple-400">{s.date_id}</td>
                    <td className="py-2.5 px-4">{s.store?.store_name}</td>
                    <td className="py-2.5 px-4">{s.product?.product_name}</td>
                    <td className="py-2.5 px-4 font-bold">{s.quantity_sold}</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-medium">฿{s.total_sales.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-blue-400">฿{s.gross_profit.toLocaleString()}</td>
                    <td className="py-2.5 px-4">{s.profit_margin_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === "fact_inventory" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Safety Stock</th>
                  <th className="py-3 px-4">Reorder Point (ROP)</th>
                  <th className="py-3 px-4">In Transit</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {inventory.slice(0, 8).map((inv) => (
                  <tr key={inv.inventory_id} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-4">{inv.store?.store_name}</td>
                    <td className="py-2.5 px-4">{inv.product?.product_name}</td>
                    <td className="py-2.5 px-4 font-bold text-white">{inv.current_stock}</td>
                    <td className="py-2.5 px-4 text-slate-400">{inv.safety_stock}</td>
                    <td className="py-2.5 px-4 text-amber-400 font-medium">{inv.reorder_point}</td>
                    <td className="py-2.5 px-4">{inv.in_transit_qty}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.stock_status === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300"
                            : inv.stock_status === "LOW"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {inv.stock_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === "dim_product" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Product ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Lead Time (Days)</th>
                  <th className="py-3 px-4">MOQ</th>
                  <th className="py-3 px-4">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-4 font-mono text-blue-400 font-medium">{p.product_id}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{p.product_name}</td>
                    <td className="py-2.5 px-4">{p.category}</td>
                    <td className="py-2.5 px-4">฿{p.unit_cost}</td>
                    <td className="py-2.5 px-4 text-emerald-400">฿{p.unit_price}</td>
                    <td className="py-2.5 px-4">{p.lead_time_days} วัน</td>
                    <td className="py-2.5 px-4">{p.min_order_qty}</td>
                    <td className="py-2.5 px-4 text-slate-400">{p.supplier_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === "dim_store" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Store ID</th>
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Store Type</th>
                  <th className="py-3 px-4">Manager Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {stores.map((s) => (
                  <tr key={s.store_id} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-4 font-mono text-blue-400 font-medium">{s.store_id}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{s.store_name}</td>
                    <td className="py-2.5 px-4">{s.region}</td>
                    <td className="py-2.5 px-4">{s.city}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200">{s.store_type}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">{s.manager_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === "dim_date" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Date ID</th>
                  <th className="py-3 px-4">Full Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Quarter</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Day of Week</th>
                  <th className="py-3 px-4">Weekend?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {dates.slice(0, 8).map((d) => (
                  <tr key={d.date_id} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-4 font-mono text-purple-400 font-medium">{d.date_id}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{d.full_date}</td>
                    <td className="py-2.5 px-4">{d.day}</td>
                    <td className="py-2.5 px-4">{d.month_name}</td>
                    <td className="py-2.5 px-4">Q{d.quarter}</td>
                    <td className="py-2.5 px-4">{d.year}</td>
                    <td className="py-2.5 px-4">{d.day_name}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${d.is_weekend ? "bg-amber-500/20 text-amber-300" : "bg-slate-700 text-slate-300"}`}>
                        {d.is_weekend ? "วันหยุด" : "วันธรรมดา"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
