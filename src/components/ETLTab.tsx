"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Database,
  ArrowRight,
  CheckCircle,
  Clock,
  Terminal,
  Layers,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { RawTransaction } from "@/lib/types";
import { seedSupabaseTables } from "@/lib/supabase/db-service";

interface ETLTabProps {
  rawTransactions: RawTransaction[];
  onETLComplete: () => void;
  dataSource: "SUPABASE" | "MOCK";
}

export const ETLTab: React.FC<ETLTabProps> = ({
  rawTransactions,
  onETLComplete,
  dataSource,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Idle, 1: Extract, 2: Transform, 3: Load, 4: Done
  const [logs, setLogs] = useState<string[]>([
    "🚀 ETL System Ready: พร้อมประมวลผลตามรอบบัญชีประจำวัน",
    "📌 Data Sources Connected: POS Staging DB, Master Catalog, Branch DB",
  ]);
  const [isSeedingSupabase, setIsSeedingSupabase] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const runETLPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] 🔍 STAGE 1: EXTRACTING...`,
      `[${new Date().toLocaleTimeString()}] -> ดึงข้อมูลดิบจาก POS Staging: ${rawTransactions.length} รายการ`,
    ]);

    await new Promise((r) => setTimeout(r, 900));
    setCurrentStep(2);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ⚙️ STAGE 2: TRANSFORMING...`,
      `[${new Date().toLocaleTimeString()}] -> Data Cleansing: ล้างข้อมูลธุรกรรมที่ซ้ำซ้อนและตรวจสอบรูปแบบวันที่`,
      `[${new Date().toLocaleTimeString()}] -> Business Calculation: คำนวณ Gross Profit, Margin %, Surrogate Keys`,
      `[${new Date().toLocaleTimeString()}] -> Dimension Mapping: เชื่อมโยง Date Key, Store ID, Product SKU`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setCurrentStep(3);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] 📥 STAGE 3: LOADING INTO DATA WAREHOUSE...`,
      `[${new Date().toLocaleTimeString()}] -> โหลดเข้า Fact Sales และ Fact Inventory (Star Schema)`,
      `[${new Date().toLocaleTimeString()}] -> ทำการ Refresh Materialized Aggregations สำหรับ OLAP`,
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setCurrentStep(4);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ✅ SUCCESS: วงจร ETL สำเร็จสมบูรณ์ 100%! Data Warehouse อัปเดตพร้อมใช้งานสำหรับ OLAP และ Data Mining`,
    ]);
    setIsRunning(false);
    onETLComplete();
  };

  const handleSeedSupabase = async () => {
    setIsSeedingSupabase(true);
    setSeedMessage(null);
    try {
      const res = await seedSupabaseTables();
      setSeedMessage(res.message);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ☁️ Supabase Cloud Sync: ${res.message}`,
      ]);
    } catch (err: any) {
      setSeedMessage(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ Supabase");
    } finally {
      setIsSeedingSupabase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 mb-2">
            <RefreshCw className="w-3.5 h-3.5" /> Data Pipeline Management
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ระบบประมวลผลข้อมูลวงจร ETL (Extract - Transform - Load)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            แปลงข้อมูลดิบจากระบบจุดขาย (POS Transactions) เข้าสู่คลังข้อมูล Data Warehouse แบบ Star Schema
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={runETLPipeline}
            disabled={isRunning}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "กำลังรัน ETL Pipeline..." : "รันวงจร ETL เดี๋ยวนี้"}
          </button>

          <button
            onClick={handleSeedSupabase}
            disabled={isSeedingSupabase}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {isSeedingSupabase ? "กำลังส่งข้อมูลเข้า Supabase..." : "อัปโหลดข้อมูลเข้า Supabase จริง"}
          </button>
        </div>
      </div>

      {seedMessage && (
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Visual ETL Steps Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Extract */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            currentStep === 1
              ? "bg-blue-900/40 border-blue-500 shadow-lg shadow-blue-500/20"
              : currentStep > 1
              ? "bg-slate-800/80 border-emerald-500/40"
              : "bg-slate-800/80 border-slate-700/60"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Step 1: Extract
            </span>
            {currentStep > 1 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : currentStep === 1 ? (
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <h3 className="text-base font-bold text-white mb-1">ดึงข้อมูลดิบจากระบบต้นทาง</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            สกัดข้อมูลธุรกรรมการซื้อขายจาก POS เครื่องคิดเงินสาขา, ข้อมูลสต็อก และข้อมูลสินค้า
          </p>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
            <div>แหล่งข้อมูล: <span className="text-white font-mono">raw_pos_transactions</span></div>
            <div>จำนวนระเบียน: <span className="text-blue-400 font-mono font-bold">{rawTransactions.length} แถว</span></div>
          </div>
        </div>

        {/* Step 2: Transform */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            currentStep === 2
              ? "bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-500/20"
              : currentStep > 2
              ? "bg-slate-800/80 border-emerald-500/40"
              : "bg-slate-800/80 border-slate-700/60"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Step 2: Transform
            </span>
            {currentStep > 2 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : currentStep === 2 ? (
              <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <h3 className="text-base font-bold text-white mb-1">ทำความสะอาดและแปรรูปข้อมูล</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Cleanse Missing Values, แปลงวันที่เป็น Date Dimension Key, คำนวณกำไรขั้นต้น และ Margin %
          </p>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
            <div>สูตรคำนวณ: <span className="text-white font-mono">Profit = Sales - (Qty * Cost)</span></div>
            <div>Key Mapping: <span className="text-indigo-400 font-mono font-bold">Surrogate Keys Gen</span></div>
          </div>
        </div>

        {/* Step 3: Load */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            currentStep === 3
              ? "bg-emerald-900/40 border-emerald-500 shadow-lg shadow-emerald-500/20"
              : currentStep > 3
              ? "bg-slate-800/80 border-emerald-500/40"
              : "bg-slate-800/80 border-slate-700/60"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Step 3: Load
            </span>
            {currentStep > 3 ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : currentStep === 3 ? (
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <h3 className="text-base font-bold text-white mb-1">โหลดเข้าสู่คลังข้อมูล (DWH)</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            บันทึกข้อมูลเข้าตาราง Fact Sales และ Fact Inventory พร้อมโครงสร้าง Star Schema
          </p>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50">
            <div>เป้าหมาย: <span className="text-white font-mono">fact_sales, fact_inventory</span></div>
            <div>สถานะ: <span className="text-emerald-400 font-mono font-bold">Star Schema Ready</span></div>
          </div>
        </div>
      </div>

      {/* Execution Terminal Console */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-inner font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>ETL Execution Live Log Terminal</span>
          </div>
          <span className="text-[11px] text-slate-500">Pipeline ID: ETL-RUN-202610</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs text-emerald-400/90 leading-relaxed">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-slate-600 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Staging Data Sample Table */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">ตัวอย่างข้อมูลในระบบ Staging (POS Raw Transactions)</h2>
            <p className="text-xs text-slate-400">ข้อมูลก่อนการแปลงรูป (Raw Data) ที่นำเข้าจากจุดขาย</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 font-medium">
            Staging Table
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date Time</th>
                <th className="py-3 px-4">Store ID</th>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">ETL Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {rawTransactions.slice(0, 7).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/30">
                  <td className="py-2.5 px-4 font-mono font-medium text-white">{tx.receipt_no}</td>
                  <td className="py-2.5 px-4">{tx.raw_date}</td>
                  <td className="py-2.5 px-4 font-mono text-blue-400">{tx.store_id}</td>
                  <td className="py-2.5 px-4 font-mono text-indigo-400">{tx.product_id}</td>
                  <td className="py-2.5 px-4">{tx.quantity}</td>
                  <td className="py-2.5 px-4">฿{tx.unit_price}</td>
                  <td className="py-2.5 px-4">{tx.payment_method}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LOADED
                    </span>
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
