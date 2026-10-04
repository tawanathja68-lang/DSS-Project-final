"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Layers,
  ArrowRight,
  Info,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DimProduct, FactSale, RawTransaction } from "@/lib/types";
import {
  computeABCAnalysis,
  computeMarketBasketAnalysis,
  computeSalesForecast,
} from "@/lib/analytics";

interface DataMiningTabProps {
  sales: FactSale[];
  products: DimProduct[];
  rawTransactions: RawTransaction[];
}

export const DataMiningTab: React.FC<DataMiningTabProps> = ({
  sales,
  products,
  rawTransactions,
}) => {
  const [activeModel, setActiveModel] = useState<"basket" | "forecast" | "abc">("basket");

  const productLookup = new Map<string, string>(
    products.map((p) => [p.product_id, p.product_name])
  );

  // 1. Market Basket Rules
  const basketRules = computeMarketBasketAnalysis(rawTransactions);

  // 2. Forecast Data
  const forecastData = computeSalesForecast(sales, 7);

  // 3. ABC Analysis
  const abcItems = computeABCAnalysis(sales);
  const classACount = abcItems.filter((i) => i.classification === "A").length;
  const classBCount = abcItems.filter((i) => i.classification === "B").length;
  const classCCount = abcItems.filter((i) => i.classification === "C").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Predictive Analytics &amp; Pattern Discovery
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ระบบเหมืองข้อมูลค้าปลีก (Retail Data Mining Models)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            ค้นหาแบบแผนเชิงลึกด้วยอัลกอริทึม Apriori, Time Series Demand Forecasting และ ABC Inventory Classification
          </p>
        </div>

        {/* Model Switcher Tabs */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700 gap-1">
          <button
            onClick={() => setActiveModel("basket")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeModel === "basket"
                ? "bg-purple-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Market Basket (Apriori)
          </button>
          <button
            onClick={() => setActiveModel("forecast")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeModel === "forecast"
                ? "bg-purple-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            พยากรณ์ยอดขาย (Forecast)
          </button>
          <button
            onClick={() => setActiveModel("abc")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeModel === "abc"
                ? "bg-purple-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            ABC Analysis (Pareto)
          </button>
        </div>
      </div>

      {/* MODEL 1: Market Basket Analysis */}
      {activeModel === "basket" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">เกณฑ์ค่า Support ขั้นต่ำ</span>
              <div className="text-2xl font-bold text-white mt-1">5.0%</div>
              <p className="text-[11px] text-slate-400 mt-1">สัดส่วนบิลที่พบสินค้าคู่กันในร้าน</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">เกณฑ์ค่า Lift Ratio</span>
              <div className="text-2xl font-bold text-purple-400 mt-1">&gt; 1.2x</div>
              <p className="text-[11px] text-slate-400 mt-1">สินค้ามีความสัมพันธ์เชิงบวกต่อกันสูง</p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium">กฎความสัมพันธ์ที่ค้นพบ</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{basketRules.length} กฎ</div>
              <p className="text-[11px] text-slate-400 mt-1">พร้อมคำแนะนำการจัดวางสินค้าและโปรโมชั่น</p>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
            <h2 className="text-base font-bold text-white mb-1">
              ตารางกฎความสัมพันธ์การซื้อสินค้า (Association Rules - Apriori Algorithm)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              ใช้สำหรับวางแผน Cross-selling, จัดชุดสินค้าโปรโมชั่น และจัดวางตำแหน่งสินค้าบนชั้นวาง (Shelf Merchandising)
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">สินค้าต้นทาง (ถ้าซื้อ...)</th>
                    <th className="py-3 px-4 text-center">ความสัมพันธ์</th>
                    <th className="py-3 px-4">สินค้าปลายทาง (...จะซื้อด้วย)</th>
                    <th className="py-3 px-4 text-right">Support</th>
                    <th className="py-3 px-4 text-right">Confidence</th>
                    <th className="py-3 px-4 text-right">Lift</th>
                    <th className="py-3 px-4">คำแนะนำเชิงกลยุทธ์ (DSS Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                  {basketRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      <td className="py-3 px-4 font-medium text-white">
                        {productLookup.get(rule.antecedent) || rule.antecedent}
                      </td>
                      <td className="py-3 px-4 text-center text-purple-400">
                        <ArrowRight className="w-4 h-4 mx-auto" />
                      </td>
                      <td className="py-3 px-4 font-medium text-indigo-300">
                        {productLookup.get(rule.consequent) || rule.consequent}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{rule.support}%</td>
                      <td className="py-3 px-4 text-right font-mono">{rule.confidence}%</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        {rule.lift}x
                      </td>
                      <td className="py-3 px-4 text-slate-300">{rule.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODEL 2: Demand Forecasting */}
      {activeModel === "forecast" && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  แบบจำลองพยากรณ์ความต้องการยอดขายล่วงหน้า 7 วัน (Sales Demand Forecasting)
                </h2>
                <p className="text-xs text-slate-400">
                  คำนวณด้วยอัลกอริทึม Exponential Smoothing with Trend &amp; Day-of-Week Seasonality
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                Time Series Model
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                    formatter={(v: any) => [`฿${Number(v).toLocaleString()}`, ""]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="historicalSales"
                    name="ยอดขายจริงในอดีต (Actual)"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecastedSales"
                    name="ยอดขายที่พยากรณ์ล่วงหน้า (Forecast)"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidenceUpper"
                    name="ช่วงความเชื่อมั่นบน (Upper Bound)"
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>DSS Insight:</strong> แบบจำลองตรวจพบว่ายอดขายมี Seasonal Peak ในช่วงวันศุกร์-เสาร์-อาทิตย์ เพิ่มขึ้นเฉลี่ย 25% จึงควรสั่งเติมสินค้าล่วงหน้าในวันพุธ-พฤหัสบดีเพื่อรองรับดีมานด์
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODEL 3: ABC Inventory Classification */}
      {activeModel === "abc" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">กลุ่ม A (Top 70% Revenue)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Class A</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{classACount} รายการ</div>
              <p className="text-[11px] text-slate-400 mt-1">สินค้าสร้างรายได้หลัก ห้ามสินค้าขาดสต็อกเด็ดขาด</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400">กลุ่ม B (Next 20% Revenue)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Class B</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{classBCount} รายการ</div>
              <p className="text-[11px] text-slate-400 mt-1">สินค้าขายได้ปานกลาง ควบคุมสต็อกตามรอบปกติ</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">กลุ่ม C (Remaining 10% Revenue)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Class C</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{classCCount} รายการ</div>
              <p className="text-[11px] text-slate-400 mt-1">สินค้าขายช้า สั่งปริมาณน้อยเพื่อไม่ให้จมทุน</p>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
            <h2 className="text-base font-bold text-white mb-1">
              ตารางจัดกลุ่มสินค้าตามกฎพาเรโต (ABC Inventory Classification)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              จัดลำดับความสำคัญของสินค้าตามสัดส่วนมูลค่ายอดขายสะสม เพื่อกำหนดนโยบายการเติมสินค้าที่แม่นยำ
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">รหัสสินค้า</th>
                    <th className="py-3 px-4">ชื่อสินค้า</th>
                    <th className="py-3 px-4">หมวดหมู่</th>
                    <th className="py-3 px-4 text-right">ยอดขายรวม (Revenue)</th>
                    <th className="py-3 px-4 text-right">% สะสม (Cumulative)</th>
                    <th className="py-3 px-4 text-center">Class</th>
                    <th className="py-3 px-4">กลยุทธ์การบริหารสต็อก (DSS Policy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                  {abcItems.map((item) => (
                    <tr key={item.product_id} className="hover:bg-slate-700/30">
                      <td className="py-2.5 px-4 font-mono text-purple-400 font-medium">
                        {item.product_id}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-white">{item.product_name}</td>
                      <td className="py-2.5 px-4">{item.category}</td>
                      <td className="py-2.5 px-4 text-right font-mono text-emerald-400 font-medium">
                        ฿{item.total_revenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                        {item.cumulative_revenue_pct}%
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.classification === "A"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : item.classification === "B"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {item.classification}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">{item.strategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
