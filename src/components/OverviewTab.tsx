"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Store,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FactInventory, FactSale } from "@/lib/types";
import { aggregateByDimension } from "@/lib/analytics";

interface OverviewTabProps {
  sales: FactSale[];
  inventory: FactInventory[];
  onNavigateTab: (tab: any) => void;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export const OverviewTab: React.FC<OverviewTabProps> = ({ sales, inventory, onNavigateTab }) => {
  // Aggregate KPIs
  const totalSales = sales.reduce((sum, s) => sum + s.total_sales, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.total_cost, 0);
  const grossProfit = totalSales - totalCost;
  const marginPct = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  const totalStockOnHand = inventory.reduce((sum, i) => sum + i.current_stock, 0);
  const totalStockValue = inventory.reduce(
    (sum, i) => sum + i.current_stock * (i.product?.unit_cost || 0),
    0
  );

  const criticalStockCount = inventory.filter((i) => i.stock_status === "CRITICAL").length;
  const lowStockCount = inventory.filter((i) => i.stock_status === "LOW").length;
  const optimalStockCount = inventory.filter((i) => i.stock_status === "OPTIMAL").length;
  const overstockCount = inventory.filter((i) => i.stock_status === "OVERSTOCK").length;

  // Chart Data
  const salesByDate = aggregateByDimension(sales, "date").slice(-14);
  const salesByStore = aggregateByDimension(sales, "store");
  const salesByCategory = aggregateByDimension(sales, "category");

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-6 rounded-2xl border border-blue-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-2">
            <Store className="w-3.5 h-3.5" /> ระบบวิเคราะห์และสนับสนุนการตัดสินใจฝ่ายบริหาร (Executive DSS)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            แดชบอร์ดติดตามยอดขายและสถานะสต็อกร้านค้าปลีก
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            วิเคราะห์ข้อมูลจาก Star Schema คลังข้อมูลแบบบูรณาการ พร้อมระบบปัญญาประดิษฐ์แนะนำการสั่งเติมสินค้าอัตโนมัติ
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab("dss")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            ตรวจคำสั่งเติมสินค้า ({criticalStockCount + lowStockCount})
          </button>
          <button
            onClick={() => onNavigateTab("etl")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            ตรวจสอบ ETL Pipeline
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Sales */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">ยอดขายรวม (Total Sales)</span>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              ฿{totalSales.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center mt-1 text-xs text-emerald-400 gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.8% จากเดือนก่อนหน้า</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Gross Profit */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">กำไรขั้นต้น (Gross Profit)</span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              ฿{grossProfit.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center mt-1 text-xs text-slate-300 gap-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Margin {marginPct.toFixed(1)}%
              </span>
              <span className="text-slate-400">อัตรากำไรเฉลี่ย</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Stock Value */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">มูลค่าสต็อกคงคลัง (Inventory Value)</span>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              ฿{totalStockValue.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center mt-1 text-xs text-slate-400 gap-1">
              <span>รวม {totalStockOnHand.toLocaleString()} หน่วย</span>
              <span className="text-slate-500">• 5 สาขาทั่วประเทศ</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Stockout Alerts */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-sm relative overflow-hidden group hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">รายการแจ้งเตือนสต็อก (Alerts)</span>
            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-400">
              {criticalStockCount + lowStockCount} <span className="text-sm font-normal text-slate-300">รายการ</span>
            </div>
            <div className="flex items-center mt-1 text-xs text-rose-300 gap-1.5">
              <span className="font-semibold text-rose-400">วิกฤต {criticalStockCount} รายการ</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400">ใกล้หมด {lowStockCount} รายการ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">แนวโน้มยอดขายรายวัน (14 วันล่าสุด)</h2>
              <p className="text-xs text-slate-400">ประมวลผลจากตาราง Fact Sales และ Dim Date ใน Data Warehouse</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Daily Trend
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDate}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, "ยอดขาย"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Performance Bar Chart (1 Col) */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">ยอดขายแยกตามสาขา</h2>
              <p className="text-xs text-slate-400">เปรียบเทียบผลการดำเนินงาน 5 สาขา</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByStore} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                />
                <YAxis dataKey="label" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, "ยอดขาย"]}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Health & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (Pie) */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
          <h2 className="text-base font-bold text-white mb-1">สัดส่วนยอดขายตามหมวดหมู่</h2>
          <p className="text-xs text-slate-400 mb-4">วิเคราะห์ยอดขายตามประเภทสินค้าปลีก</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  dataKey="sales"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, "ยอดขาย"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {salesByCategory.slice(0, 4).map((cat, idx) => (
              <div key={cat.label} className="flex items-center text-xs gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">สุขภาพสต็อกสินค้า (Inventory Health Status)</h2>
              <p className="text-xs text-slate-400">สถานะสต็อกเทียบกับ Safety Stock และ Reorder Point (ROP)</p>
            </div>
            <button
              onClick={() => onNavigateTab("dss")}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              ดูแผนการเติมสินค้าทั้งหมด &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <AlertCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-rose-400">{criticalStockCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Critical (วิกฤต)</div>
              <div className="text-[10px] text-slate-400">&lt; 50% ของ Safety Stock</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-amber-400">{lowStockCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Low Stock (สต็อกต่ำ)</div>
              <div className="text-[10px] text-slate-400">&le; Reorder Point</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-emerald-400">{optimalStockCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Optimal (เหมาะสม)</div>
              <div className="text-[10px] text-slate-400">ระดับสต็อกสมดุล</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <Layers className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-400">{overstockCount}</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Overstock (เกินพอดี)</div>
              <div className="text-[10px] text-slate-400">เสี่ยงจมทุนสต็อก</div>
            </div>
          </div>

          <div className="border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-700 text-xs font-semibold text-slate-300 flex justify-between">
              <span>ตัวอย่างรายการสินค้าที่ต้องเฝ้าระวังด่วน</span>
              <span>สถานะการแจ้งเตือน</span>
            </div>
            <div className="divide-y divide-slate-700/60 text-xs">
              {inventory
                .filter((i) => i.stock_status === "CRITICAL" || i.stock_status === "LOW")
                .slice(0, 4)
                .map((item) => (
                  <div key={item.inventory_id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-700/30">
                    <div>
                      <span className="font-medium text-white">{item.product?.product_name}</span>
                      <span className="text-slate-400 ml-2">({item.store?.store_name})</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        คงเหลือ: <strong className="text-white">{item.current_stock}</strong> ชิ้น | ROP: {item.reorder_point} ชิ้น | Safety Stock: {item.safety_stock} ชิ้น
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        item.stock_status === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {item.stock_status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
