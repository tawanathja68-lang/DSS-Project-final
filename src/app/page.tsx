"use client";

import React, { useEffect, useState } from "react";
import { Navbar, TabKey } from "@/components/Navbar";
import { OverviewTab } from "@/components/OverviewTab";
import { ETLTab } from "@/components/ETLTab";
import { StarSchemaTab } from "@/components/StarSchemaTab";
import { OLAPTab } from "@/components/OLAPTab";
import { DataMiningTab } from "@/components/DataMiningTab";
import { DSSReplenishTab } from "@/components/DSSReplenishTab";
import { WhatIfTab } from "@/components/WhatIfTab";
import { SupabaseGuideTab } from "@/components/SupabaseGuideTab";
import {
  DataWarehouseState,
  fetchFullDataWarehouse,
} from "@/lib/supabase/db-service";
import { initialDates, initialProducts, initialStores, generateFactSales, generateFactInventory, generateRawTransactions } from "@/lib/mock-data";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [dataState, setDataState] = useState<DataWarehouseState>({
    stores: initialStores,
    products: initialProducts,
    dates: initialDates,
    sales: generateFactSales(),
    inventory: generateFactInventory(),
    rawTransactions: generateRawTransactions(),
    source: "MOCK",
    lastSyncAt: new Date().toLocaleTimeString("th-TH"),
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchFullDataWarehouse();
      setDataState(data);
    } catch (err) {
      console.error("Failed to fetch warehouse data:", err);
    } finally {
      setIsSyncing(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSource={dataState.source}
        lastSyncAt={dataState.lastSyncAt}
        isSyncing={isSyncing}
        onRefresh={loadData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-slate-400">กำลังเชื่อมต่อคลังข้อมูล Star Schema และระบบ DSS...</p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewTab
                sales={dataState.sales}
                inventory={dataState.inventory}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === "etl" && (
              <ETLTab
                rawTransactions={dataState.rawTransactions}
                onETLComplete={loadData}
                dataSource={dataState.source}
              />
            )}

            {activeTab === "starschema" && (
              <StarSchemaTab
                stores={dataState.stores}
                products={dataState.products}
                dates={dataState.dates}
                sales={dataState.sales}
                inventory={dataState.inventory}
              />
            )}

            {activeTab === "olap" && (
              <OLAPTab
                sales={dataState.sales}
                stores={dataState.stores}
                products={dataState.products}
              />
            )}

            {activeTab === "mining" && (
              <DataMiningTab
                sales={dataState.sales}
                products={dataState.products}
                rawTransactions={dataState.rawTransactions}
              />
            )}

            {activeTab === "dss" && (
              <DSSReplenishTab inventory={dataState.inventory} />
            )}

            {activeTab === "whatif" && (
              <WhatIfTab inventory={dataState.inventory} />
            )}

            {activeTab === "supabase" && <SupabaseGuideTab />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>RetailDSS</strong> - ระบบสนับสนุนการตัดสินใจเพื่อวิเคราะห์ยอดขายและวางแผนการเติมสินค้าร้านค้า
          </div>
          <div>
            วงจรข้อมูลครบวงจร: ETL → Data Warehouse (Star Schema) → OLAP → Data Mining → DSS
          </div>
        </div>
      </footer>
    </div>
  );
}
