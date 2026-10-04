import { isSupabaseConfigured, supabase } from "./client";
import {
  initialDates,
  initialProducts,
  initialStores,
  generateFactSales,
  generateFactInventory,
  generateRawTransactions,
} from "../mock-data";
import { DimDate, DimProduct, DimStore, FactInventory, FactSale, RawTransaction } from "../types";

export interface DataWarehouseState {
  stores: DimStore[];
  products: DimProduct[];
  dates: DimDate[];
  sales: FactSale[];
  inventory: FactInventory[];
  rawTransactions: RawTransaction[];
  source: "SUPABASE" | "MOCK";
  lastSyncAt: string;
}

export async function fetchFullDataWarehouse(): Promise<DataWarehouseState> {
  const fallbackData: DataWarehouseState = {
    stores: initialStores,
    products: initialProducts,
    dates: initialDates,
    sales: generateFactSales(),
    inventory: generateFactInventory(),
    rawTransactions: generateRawTransactions(),
    source: "MOCK",
    lastSyncAt: new Date().toLocaleTimeString("th-TH"),
  };

  if (!isSupabaseConfigured()) {
    return fallbackData;
  }

  try {
    // Attempt to query Supabase tables
    const [storesRes, productsRes, salesRes, invRes] = await Promise.all([
      supabase.from("dim_store").select("*").limit(50),
      supabase.from("dim_product").select("*").limit(100),
      supabase.from("fact_sales").select("*").limit(500),
      supabase.from("fact_inventory").select("*").limit(100),
    ]);

    // If tables don't exist or return error, fallback safely
    if (storesRes.error || productsRes.error || !storesRes.data || storesRes.data.length === 0) {
      console.warn("Supabase tables not found or empty. Using in-memory dataset.");
      return fallbackData;
    }

    const stores: DimStore[] = storesRes.data;
    const products: DimProduct[] = productsRes.data;

    // Build lookup maps for joins
    const storeMap = new Map<string, DimStore>(stores.map((s) => [s.store_id, s]));
    const productMap = new Map<string, DimProduct>(products.map((p) => [p.product_id, p]));
    const dateMap = new Map<number, DimDate>(initialDates.map((d) => [d.date_id, d]));

    const sales: FactSale[] = (salesRes.data || []).map((s: any) => ({
      ...s,
      store: storeMap.get(s.store_id),
      product: productMap.get(s.product_id),
      date: dateMap.get(s.date_id),
    }));

    const inventory: FactInventory[] = (invRes.data || []).map((inv: any) => ({
      ...inv,
      store: storeMap.get(inv.store_id),
      product: productMap.get(inv.product_id),
    }));

    return {
      stores,
      products,
      dates: initialDates,
      sales: sales.length > 0 ? sales : fallbackData.sales,
      inventory: inventory.length > 0 ? inventory : fallbackData.inventory,
      rawTransactions: fallbackData.rawTransactions,
      source: "SUPABASE",
      lastSyncAt: new Date().toLocaleTimeString("th-TH"),
    };
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return fallbackData;
  }
}

/**
 * Direct Seeding tool to push sample data to Supabase if tables are created
 */
export async function seedSupabaseTables(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "กรุณาตรวจสอบการตั้งค่า Supabase URL และ Key ใน .env.local" };
  }

  try {
    // 1. Insert Stores
    const { error: storeErr } = await supabase.from("dim_store").upsert(initialStores, { onConflict: "store_id" });
    if (storeErr) throw new Error(`ไม่สามารถเพิ่มข้อมูล dim_store: ${storeErr.message}`);

    // 2. Insert Products
    const { error: prodErr } = await supabase.from("dim_product").upsert(initialProducts, { onConflict: "product_id" });
    if (prodErr) throw new Error(`ไม่สามารถเพิ่มข้อมูล dim_product: ${prodErr.message}`);

    // 3. Insert Dates
    const { error: dateErr } = await supabase.from("dim_date").upsert(initialDates, { onConflict: "date_id" });
    if (dateErr) throw new Error(`ไม่สามารถเพิ่มข้อมูล dim_date: ${dateErr.message}`);

    // 4. Insert Inventory
    const cleanInv = generateFactInventory().map((inv) => ({
      store_id: inv.store_id,
      product_id: inv.product_id,
      current_stock: inv.current_stock,
      safety_stock: inv.safety_stock,
      reorder_point: inv.reorder_point,
      max_capacity: inv.max_capacity,
      in_transit_qty: inv.in_transit_qty,
      stock_status: inv.stock_status,
      daily_demand_avg: inv.daily_demand_avg,
      lead_time_days: inv.lead_time_days,
    }));
    await supabase.from("fact_inventory").upsert(cleanInv);

    return { success: true, message: "อัปโหลดข้อมูลเข้าสู่ Supabase สำเร็จเรียบร้อย!" };
  } catch (err: any) {
    return { success: false, message: err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล" };
  }
}
