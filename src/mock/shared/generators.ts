/**
 * DATA GENERATORS - Single Source of Truth
 * Utility functions for generating mock data
 */

import type {
  FormTypeId,
  ComplaintStatus,
  ComplaintPriority,
} from "../master-data/enums";
import { REF_PREFIX, REF_YEAR } from "./constants";

// ============================================================
// ID GENERATORS
// ============================================================

let idCounter = 1000;
export function generateId(prefix: string = "id"): string {
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}

// ============================================================
// COMPLAINT ID GENERATOR
// ============================================================
let complaintCounter = 1;
export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  complaintCounter += 1;
  return `CMP-${year}-${String(complaintCounter).padStart(4, "0")}`;
}

// ============================================================
// REFERENCE NUMBER GENERATOR
// ============================================================
let refCounter = 1;
export function generateRefNumber(formTypeId: FormTypeId): string {
  const formCode = getFormTypeCode(formTypeId);
  refCounter += 1;
  return `${REF_PREFIX}-${REF_YEAR}-${formCode}-${String(refCounter).padStart(4, "0")}`;
}

function getFormTypeCode(formTypeId: FormTypeId): string {
  const codes: Record<FormTypeId, string> = {
    ethics: "ETH",
    fraud: "FRD",
    employee_conduct: "EMP",
    product_service: "PRD",
    safety: "SFT",
    environmental: "ENV",
  };
  return codes[formTypeId] ?? "UNK";
}

// ============================================================
// DATE GENERATORS
// ============================================================
export function generateDate(daysAgo: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function generateDateRange(
  daysFrom: number = 0,
  daysTo: number = 0,
): { from: string; to: string } {
  const from = new Date();
  from.setDate(from.getDate() - daysFrom);
  const to = new Date();
  to.setDate(to.getDate() - daysTo);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function generateDueDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

// ============================================================
// COMPLAINT DATA GENERATORS
// ============================================================
export function generateComplaintStatus(): ComplaintStatus {
  const statuses: ComplaintStatus[] = [
    "pending",
    "in_progress",
    "investigating",
    "completed",
    "rejected",
    "closed",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export function generateComplaintPriority(): ComplaintPriority {
  const priorities: ComplaintPriority[] = ["low", "medium", "high", "critical"];
  const weights = [50, 30, 15, 5]; // Probability weights
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return priorities[i];
  }
  return "low";
}

// ============================================================
// STATISTICAL GENERATORS (derived from complaint data)
// ============================================================

/**
 * Generate KPI data derived from complaint counts
 */
export function generateKPIData(
  label: string,
  value: number,
  previousValue?: number,
): {
  label: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
} {
  if (previousValue === undefined) {
    return { label, value };
  }
  const change = ((value - previousValue) / previousValue) * 100;
  const trend: "up" | "down" | "neutral" =
    change > 5 ? "up" : change < -5 ? "down" : "neutral";
  return { label, value, change: Math.round(change * 10) / 10, trend };
}

/**
 * Generate SLA compliance rate
 */
export function generateSLAComplianceRate(
  withinSLA: number,
  total: number,
): number {
  if (total === 0) return 100;
  return Math.round((withinSLA / total) * 100 * 10) / 10;
}

/**
 * Calculate trend direction
 */
export function calculateTrend(
  current: number,
  previous: number,
): "up" | "down" | "neutral" {
  const change = ((current - previous) / previous) * 100;
  if (change > 5) return "up";
  if (change < -5) return "down";
  return "neutral";
}
