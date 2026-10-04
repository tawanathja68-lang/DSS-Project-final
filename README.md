# RetailDSS Pro - ระบบสนับสนุนการตัดสินใจเพื่อวิเคราะห์ยอดขายและวางแผนการเติมสินค้าร้านค้า (Retail DSS)

ระบบสนับสนุนการตัดสินใจ (Decision Support System: DSS) ในรูปแบบ Interactive Dashboard พัฒนาด้วย **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4** และเชื่อมต่อฐานข้อมูล **Supabase Cloud Database** โดยประมวลผลข้อมูลตามวงจรข้อมูลทางธุรกิจอย่างครบวงจร:

```
ETL Pipeline ➔ Data Warehouse (Star Schema) ➔ OLAP Multidimensional Analysis ➔ Data Mining ➔ DSS Replenishment & What-If Simulation
```

---

## 📌 สถาปัตยกรรมวงจรข้อมูลครบวงจร (Complete Data Lifecycle)

### 1. วงจรการสกัด แปรรูป และโหลดข้อมูล (ETL Process)
- **Extract:** ดึงข้อมูลธุรกรรมดิบจากระบบจุดขาย (POS Transactions Staging Table: `raw_pos_transactions`)
- **Transform:** 
  - ทำความสะอาดข้อมูล (Data Cleansing & Validation)
  - สร้างและเชื่อมโยง Surrogate Keys กับมิติข้อมูล
  - คำนวณตัวชี้วัดทางการเงิน (Gross Profit, Profit Margin %, Transaction Aggregates)
- **Load:** นำเข้าสู่ตารางข้อเท็จจริงในคลังข้อมูล (`fact_sales` และ `fact_inventory`) พร้อมระบบ Logs แบบเรียลไทม์

### 2. คลังข้อมูล (Data Warehouse - Star Schema Architecture)
โครงสร้างแบบ Dimensional Modeling เพื่อความเร็วในการวิเคราะห์ระดับสูง:
- **Fact Tables:**
  - `fact_sales`: ข้อเท็จจริงธุรกรรมยอดขาย (ปริมาณขาย, ต้นทุน, ยอดขายรวม, กำไรขั้นต้น, อัตรากำไร)
  - `fact_inventory`: ข้อเท็จจริงสถานะสต็อก (ระดับสต็อกคงเหลือ, Safety Stock, Reorder Point, ความจุสูงสุด, สถานะความเร่งด่วน)
- **Dimension Tables:**
  - `dim_store`: มิติสาขาและภูมิภาค (กรุงเทพฯ, เชียงใหม่, ขอนแก่น, ภูเก็ต)
  - `dim_product`: มิติสินค้าและหมวดหมู่ พร้อมข้อมูล Supplier, Lead Time, MOQ และต้นทุนการถือครอง
  - `dim_date`: มิติเวลา (วัน, เดือน, ไตรมาส, ปี, วันหยุด, วันสุดสัปดาห์)

### 3. การประมวลผลการวิเคราะห์หลายมิติ (OLAP Engine)
- **Slice & Dice:** กรองข้อมูลตามภูมิภาค (Region), สาขา (Store), และหมวดหมู่สินค้า (Product Category)
- **Roll-up & Drill-down:** สลับดูผลการดำเนินงานระดับสูง หรือเจาะลึกรายสาขาและรายหมวดหมู่
- **Cross-dimensional Pivot Matrix:** ตารางสรุปข้ามมิติ สาขา (Rows) $\times$ หมวดหมู่สินค้า (Columns) พร้อมคำนวณผลรวมแบบไดนามิก

### 4. แบบจำลองเหมืองข้อมูล (Data Mining Models)
1. **Market Basket Analysis (Apriori Algorithm):** ค้นหากฎความสัมพันธ์ (Association Rules) เช่น การซื้อนมคู่ขนมปัง หรือน้ำดื่มคู่บะหมี่ พร้อมคำนวณ Support %, Confidence %, และ Lift Ratio เพื่อวางแผน Cross-selling และจัด Shelf Merchandising
2. **Sales Demand Forecasting:** แบบจำลองพยากรณ์ความต้องการสินค้าล่วงหน้า 7-14 วัน ด้วยเทคนิค Time Series Exponential Smoothing with Trend และปรับค่าตาม Seasonality ของวันหยุดสุดสัปดาห์
3. **ABC Inventory Classification (Pareto Principle 80/20):** จัดกลุ่มสินค้าตามมูลค่ายอดขายสะสม:
   - **กลุ่ม A (Top 70% Revenue):** สินค้าหัวหอกกำไรสูง ควบคุมสต็อกเข้มงวด ห้ามของขาด
   - **กลุ่ม B (20% Revenue):** สินค้าปานกลาง สั่งซื้อตามรอบปกติ (EOQ)
   - **กลุ่ม C (10% Revenue):** สินค้าขายช้า สั่งปริมาณน้อยเพื่อลด Working Capital

### 5. ระบบสนับสนุนการตัดสินใจ (DSS Core Modules)
- **Automated Replenishment Engine:** คำนวณจุดสั่งซื้อซ้ำ ($ROP = d \times L + SS$) และ Safety Stock ($SS = Z \times \sigma_d \times \sqrt{L}$) พร้อมจัดลำดับความเร่งด่วน (Critical, High, Normal) และออกใบสรุปคำสั่งซื้อ (Purchase Order)
- **Interactive What-If Simulation:** แบบจำลองการตัดสินใจภายใต้สถานการณ์สมมติ ปรับตัวแปร Demand Surge (+/-%), ขนส่งล่าช้า (+Days), Service Level Target (85%-99%), และ Holding Cost Rate เพื่อคำนวณเงินทุนสำรองและความเสี่ยงสต็อกขาดมือแบบทันที

---

## 🛠️ วิธีการติดตั้งและรันในเครื่อง (Getting Started)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **ตั้งค่า Environment Variables:**
   คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   ระบุ Supabase URL และ Anon Key ของคุณ:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **รัน Development Server:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

4. **ทดสอบ Build ก่อน Deploy:**
   ```bash
   npm run build
   ```

---

## ☁️ การติดตั้งฐานข้อมูล Supabase

1. เข้าสู่โปรเจกต์ของคุณบน [Supabase Dashboard](https://supabase.com)
2. ไปที่เมนู **SQL Editor** ด้านซ้าย
3. คัดลอกเนื้อหาทั้งหมดจากไฟล์ [`supabase_schema.sql`](./supabase_schema.sql) ในโปรเจกต์นี้ วางใน SQL Editor แล้วกด **Run**
4. เปิดแดชบอร์ดหน้าระบบ เข้าไปที่แท็บ **ETL Console** แล้วกดปุ่ม **"อัปโหลดข้อมูลเข้า Supabase จริง"** เพื่อนำเข้าข้อมูลจำลองเริ่มต้น

---

## 🚀 การ Deploy ขึ้นใช้งานจริงบน Vercel

1. Push โค้ดทั้งหมดขึ้น GitHub:
   ```bash
   git add .
   git commit -m "feat: complete retail DSS with ETL, Star Schema, OLAP, Data Mining, and Supabase integration"
   git push origin main
   ```
2. ไปที่ [Vercel](https://vercel.com) แล้วเลือก **Add New Project** ➔ **Import Git Repository** (`DssPro`)
3. ในส่วน **Environment Variables** ให้เพิ่ม 2 ค่า:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. กดปุ่ม **Deploy** ระบบจะทำการ Build และสร้าง Production URL ให้พร้อมใช้งานทันที!

# DSS-Project-final
