// Dimensions
export interface DimDate {
  date_id: number; // e.g. 20261001
  full_date: string;
  day: number;
  month: number;
  month_name: string;
  quarter: number;
  year: number;
  day_of_week: number;
  day_name: string;
  is_weekend: boolean;
}

export interface DimStore {
  store_id: string; // e.g. 'STR-01'
  store_name: string;
  region: string;
  city: string;
  store_type: 'Hypermarket' | 'Supermarket' | 'Convenience Store';
  manager_name: string;
}

export interface DimProduct {
  product_id: string; // e.g. 'PRD-001'
  product_name: string;
  category: string;
  unit_cost: number;
  unit_price: number;
  supplier_name: string;
  lead_time_days: number;
  min_order_qty: number;
  holding_cost_rate: number; // e.g. 0.15 (15% per year)
}

// Fact Tables
export interface FactSale {
  sales_id: number;
  date_id: number;
  store_id: string;
  product_id: string;
  quantity_sold: number;
  unit_price: number;
  unit_cost: number;
  total_sales: number;
  total_cost: number;
  gross_profit: number;
  profit_margin_pct: number;
  // Denormalized/joined for fast UI rendering
  date?: DimDate;
  store?: DimStore;
  product?: DimProduct;
}

export interface FactInventory {
  inventory_id: number;
  store_id: string;
  product_id: string;
  current_stock: number;
  safety_stock: number;
  reorder_point: number;
  max_capacity: number;
  in_transit_qty: number;
  stock_status: 'CRITICAL' | 'LOW' | 'OPTIMAL' | 'OVERSTOCK';
  daily_demand_avg: number;
  lead_time_days: number;
  store?: DimStore;
  product?: DimProduct;
}

// Raw Transaction Staging (for ETL)
export interface RawTransaction {
  id: string;
  receipt_no: string;
  raw_date: string;
  store_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  payment_method: string;
  status: 'EXTRACTED' | 'TRANSFORMED' | 'LOADED';
}

// Data Mining Types
export interface MarketBasketRule {
  antecedent: string; // Product A
  consequent: string; // Product B
  support: number; // % transactions containing both
  confidence: number; // P(B|A)
  lift: number; // Lift ratio > 1 means positive correlation
  recommendation: string;
}

export interface ABCProductItem {
  product_id: string;
  product_name: string;
  category: string;
  total_revenue: number;
  total_quantity: number;
  cumulative_revenue_pct: number;
  classification: 'A' | 'B' | 'C';
  strategy: string;
}

export interface DemandForecastPoint {
  date: string;
  historicalSales?: number;
  forecastedSales: number;
  confidenceLower: number;
  confidenceUpper: number;
}

// DSS Types
export interface ReplenishmentRecommendation {
  id: string;
  store_id: string;
  store_name: string;
  product_id: string;
  product_name: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  safety_stock: number;
  recommended_order_qty: number;
  lead_time_days: number;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  unit_cost: number;
  estimated_order_cost: number;
  supplier_name: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED';
}

export interface WhatIfScenarioInput {
  demandSurgePct: number; // e.g. +20%
  leadTimeDelayDays: number; // e.g. +2 days
  serviceLevelPct: number; // e.g. 95%
  holdingCostRatePct: number; // e.g. 15%
}

export interface WhatIfSimulationResult {
  scenarioName: string;
  newSafetyStockAvg: number;
  newReorderPointAvg: number;
  totalOrderUnits: number;
  totalWorkingCapitalNeeded: number;
  stockoutRiskPct: number;
  totalCarryingCostAnnual: number;
  impactSummary: string;
}

export interface ETLStepStatus {
  step: 'EXTRACT' | 'TRANSFORM' | 'LOAD';
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  recordsProcessed: number;
  executionTimeMs: number;
  details: string;
}
