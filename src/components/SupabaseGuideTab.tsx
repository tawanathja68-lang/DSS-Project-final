"use client";

import React, { useState } from "react";
import {
  CodeXml,
  Copy,
  Check,
  ExternalLink,
  Database,
  CloudUpload,
  ShieldCheck,
  Rocket,
} from "lucide-react";

export const SupabaseGuideTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlSample = `-- 1. Dimension Tables
CREATE TABLE IF NOT EXISTS dim_store (
    store_id VARCHAR(20) PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    store_type VARCHAR(50) NOT NULL,
    manager_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dim_product (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    lead_time_days INT NOT NULL DEFAULT 3,
    min_order_qty INT NOT NULL DEFAULT 10,
    holding_cost_rate NUMERIC(5, 4) DEFAULT 0.15
);

CREATE TABLE IF NOT EXISTS dim_date (
    date_id INT PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    day INT NOT NULL,
    month INT NOT NULL,
    month_name VARCHAR(30) NOT NULL,
    quarter INT NOT NULL,
    year INT NOT NULL,
    day_of_week INT NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Fact Tables (Star Schema)
CREATE TABLE IF NOT EXISTS fact_sales (
    sales_id BIGSERIAL PRIMARY KEY,
    date_id INT REFERENCES dim_date(date_id),
    store_id VARCHAR(20) REFERENCES dim_store(store_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    quantity_sold INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    total_sales NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL,
    gross_profit NUMERIC(12, 2) NOT NULL,
    profit_margin_pct NUMERIC(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS fact_inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES dim_store(store_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    current_stock INT NOT NULL,
    safety_stock INT NOT NULL,
    reorder_point INT NOT NULL,
    max_capacity INT NOT NULL,
    in_transit_qty INT DEFAULT 0,
    stock_status VARCHAR(20) NOT NULL,
    daily_demand_avg INT NOT NULL,
    lead_time_days INT NOT NULL
);

-- 3. Enable RLS & Public Access
ALTER TABLE dim_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_date ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON dim_store FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON dim_product FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON dim_date FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON fact_sales FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON fact_inventory FOR SELECT USING (true);
CREATE POLICY "Public Upsert All" ON fact_inventory FOR ALL USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-2">
          <Database className="w-3.5 h-3.5" /> Database &amp; Deployment Guide
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          การติดตั้งฐานข้อมูล Supabase และการนำขึ้นใช้งานจริงบน Vercel
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          คู่มือการรันสคริปต์ SQL Star Schema บน Supabase Cloud และการตั้งค่า Environment Variables สำหรับ Vercel
        </p>
      </div>

      {/* 4 Steps Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">
            1
          </div>
          <h2 className="text-sm font-bold text-white mb-1">เปิด Supabase SQL Editor</h2>
          <p className="text-xs text-slate-400">
            เข้าสู่โปรเจกต์ของคุณบน supabase.com ไปที่แท็บ SQL Editor ทางด้านซ้าย
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-3">
            2
          </div>
          <h2 className="text-sm font-bold text-white mb-1">รันสคริปต์ SQL</h2>
          <p className="text-xs text-slate-400">
            คัดลอกโค้ด SQL ด้านล่าง (หรือจากไฟล์ <code className="text-blue-300">supabase_schema.sql</code>) วางแล้วกด Run
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-3">
            3
          </div>
          <h2 className="text-sm font-bold text-white mb-1">กด Seed ข้อมูล</h2>
          <p className="text-xs text-slate-400">
            กลับมาที่แท็บ ETL Console ในแดชบอร์ดนี้ แล้วกด &quot;อัปโหลดข้อมูลเข้า Supabase จริง&quot;
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">
            4
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Deploy บน Vercel</h2>
          <p className="text-xs text-slate-400">
            นำโปรเจกต์เข้า Vercel และเพิ่ม Environment Variables (SUPABASE_URL และ ANON_KEY)
          </p>
        </div>
      </div>

      {/* SQL Script Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <CodeXml className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                คำสั่ง SQL สร้างตารางคลังข้อมูล Star Schema
              </h2>
              <p className="text-xs text-slate-400">ไฟล์ต้นฉบับฉบับเต็มอยู่ในโปรเจกต์ที่: supabase_schema.sql</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> คัดลอกแล้ว!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" /> คัดลอกคำสั่ง SQL
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-96 leading-relaxed">
          {sqlSample}
        </pre>
      </div>

      {/* Vercel Environment Variables Guide */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            การตั้งค่า Vercel Environment Variables
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          เมื่อ Import Repository เข้าสู่ Vercel ให้กำหนดค่า Environment Variables ดังนี้:
        </p>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300 flex justify-between items-center">
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
            <span className="text-blue-400">https://wobakuwsrbmgajfaozjz.supabase.co</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300 flex justify-between items-center">
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <span className="text-indigo-400 truncate max-w-xs">eyJhbGciOiJIUzI1NiIsInR5cCI6...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
