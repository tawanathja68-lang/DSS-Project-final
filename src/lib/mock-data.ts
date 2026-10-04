import { DimDate, DimProduct, DimStore, FactInventory, FactSale, RawTransaction } from "./types";

export const initialStores: DimStore[] = [
  {
    store_id: "STR-01",
    store_name: "สาขาสยามพารากอน (Flagship)",
    region: "กรุงเทพฯ และปริมณฑล",
    city: "กรุงเทพมหานคร",
    store_type: "Hypermarket",
    manager_name: "คุณสมชาย วงศ์สวัสดิ์",
  },
  {
    store_id: "STR-02",
    store_name: "สาขาเซ็นทรัลเวิลด์",
    region: "กรุงเทพฯ และปริมณฑล",
    city: "กรุงเทพมหานคร",
    store_type: "Supermarket",
    manager_name: "คุณสิริพร รัตนไพศาล",
  },
  {
    store_id: "STR-03",
    store_name: "สาขาเซ็นทรัล เชียงใหม่",
    region: "ภาคเหนือ",
    city: "เชียงใหม่",
    store_type: "Hypermarket",
    manager_name: "คุณธีรพงษ์ แก้วมณี",
  },
  {
    store_id: "STR-04",
    store_name: "สาขาเซ็นทรัล ขอนแก่น",
    region: "ภาคตะวันออกเฉียงเหนือ",
    city: "ขอนแก่น",
    store_type: "Supermarket",
    manager_name: "คุณนภัสสร ศิริวิวัฒน์",
  },
  {
    store_id: "STR-05",
    store_name: "สาขาจังซีลอน ภูเก็ต",
    region: "ภาคใต้",
    city: "ภูเก็ต",
    store_type: "Convenience Store",
    manager_name: "คุณกฤษฎา บุญประเสริฐ",
  },
];

export const initialProducts: DimProduct[] = [
  {
    product_id: "PRD-001",
    product_name: "นมสดพาสเจอร์ไรส์ เมจิ 830ml",
    category: "นมและเครื่องดื่มนม",
    unit_cost: 38.0,
    unit_price: 49.5,
    supplier_name: "ซีพี-เมจิ จำกัด",
    lead_time_days: 2,
    min_order_qty: 48,
    holding_cost_rate: 0.2,
  },
  {
    product_id: "PRD-002",
    product_name: "ขนมปังแซนด์วิช ฟาร์มเฮ้าส์ 480g",
    category: "เบเกอรี่และของว่าง",
    unit_cost: 32.0,
    unit_price: 42.0,
    supplier_name: "เพรซิเดนท์ เบเกอรี่",
    lead_time_days: 2,
    min_order_qty: 30,
    holding_cost_rate: 0.18,
  },
  {
    product_id: "PRD-003",
    product_name: "น้ำดื่มสิงห์ 600ml (แพ็ค 12)",
    category: "เครื่องดื่ม",
    unit_cost: 45.0,
    unit_price: 65.0,
    supplier_name: "สิงห์ คอร์เปอเรชั่น",
    lead_time_days: 3,
    min_order_qty: 60,
    holding_cost_rate: 0.12,
  },
  {
    product_id: "PRD-004",
    product_name: "มาม่ารสต้มยำกุ้ง แพ็ค 10 ซอง",
    category: "อาหารแห้งและกึ่งสำเร็จรูป",
    unit_cost: 54.0,
    unit_price: 72.0,
    supplier_name: "ไทยเพรซิเดนท์ฟูดส์",
    lead_time_days: 4,
    min_order_qty: 40,
    holding_cost_rate: 0.1,
  },
  {
    product_id: "PRD-005",
    product_name: "ไข่ไก่สดเบอร์ 2 (แผง 30 ฟอง)",
    category: "อาหารสด",
    unit_cost: 110.0,
    unit_price: 145.0,
    supplier_name: "เบทาโกร อินเตอร์เนชั่นแนล",
    lead_time_days: 2,
    min_order_qty: 25,
    holding_cost_rate: 0.25,
  },
  {
    product_id: "PRD-006",
    product_name: "ข้าวหอมมะลิใหม่ ตราฉัตร 5kg",
    category: "อาหารแห้งและกึ่งสำเร็จรูป",
    unit_cost: 175.0,
    unit_price: 235.0,
    supplier_name: "ซีพี ข้าวตราฉัตร",
    lead_time_days: 5,
    min_order_qty: 20,
    holding_cost_rate: 0.08,
  },
  {
    product_id: "PRD-007",
    product_name: "น้ำมันพืช มรกต 1 ลิตร",
    category: "เครื่องปรุงและน้ำมัน",
    unit_cost: 48.0,
    unit_price: 64.0,
    supplier_name: "มรกต อินดัสตรี้ส์",
    lead_time_days: 3,
    min_order_qty: 36,
    holding_cost_rate: 0.1,
  },
  {
    product_id: "PRD-008",
    product_name: "กาแฟปรุงสำเร็จ เบอร์ดี้ โรบัสต้า (แพ็ค 30)",
    category: "เครื่องดื่ม",
    unit_cost: 95.0,
    unit_price: 130.0,
    supplier_name: "อายิโนะโมะโต๊ะ (ประเทศไทย)",
    lead_time_days: 4,
    min_order_qty: 30,
    holding_cost_rate: 0.12,
  },
  {
    product_id: "PRD-009",
    product_name: "กระดาษชำระ สก๊อตต์ เอ็กซ์ตร้า (24 ม้วน)",
    category: "ของใช้ส่วนตัวและครัวเรือน",
    unit_cost: 160.0,
    unit_price: 219.0,
    supplier_name: "คิมเบอร์ลี่ย์-คล๊าค",
    lead_time_days: 5,
    min_order_qty: 15,
    holding_cost_rate: 0.08,
  },
  {
    product_id: "PRD-010",
    product_name: "น้ำยาซักผ้า บรีส เอกเซล สูตรเข้มข้น 1400ml",
    category: "ของใช้ส่วนตัวและครัวเรือน",
    unit_cost: 115.0,
    unit_price: 159.0,
    supplier_name: "ยูนิลีเวอร์ ไทยแลนด์",
    lead_time_days: 4,
    min_order_qty: 20,
    holding_cost_rate: 0.1,
  },
];

