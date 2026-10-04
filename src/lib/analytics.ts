import {
  ABCProductItem,
  DemandForecastPoint,
  FactInventory,
  FactSale,
  MarketBasketRule,
  RawTransaction,
  ReplenishmentRecommendation,
  WhatIfScenarioInput,
  WhatIfSimulationResult,
} from "./types";

/**
 * OLAP Multi-dimensional Filter & Aggregate
 */
export function filterAndAggregateSales(
  sales: FactSale[],
  filters: {
    startDate?: string;
    endDate?: string;
    storeId?: string;
    region?: string;
    category?: string;
  }
) {
  let filtered = [...sales];

  if (filters.startDate) {
    filtered = filtered.filter((s) => s.date && s.date.full_date >= filters.startDate!);
  }
  if (filters.endDate) {
    filtered = filtered.filter((s) => s.date && s.date.full_date <= filters.endDate!);
  }
  if (filters.storeId && filters.storeId !== "ALL") {
    filtered = filtered.filter((s) => s.store_id === filters.storeId);
  }
  if (filters.region && filters.region !== "ALL") {
    filtered = filtered.filter((s) => s.store?.region === filters.region);
  }
  if (filters.category && filters.category !== "ALL") {
    filtered = filtered.filter((s) => s.product?.category === filters.category);
  }

  // Calculate Aggregated KPIs
  const totalSales = filtered.reduce((sum, s) => sum + s.total_sales, 0);
  const totalCost = filtered.reduce((sum, s) => sum + s.total_cost, 0);
  const totalUnits = filtered.reduce((sum, s) => sum + s.quantity_sold, 0);
  const grossProfit = totalSales - totalCost;
  const marginPct = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  return {
    filteredSales: filtered,
    totalSales,
    totalCost,
    totalUnits,
    grossProfit,
    marginPct,
    transactionCount: filtered.length,
  };
}

/**
 * OLAP Drill-down / Roll-up: Group by Date, Store, or Category
 */
export function aggregateByDimension(sales: FactSale[], dimension: "date" | "store" | "category") {
  const groups: Record<
    string,
    { label: string; sales: number; profit: number; units: number }
  > = {};

  sales.forEach((s) => {
    let key = "";
    let label = "";

    if (dimension === "date" && s.date) {
      key = s.date.full_date;
      label = `${s.date.day} ${s.date.month_name.slice(0, 3)}`;
    } else if (dimension === "store" && s.store) {
      key = s.store.store_id;
      label = s.store.store_name.replace("สาขา", "");
    } else if (dimension === "category" && s.product) {
      key = s.product.category;
      label = s.product.category;
    }

    if (!groups[key]) {
      groups[key] = { label, sales: 0, profit: 0, units: 0 };
    }
    groups[key].sales += s.total_sales;
    groups[key].profit += s.gross_profit;
    groups[key].units += s.quantity_sold;
  });

  return Object.entries(groups).map(([id, val]) => ({
    id,
    label: val.label,
    sales: Math.round(val.sales),
    profit: Math.round(val.profit),
    units: val.units,
    margin: val.sales > 0 ? Math.round((val.profit / val.sales) * 1000) / 10 : 0,
  }));
}

/**
 * OLAP Pivot Matrix: Store (Rows) x Category (Columns)
 */
export function generatePivotMatrix(sales: FactSale[]) {
  const storeMap = new Map<string, string>();
  const categorySet = new Set<string>();
  const matrix: Record<string, Record<string, number>> = {};

  sales.forEach((s) => {
    if (s.store && s.product) {
      storeMap.set(s.store.store_id, s.store.store_name);
      categorySet.add(s.product.category);

      if (!matrix[s.store.store_id]) {
        matrix[s.store.store_id] = {};
      }
      matrix[s.store.store_id][s.product.category] =
        (matrix[s.store.store_id][s.product.category] || 0) + s.total_sales;
    }
  });

  const categories = Array.from(categorySet);
  const rows = Array.from(storeMap.entries()).map(([storeId, storeName]) => {
    const rowData: Record<string, any> = { storeId, storeName, total: 0 };
    categories.forEach((cat) => {
      const val = matrix[storeId]?.[cat] || 0;
      rowData[cat] = Math.round(val);
      rowData.total += val;
    });
    rowData.total = Math.round(rowData.total);
    return rowData;
  });

  return { categories, rows };
}

/**
 * DATA MINING 1: Market Basket Analysis (Association Rules / Apriori)
 */
