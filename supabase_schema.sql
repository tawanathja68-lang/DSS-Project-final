-- ==============================================================================
-- Retail DSS: Sales Analysis & Inventory Replenishment Decision Support System
-- Database Schema: Star Schema (Data Warehouse) & POS Staging for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-creating
DROP TABLE IF EXISTS dss_replenishment_orders CASCADE;
DROP TABLE IF EXISTS fact_sales CASCADE;
DROP TABLE IF EXISTS fact_inventory CASCADE;
DROP TABLE IF EXISTS raw_pos_transactions CASCADE;
DROP TABLE IF EXISTS dim_date CASCADE;
DROP TABLE IF EXISTS dim_product CASCADE;
DROP TABLE IF EXISTS dim_store CASCADE;

-- ==============================================================================
-- 3. Dimension Tables
-- ==============================================================================

-- 3.1 Store Dimension (มิติสาขาร้านค้า)
CREATE TABLE dim_store (
    store_id VARCHAR(20) PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    store_type VARCHAR(50) NOT NULL,
    manager_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Product Dimension (มิติสินค้าและหมวดหมู่)
CREATE TABLE dim_product (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    lead_time_days INT NOT NULL DEFAULT 3,
    min_order_qty INT NOT NULL DEFAULT 10,
    holding_cost_rate NUMERIC(5, 4) DEFAULT 0.15,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Date Dimension (มิติเวลาเพื่อรองรับ OLAP Roll-up / Drill-down)
CREATE TABLE dim_date (
    date_id INT PRIMARY KEY, -- เช่น 20261001
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

-- ==============================================================================
-- 4. Staging Table for ETL (ดึงข้อมูลดิบจาก POS)
-- ==============================================================================
CREATE TABLE raw_pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_no VARCHAR(50) NOT NULL,
    raw_date TIMESTAMPTZ NOT NULL,
    store_id VARCHAR(20) REFERENCES dim_store(store_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'EXTRACTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. Fact Tables (Star Schema)
-- ==============================================================================

-- 5.1 Fact Sales (ตารางข้อเท็จจริงยอดขาย)
CREATE TABLE fact_sales (
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
    profit_margin_pct NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Fact Inventory (ตารางข้อเท็จจริงระดับสต็อกสินค้าและ ROP)
CREATE TABLE fact_inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES dim_store(store_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    current_stock INT NOT NULL,
    safety_stock INT NOT NULL,
    reorder_point INT NOT NULL,
    max_capacity INT NOT NULL,
    in_transit_qty INT DEFAULT 0,
    stock_status VARCHAR(20) NOT NULL, -- 'CRITICAL', 'LOW', 'OPTIMAL', 'OVERSTOCK'
    daily_demand_avg INT NOT NULL,
    lead_time_days INT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. DSS Replenishment Orders (ตารางคำสั่งซื้อและผลการตัดสินใจของระบบ DSS)
-- ==============================================================================
CREATE TABLE dss_replenishment_orders (
    order_id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES dim_store(store_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    recommended_qty INT NOT NULL,
    urgency_level VARCHAR(20) NOT NULL, -- 'CRITICAL', 'HIGH', 'NORMAL'
    estimated_cost NUMERIC(12, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'ORDERED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. High Performance Indexes for OLAP & Mining Queries
-- ==============================================================================
CREATE INDEX idx_fact_sales_date ON fact_sales(date_id);
CREATE INDEX idx_fact_sales_store ON fact_sales(store_id);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_id);
CREATE INDEX idx_fact_inventory_store_prod ON fact_inventory(store_id, product_id);
CREATE INDEX idx_fact_inventory_status ON fact_inventory(stock_status);

-- ==============================================================================
-- 8. Seed Initial Dimension Data
-- ==============================================================================

-- 8.1 Dim Stores
INSERT INTO dim_store (store_id, store_name, region, city, store_type, manager_name) VALUES
('STR-01', 'สาขาสยามพารากอน (Flagship)', 'กรุงเทพฯ และปริมณฑล', 'กรุงเทพมหานคร', 'Hypermarket', 'คุณสมชาย วงศ์สวัสดิ์'),
('STR-02', 'สาขาเซ็นทรัลเวิลด์', 'กรุงเทพฯ และปริมณฑล', 'กรุงเทพมหานคร', 'Supermarket', 'คุณสิริพร รัตนไพศาล'),
('STR-03', 'สาขาเซ็นทรัล เชียงใหม่', 'ภาคเหนือ', 'เชียงใหม่', 'Hypermarket', 'คุณธีรพงษ์ แก้วมณี'),
('STR-04', 'สาขาเซ็นทรัล ขอนแก่น', 'ภาคตะวันออกเฉียงเหนือ', 'ขอนแก่น', 'Supermarket', 'คุณนภัสสร ศิริวิวัฒน์'),
('STR-05', 'สาขาจังซีลอน ภูเก็ต', 'ภาคใต้', 'ภูเก็ต', 'Convenience Store', 'คุณกฤษฎา บุญประเสริฐ')
ON CONFLICT (store_id) DO NOTHING;

-- 8.2 Dim Products
INSERT INTO dim_product (product_id, product_name, category, unit_cost, unit_price, supplier_name, lead_time_days, min_order_qty, holding_cost_rate) VALUES
('PRD-001', 'นมสดพาสเจอร์ไรส์ เมจิ 830ml', 'นมและเครื่องดื่มนม', 38.00, 49.50, 'ซีพี-เมจิ จำกัด', 2, 48, 0.20),
('PRD-002', 'ขนมปังแซนด์วิช ฟาร์มเฮ้าส์ 480g', 'เบเกอรี่และของว่าง', 32.00, 42.00, 'เพรซิเดนท์ เบเกอรี่', 2, 30, 0.18),
('PRD-003', 'น้ำดื่มสิงห์ 600ml (แพ็ค 12)', 'เครื่องดื่ม', 45.00, 65.00, 'สิงห์ คอร์เปอเรชั่น', 3, 60, 0.12),
('PRD-004', 'มาม่ารสต้มยำกุ้ง แพ็ค 10 ซอง', 'อาหารแห้งและกึ่งสำเร็จรูป', 54.00, 72.00, 'ไทยเพรซิเดนท์ฟูดส์', 4, 40, 0.10),
('PRD-005', 'ไข่ไก่สดเบอร์ 2 (แผง 30 ฟอง)', 'อาหารสด', 110.00, 145.00, 'เบทาโกร อินเตอร์เนชั่นแนล', 2, 25, 0.25),
('PRD-006', 'ข้าวหอมมะลิใหม่ ตราฉัตร 5kg', 'อาหารแห้งและกึ่งสำเร็จรูป', 175.00, 235.00, 'ซีพี ข้าวตราฉัตร', 5, 20, 0.08),
('PRD-007', 'น้ำมันพืช มรกต 1 ลิตร', 'เครื่องปรุงและน้ำมัน', 48.00, 64.00, 'มรกต อินดัสตรี้ส์', 3, 36, 0.10),
('PRD-008', 'กาแฟปรุงสำเร็จ เบอร์ดี้ โรบัสต้า (แพ็ค 30)', 'เครื่องดื่ม', 95.00, 130.00, 'อายิโนะโมะโต๊ะ (ประเทศไทย)', 4, 30, 0.12),
('PRD-009', 'กระดาษชำระ สก๊อตต์ เอ็กซ์ตร้า (24 ม้วน)', 'ของใช้ส่วนตัวและครัวเรือน', 160.00, 219.00, 'คิมเบอร์ลี่ย์-คล๊าค', 5, 15, 0.08),
('PRD-010', 'น้ำยาซักผ้า บรีส เอกเซล สูตรเข้มข้น 1400ml', 'ของใช้ส่วนตัวและครัวเรือน', 115.00, 159.00, 'ยูนิลีเวอร์ ไทยแลนด์', 4, 20, 0.10)
ON CONFLICT (product_id) DO NOTHING;

-- Enable Row Level Security (RLS) but allow anonymous read/write for DSS app demo
ALTER TABLE dim_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_date ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE dss_replenishment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON dim_store FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON dim_product FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON dim_date FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON raw_pos_transactions FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON fact_sales FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON fact_inventory FOR SELECT USING (true);
CREATE POLICY "Public Read All" ON dss_replenishment_orders FOR SELECT USING (true);

CREATE POLICY "Public Insert All" ON raw_pos_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert All" ON fact_sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Upsert All" ON fact_inventory FOR ALL USING (true);
CREATE POLICY "Public Upsert All" ON dss_replenishment_orders FOR ALL USING (true);