// Generate 30 days of DimDate
export const generateDates = (): DimDate[] => {
  const dates: DimDate[] = [];
  const baseDate = new Date(2026, 9, 1); // Oct 1, 2026
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const dayNames = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - (29 - i));
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const date_id = year * 10000 + month * 100 + day;
    const dayOfWeek = d.getDay();

    dates.push({
      date_id,
      full_date: d.toISOString().split("T")[0],
      day,
      month,
      month_name: monthNames[month - 1],
      quarter: Math.ceil(month / 3),
      year,
      day_of_week: dayOfWeek,
      day_name: dayNames[dayOfWeek],
      is_weekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }
  return dates;
};

export const initialDates = generateDates();

// Raw Transactions generator for ETL demonstration
export const generateRawTransactions = (): RawTransaction[] => {
  const transactions: RawTransaction[] = [];
  const paymentMethods = ["PromptPay", "Credit Card", "Cash", "TrueMoney"];
  let receiptCounter = 10001;

  initialDates.slice(20).forEach((date) => {
    initialStores.forEach((store) => {
      // Create multi-item baskets to allow market basket analysis
      const basketCount = Math.floor(Math.random() * 4) + 3; // 3-6 baskets per store per day
      for (let b = 0; b < basketCount; b++) {
        const receiptNo = `REC-${receiptCounter++}`;
        const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Pick 1 to 3 items
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedIndices = new Set<number>();
        
        // Frequent basket pairs: PRD-001 (Milk) & PRD-002 (Bread), PRD-003 (Water) & PRD-004 (Mama)
        if (Math.random() > 0.4) {
          selectedIndices.add(0); // Milk
          selectedIndices.add(1); // Bread
        } else if (Math.random() > 0.5) {
          selectedIndices.add(2); // Water
          selectedIndices.add(3); // Mama
        }

        while (selectedIndices.size < numItems) {
          selectedIndices.add(Math.floor(Math.random() * initialProducts.length));
        }

        selectedIndices.forEach((prodIdx) => {
          const product = initialProducts[prodIdx];
          const qty = Math.floor(Math.random() * 3) + 1;
          transactions.push({
            id: `RAW-${transactions.length + 1}`,
            receipt_no: receiptNo,
            raw_date: `${date.full_date} ${String(Math.floor(Math.random() * 12) + 9).padStart(2, "0")}:${String(Math.floor(Math.random() * 59)).padStart(2, "0")}:00`,
            store_id: store.store_id,
            product_id: product.product_id,
            quantity: qty,
            unit_price: product.unit_price,
            payment_method: payment,
            status: "EXTRACTED",
          });
        });
      }
    });
  });

  return transactions;
};

