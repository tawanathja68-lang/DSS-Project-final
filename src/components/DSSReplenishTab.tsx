"use client";

import React, { useState } from "react";
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Filter,
  Check,
  PackageCheck,
  Building2,
} from "lucide-react";
import { FactInventory, ReplenishmentRecommendation } from "@/lib/types";
import { generateReplenishmentRecommendations } from "@/lib/analytics";

interface DSSReplenishTabProps {
  inventory: FactInventory[];
}

export const DSSReplenishTab: React.FC<DSSReplenishTabProps> = ({ inventory }) => {
  const initialRecommendations = generateReplenishmentRecommendations(inventory);
  const [recommendations, setRecommendations] = useState<ReplenishmentRecommendation[]>(
    initialRecommendations
  );
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");
  const [filterStore, setFilterStore] = useState<string>("ALL");
  const [poGenerated, setPoGenerated] = useState<boolean>(false);

  // Filter
  const filtered = recommendations.filter((r) => {
    if (filterUrgency !== "ALL" && r.urgency !== filterUrgency) return false;
    if (filterStore !== "ALL" && r.store_id !== filterStore) return false;
    return true;
  });

  const stores = Array.from(new Set(recommendations.map((r) => r.store_name)));

  // Financial summary
  const totalCost = filtered.reduce((sum, r) => sum + r.estimated_order_cost, 0);
  const totalUnits = filtered.reduce((sum, r) => sum + r.recommended_order_qty, 0);
  const criticalCount = filtered.filter((r) => r.urgency === "CRITICAL").length;
  const approvedCount = recommendations.filter((r) => r.status === "APPROVED").length;

  const handleApprove = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
  };

  const handleApproveAll = () => {
    setRecommendations((prev) => prev.map((r) => ({ ...r, status: "APPROVED" })));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-2">
            <Truck className="w-3.5 h-3.5" /> Decision Support Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ระบบสนับสนุนการตัดสินใจสั่งเติมสินค้าอัตโนมัติ (Automated Replenishment DSS)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            คำนวณจุดสั่งซื้อซ้ำ (ROP), Safety Stock, และ Lead Time เพื่อสร้างข้อเสนอแนะการสั่งเติมสินค้าที่มีประสิทธิภาพสูงสุด
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleApproveAll}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            อนุมัติคำสั่งซื้อทั้งหมด
          </button>
          <button
            onClick={() => setPoGenerated(!poGenerated)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {poGenerated ? "ซ่อนใบ PO Summary" : "ออกเอกสารสรุป PO"}
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">รายการที่ต้องสั่งเติม</span>
          <div className="text-2xl font-bold text-white mt-1">{filtered.length} รายการ</div>
          <div className="text-xs text-slate-400 mt-1">
            อนุมัติแล้ว <span className="text-emerald-400 font-bold">{approvedCount}</span> รายการ
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">จำนวนชิ้นที่แนะนำให้สั่งซื้อ</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">{totalUnits.toLocaleString()} ชิ้น</div>
          <div className="text-xs text-slate-400 mt-1">ปัดขึ้นตาม MOQ ของผู้ผลิต</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">งบประมาณสั่งซื้อโดยประมาณ</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ฿{totalCost.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">คำนวณจากราคาต้นทุนต่อหน่วย</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">รายการวิกฤต (Critical Urgency)</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{criticalCount} รายการ</div>
          <div className="text-xs text-rose-300 mt-1">สต็อกต่ำกว่า Safety Stock 50%</div>
        </div>
      </div>

      {/* Purchase Order Summary Modal / Card */}
      {poGenerated && (
        <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                เอกสารสรุปใบสั่งซื้อเพื่อการเติมสินค้า (Purchase Replenishment Order)
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              PO-DSS-{new Date().getFullYear()}1004
            </span>
          </div>

          <div className="text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400">ผู้อนุมัติ:</span> ผู้จัดการฝ่ายบริหารซัพพลายเชน
            </div>
            <div>
              <span className="text-slate-400">วันที่จัดทำ:</span> {new Date().toLocaleDateString("th-TH")}
            </div>
            <div>
              <span className="text-slate-400">งบประมาณรวม:</span>{" "}
              <strong className="text-emerald-400 text-sm">฿{totalCost.toLocaleString()}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            ระบบ DSS ได้สร้างคำสั่งซื้อที่จัดกลุ่มตามซัพพลายเออร์และสาขาปลายทาง พร้อมส่งต่อไปยังระบบ ERP / Procurement
          </p>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>ตัวกรองคำสั่งแนะนำ:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">ความเร่งด่วนทั้งหมด</option>
            <option value="CRITICAL">เฉพาะระดับวิกฤต (CRITICAL)</option>
            <option value="HIGH">เฉพาะระดับด่วน (HIGH)</option>
            <option value="NORMAL">ระดับปกติ (NORMAL)</option>
          </select>

          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">ทุกสาขา</option>
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendations Table */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <h2 className="text-base font-bold text-white mb-1">
          รายการสินค้าที่ระบบ DSS แนะนำให้สั่งเติมเข้าสาขา
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          กดปุ่ม &quot;อนุมัติคำสั่งซื้อ&quot; เพื่อยืนยันการเปิด PO หรือปรับปรุงสถานะการเติมสินค้า
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">สาขาปลายทาง</th>
                <th className="py-3 px-4">ชื่อสินค้า</th>
                <th className="py-3 px-4 text-center">คงเหลือ / ROP</th>
                <th className="py-3 px-4 text-center">Safety Stock</th>
                <th className="py-3 px-4 text-right">จำนวนที่แนะนำ</th>
                <th className="py-3 px-4 text-right">มูลค่า (฿)</th>
                <th className="py-3 px-4 text-center">ระดับความเร่งด่วน</th>
                <th className="py-3 px-4">เหตุผลและข้อเสนอแนะ</th>
                <th className="py-3 px-4 text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                    {item.store_name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{item.product_name}</span>
                    <div className="text-[11px] text-slate-400">{item.supplier_name}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-rose-400 font-bold">{item.current_stock}</span> /{" "}
                    <span className="text-amber-400">{item.reorder_point}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {item.safety_stock}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-400 text-sm">
                    {item.recommended_order_qty}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 font-medium">
                    ฿{item.estimated_order_cost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.urgency === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : item.urgency === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs">{item.reason}</td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs">
                        <CheckCircle2 className="w-4 h-4" /> อนุมัติแล้ว
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition whitespace-nowrap"
                      >
                        อนุมัติสั่งเติม
                      </button>
                    )}
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