export function computeMarketBasketAnalysis(transactions: RawTransaction[]): MarketBasketRule[] {
  // Group by receipt
  const baskets = new Map<string, Set<string>>();
  const productNames = new Map<string, string>();

  transactions.forEach((tx) => {
    if (!baskets.has(tx.receipt_no)) {
      baskets.set(tx.receipt_no, new Set());
    }
    baskets.get(tx.receipt_no)!.add(tx.product_id);
    if (!productNames.has(tx.product_id)) {
      productNames.set(tx.product_id, tx.product_id);
    }
  });

  const totalBaskets = baskets.size;
  if (totalBaskets === 0) return [];

  // Count item frequency
  const itemCounts: Record<string, number> = {};
  const pairCounts: Record<string, number> = {};

  baskets.forEach((items) => {
    const itemList = Array.from(items);
    itemList.forEach((item) => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    for (let i = 0; i < itemList.length; i++) {
      for (let j = i + 1; j < itemList.length; j++) {
        const pairKey = [itemList[i], itemList[j]].sort().join("&");
        pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
      }
    }
  });

  const rules: MarketBasketRule[] = [];

  Object.entries(pairCounts).forEach(([pairKey, pairFreq]) => {
    const [itemA, itemB] = pairKey.split("&");
    const countA = itemCounts[itemA] || 0;
    const countB = itemCounts[itemB] || 0;

    const supportAB = pairFreq / totalBaskets;
    const confAtoB = countA > 0 ? pairFreq / countA : 0;
    const confBtoA = countB > 0 ? pairFreq / countB : 0;
    const lift = (pairFreq * totalBaskets) / (countA * countB);

    if (supportAB >= 0.05 && lift > 1.1) {
      rules.push({
        antecedent: itemA,
        consequent: itemB,
        support: Math.round(supportAB * 1000) / 10,
        confidence: Math.round(confAtoB * 1000) / 10,
        lift: Math.round(lift * 100) / 100,
        recommendation: `จัดแคมเปญ Combo Pack หรือวางเชลฟ์สินค้าใกล้กัน (Lift: ${lift.toFixed(2)})`,
      });

      rules.push({
        antecedent: itemB,
        consequent: itemA,
        support: Math.round(supportAB * 1000) / 10,
        confidence: Math.round(confBtoA * 1000) / 10,
        lift: Math.round(lift * 100) / 100,
        recommendation: `แนะนำระบบ Cross-sell ในใบเสร็จหรือตะกร้าช็อปปิ้ง`,
      });
    }
  });

  return rules.sort((a, b) => b.lift - a.lift).slice(0, 8);
}

/**
 * DATA MINING 2: ABC Analysis (Pareto Classification 80/20)
 */
export function computeABCAnalysis(sales: FactSale[]): ABCProductItem[] {
  const productRevenueMap: Record<
    string,
    { name: string; category: string; revenue: number; quantity: number }
  > = {};

  sales.forEach((s) => {
    if (s.product) {
      if (!productRevenueMap[s.product_id]) {
        productRevenueMap[s.product_id] = {
          name: s.product.product_name,
          category: s.product.category,
          revenue: 0,
          quantity: 0,
        };
      }
      productRevenueMap[s.product_id].revenue += s.total_sales;
      productRevenueMap[s.product_id].quantity += s.quantity_sold;
    }
  });

  const items = Object.entries(productRevenueMap).map(([id, info]) => ({
    product_id: id,
    product_name: info.name,
    category: info.category,
    total_revenue: Math.round(info.revenue),
    total_quantity: info.quantity,
    cumulative_revenue_pct: 0,
    classification: "C" as "A" | "B" | "C",
    strategy: "",
  }));

  // Sort descending by revenue
  items.sort((a, b) => b.total_revenue - a.total_revenue);

  const grandTotalRevenue = items.reduce((sum, item) => sum + item.total_revenue, 0);

  let cumulativeRevenue = 0;
  items.forEach((item) => {
    cumulativeRevenue += item.total_revenue;
    const pct = grandTotalRevenue > 0 ? (cumulativeRevenue / grandTotalRevenue) * 100 : 0;
    item.cumulative_revenue_pct = Math.round(pct * 10) / 10;

    if (item.cumulative_revenue_pct <= 70) {
      item.classification = "A";
      item.strategy = "สินค้าหัวหอกกำไรสูง: ควบคุมสต็อกเข้มงวด ติดตามยอดขายแบบเรียลไทม์ ห้ามของขาด";
    } else if (item.cumulative_revenue_pct <= 90) {
      item.classification = "B";
      item.strategy = "สินค้าสร้างรายได้ปานกลาง: ตรวจสอบสต็อกสัปดาห์ละครั้ง สั่งเติมตามรอบปกติ (EOQ)";
    } else {
      item.classification = "C";
      item.strategy = "สินค้าขายช้า: สั่งซื้อปริมาณน้อย เน้นลดพื้นที่เก็บและลด Working Capital";
    }
  });

  return items;
}

/**
 * DATA MINING 3: Sales Demand Forecasting (Exponential Smoothing with Trend)
 */
export function computeSalesForecast(sales: FactSale[], forecastDays: number = 7): DemandForecastPoint[] {
  // Aggregate daily total sales
  const dailyMap: Record<string, number> = {};
  sales.forEach((s) => {
    if (s.date) {
      dailyMap[s.date.full_date] = (dailyMap[s.date.full_date] || 0) + s.total_sales;
    }
  });

  const sortedDates = Object.keys(dailyMap).sort();
  const historicalValues = sortedDates.map((d) => dailyMap[d]);

  const result: DemandForecastPoint[] = [];

  // Add historical points
  sortedDates.forEach((d) => {
    result.push({
      date: d,
      historicalSales: Math.round(dailyMap[d]),
      forecastedSales: Math.round(dailyMap[d]),
      confidenceLower: Math.round(dailyMap[d] * 0.9),
      confidenceUpper: Math.round(dailyMap[d] * 1.1),
    });
  });

  if (historicalValues.length === 0) return result;

  // Simple Holt's Linear Trend / Moving Average
  const n = historicalValues.length;
  const recentDays = historicalValues.slice(-7);
  const avgRecent = recentDays.reduce((a, b) => a + b, 0) / recentDays.length;
  
  // Calculate trend slope
  const slope = (historicalValues[n - 1] - historicalValues[Math.max(0, n - 8)]) / 7;

  const lastDate = new Date(sortedDates[sortedDates.length - 1]);

  for (let i = 1; i <= forecastDays; i++) {
    const fDate = new Date(lastDate);
    fDate.setDate(lastDate.getDate() + i);
    const dateStr = fDate.toISOString().split("T")[0];

    // Day of week seasonality adjustment
    const dayOfWeek = fDate.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.25 : 1.0;

    const basePredicted = (avgRecent + slope * i) * weekendMultiplier;
    const forecastedSales = Math.max(1000, Math.round(basePredicted));
    const errorMargin = Math.round(forecastedSales * 0.12 * Math.sqrt(i));

    result.push({
      date: dateStr,
      forecastedSales,
      confidenceLower: Math.max(0, forecastedSales - errorMargin),
      confidenceUpper: forecastedSales + errorMargin,
    });
  }

  return result;
}

/**
 * DSS ENGINE: Replenishment Recommendations
 */
export function generateReplenishmentRecommendations(
  inventoryList: FactInventory[]
): ReplenishmentRecommendation[] {
  const recommendations: ReplenishmentRecommendation[] = [];

  inventoryList.forEach((inv) => {
    const current = inv.current_stock;
    const rop = inv.reorder_point;
    const safety = inv.safety_stock;
    const leadTime = inv.lead_time_days || 3;
    const product = inv.product;
    const store = inv.store;

    if (!product || !store) return;

    // Trigger replenishment condition: current stock <= ROP
    if (current <= rop) {
      let urgency: "CRITICAL" | "HIGH" | "NORMAL" = "NORMAL";
      let reason = "";

      if (current <= safety * 0.5) {
        urgency = "CRITICAL";
        reason = `สต็อกอยู่ในภาวะวิกฤต (เหลือ ${current} ชิ้น < 50% ของ Safety Stock) เสี่ยงสูญเสียยอดขายทันที!`;
      } else if (current <= safety) {
        urgency = "HIGH";
        reason = `ระดับสต็อกต่ำกว่า Safety Stock (${safety} ชิ้น) ต้องสั่งด่วนเพื่อป้องกัน Stockout ระหว่างขนส่ง`;
      } else {
        urgency = "NORMAL";
        reason = `ระดับสต็อกแตะจุดสั่งซื้อซ้ำ (ROP: ${rop} ชิ้น) ควรเปิดใบสั่งซื้อตามรอบ`;
      }

      // Order quantity formula: Target Capacity - Current Stock - InTransit, rounded to MOQ
      const deficit = inv.max_capacity - current - inv.in_transit_qty;
      const moq = product.min_order_qty || 10;
      const recommendedOrderQty = Math.max(moq, Math.ceil(deficit / moq) * moq);

      recommendations.push({
        id: `REC-${inv.inventory_id}`,
        store_id: inv.store_id,
        store_name: store.store_name,
        product_id: inv.product_id,
        product_name: product.product_name,
        category: product.category,
        current_stock: current,
        reorder_point: rop,
        safety_stock: safety,
        recommended_order_qty: recommendedOrderQty,
        lead_time_days: leadTime,
        urgency,
        unit_cost: product.unit_cost,
        estimated_order_cost: Math.round(recommendedOrderQty * product.unit_cost),
        supplier_name: product.supplier_name,
        reason,
        status: "PENDING",
      });
    }
  });

  // Sort by urgency: CRITICAL first, then HIGH, then NORMAL
  const priorityMap = { CRITICAL: 1, HIGH: 2, NORMAL: 3 };
  return recommendations.sort((a, b) => priorityMap[a.urgency] - priorityMap[b.urgency]);
}

/**
 * DSS ENGINE: What-If Scenario Simulation
 */
export function simulateWhatIfScenario(
  inventoryList: FactInventory[],
  input: WhatIfScenarioInput
): WhatIfSimulationResult {
  // Service level Z-score mapping
  let zScore = 1.65; // 95% default
  if (input.serviceLevelPct >= 99) zScore = 2.33;
  else if (input.serviceLevelPct >= 98) zScore = 2.05;
  else if (input.serviceLevelPct >= 95) zScore = 1.65;
  else if (input.serviceLevelPct >= 90) zScore = 1.28;
  else if (input.serviceLevelPct >= 85) zScore = 1.04;
  else zScore = 0.84;

  const demandMultiplier = 1 + input.demandSurgePct / 100;
  const leadTimeDelta = input.leadTimeDelayDays;

  let totalNewSafetyStock = 0;
  let totalNewROP = 0;
  let totalOrderUnits = 0;
  let totalWorkingCapital = 0;
  let totalCarryingCost = 0;
  let stockoutItemsCount = 0;

  inventoryList.forEach((inv) => {
    const product = inv.product;
    if (!product) return;

    const baseDailyDemand = inv.daily_demand_avg * demandMultiplier;
    const stdDevDemand = baseDailyDemand * 0.25;
    const effectiveLeadTime = Math.max(1, inv.lead_time_days + leadTimeDelta);

    // New Safety Stock: SS = Z * sigma * sqrt(L)
    const newSafetyStock = Math.ceil(zScore * stdDevDemand * Math.sqrt(effectiveLeadTime));
    // New ROP: ROP = (d * L) + SS
    const newROP = Math.ceil(baseDailyDemand * effectiveLeadTime + newSafetyStock);

    totalNewSafetyStock += newSafetyStock;
    totalNewROP += newROP;

    // Check if current stock would be below new ROP
    if (inv.current_stock < newROP) {
      const orderQty = Math.max(product.min_order_qty, newROP - inv.current_stock);
      totalOrderUnits += orderQty;
      totalWorkingCapital += orderQty * product.unit_cost;
    }

    if (inv.current_stock < newSafetyStock) {
      stockoutItemsCount++;
    }

    // Carrying cost per year
    const carryingRate = (input.holdingCostRatePct || 15) / 100;
    totalCarryingCost += newSafetyStock * product.unit_cost * carryingRate;
  });

  const count = Math.max(1, inventoryList.length);
  const stockoutRiskPct = Math.round((stockoutItemsCount / count) * 1000) / 10;

  let impactSummary = "";
  if (input.demandSurgePct > 20 && input.leadTimeDelayDays > 2) {
    impactSummary = "⚠️ ภาวะวิกฤต: ดีมานด์พุ่งสูงและขนส่งล่าช้า ทำให้ต้องเพิ่มเงินทุนสำรองสต็อกอย่างมีนัยสำคัญเพื่อหลีกเลี่ยงสินค้าขาดสต็อก";
  } else if (input.demandSurgePct > 0) {
    impactSummary = `📈 ดีมานด์เพิ่มขึ้น ${input.demandSurgePct}% ต้องเร่งสั่งซื้อล่วงหน้าเพื่อรองรับยอดขายที่เพิ่มขึ้น`;
  } else if (input.leadTimeDelayDays > 0) {
    impactSummary = `⏳ ขนส่งล่าช้าเพิ่มขึ้น ${input.leadTimeDelayDays} วัน จำเป็นต้องเพิ่ม Safety Stock เพื่อป้องกันความเสี่ยง`;
  } else {
    impactSummary = "✅ สถานะการบริหารสต็อกอยู่ในเกณฑ์สมดุลตามมาตรฐานปกติ";
  }

  return {
    scenarioName: `Demand ${input.demandSurgePct >= 0 ? "+" : ""}${input.demandSurgePct}% | Lead Time +${input.leadTimeDelayDays}d | Service ${input.serviceLevelPct}%`,
    newSafetyStockAvg: Math.round(totalNewSafetyStock / count),
    newReorderPointAvg: Math.round(totalNewROP / count),
    totalOrderUnits,
    totalWorkingCapitalNeeded: Math.round(totalWorkingCapital),
    stockoutRiskPct,
    totalCarryingCostAnnual: Math.round(totalCarryingCost),
    impactSummary,
  };
}