// Generate Fact Sales
export const generateFactSales = (): FactSale[] => {
  const sales: FactSale[] = [];
  let salesId = 1;

  initialDates.forEach((date) => {
    // Weekend multiplier
    const weekendMultiplier = date.is_weekend ? 1.4 : 1.0;

    initialStores.forEach((store) => {
      // Store type multiplier
      const storeMultiplier = store.store_type === "Hypermarket" ? 1.5 : store.store_type === "Supermarket" ? 1.2 : 0.8;

      initialProducts.forEach((product) => {
        // Base daily demand varies by product
        let baseDemand = 8;
        if (product.product_id === "PRD-001" || product.product_id === "PRD-003") baseDemand = 22; // High velocity
        else if (product.product_id === "PRD-002" || product.product_id === "PRD-005") baseDemand = 16;
        else if (product.product_id === "PRD-004") baseDemand = 18;
        else if (product.product_id === "PRD-006") baseDemand = 7;
        else if (product.product_id === "PRD-008") baseDemand = 10;
        else baseDemand = 5;

        // Add randomness
        const randomVariance = (Math.random() * 0.4 + 0.8); // 0.8 - 1.2
        const qtySold = Math.max(1, Math.round(baseDemand * weekendMultiplier * storeMultiplier * randomVariance));
        const totalSales = Number((qtySold * product.unit_price).toFixed(2));
        const totalCost = Number((qtySold * product.unit_cost).toFixed(2));
        const grossProfit = Number((totalSales - totalCost).toFixed(2));
        const profitMarginPct = Number(((grossProfit / totalSales) * 100).toFixed(2));

        sales.push({
          sales_id: salesId++,
          date_id: date.date_id,
          store_id: store.store_id,
          product_id: product.product_id,
          quantity_sold: qtySold,
          unit_price: product.unit_price,
          unit_cost: product.unit_cost,
          total_sales: totalSales,
          total_cost: totalCost,
          gross_profit: grossProfit,
          profit_margin_pct: profitMarginPct,
          date,
          store,
          product,
        });
      });
    });
  });

  return sales;
};

// Generate Fact Inventory with safety stock, reorder point, and current stock status
export const generateFactInventory = (): FactInventory[] => {
  const inventory: FactInventory[] = [];
  let invId = 1;

  initialStores.forEach((store) => {
    initialProducts.forEach((product) => {
      // Calculate daily demand average
      const baseDailyDemand = product.product_id === "PRD-001" ? 25 : product.product_id === "PRD-003" ? 28 : product.product_id === "PRD-002" ? 18 : 10;
      const storeScale = store.store_type === "Hypermarket" ? 1.4 : store.store_type === "Supermarket" ? 1.0 : 0.7;
      const dailyDemandAvg = Math.round(baseDailyDemand * storeScale);
      
      // Standard Deviation of demand ~ 25% of demand
      const stdDevDemand = dailyDemandAvg * 0.25;
      
      // Z-score for 95% service level = 1.65
      const zScore = 1.65;
      const safetyStock = Math.ceil(zScore * stdDevDemand * Math.sqrt(product.lead_time_days));
      const reorderPoint = Math.ceil(dailyDemandAvg * product.lead_time_days + safetyStock);
      const maxCapacity = reorderPoint * 3;

      // Realistic stock level to create realistic situations (some critical, some low, some optimal)
      let currentStock: number;
      let stockStatus: 'CRITICAL' | 'LOW' | 'OPTIMAL' | 'OVERSTOCK';

      // Seed specific critical products for demonstration
      if (store.store_id === "STR-01" && product.product_id === "PRD-001") {
        currentStock = Math.round(safetyStock * 0.4); // Below safety stock -> CRITICAL
        stockStatus = "CRITICAL";
      } else if (store.store_id === "STR-02" && product.product_id === "PRD-005") {
        currentStock = Math.round(safetyStock * 0.6);
        stockStatus = "CRITICAL";
      } else if (store.store_id === "STR-03" && product.product_id === "PRD-002") {
        currentStock = Math.round(reorderPoint * 0.85); // Between safety stock & ROP -> LOW
        stockStatus = "LOW";
      } else if (store.store_id === "STR-04" && product.product_id === "PRD-003") {
        currentStock = Math.round(reorderPoint * 0.9);
        stockStatus = "LOW";
      } else if (store.store_id === "STR-05" && product.product_id === "PRD-009") {
        currentStock = Math.round(maxCapacity * 1.1);
        stockStatus = "OVERSTOCK";
      } else {
        currentStock = Math.round(reorderPoint * (1.2 + Math.random() * 0.6));
        stockStatus = "OPTIMAL";
      }

      inventory.push({
        inventory_id: invId++,
        store_id: store.store_id,
        product_id: product.product_id,
        current_stock: currentStock,
        safety_stock: safetyStock,
        reorder_point: reorderPoint,
        max_capacity: maxCapacity,
        in_transit_qty: stockStatus === "CRITICAL" ? 0 : Math.round(product.min_order_qty * 0.5),
        stock_status: stockStatus,
        daily_demand_avg: dailyDemandAvg,
        lead_time_days: product.lead_time_days,
        store,
        product,
      });
    });
  });

  return inventory;
};
