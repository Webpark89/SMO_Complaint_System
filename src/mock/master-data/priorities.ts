/**
 * PRIORITY OPTIONS - Single Source of Truth
 * All priority dropdown options centralized here
 * Thai labels for UI display
 */

import type { ComplaintPriority } from "./enums";

// ============================================================
// COMPLAINT PRIORITY OPTIONS
// ============================================================
export const COMPLAINT_PRIORITY_OPTIONS: {
  value: ComplaintPriority | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "low", label: "ทั่วไป" },
  { value: "medium", label: "เร่งด่วน" },
  { value: "high", label: "เฉียบพลัน" },
  { value: "critical", label: "วิกฤต" },
];

// ============================================================
// URGENCY LEVEL OPTIONS
// ============================================================
export const URGENCY_LEVEL_OPTIONS: {
  value: ComplaintPriority;
  label: string;
}[] = [
  { value: "low", label: "ต่ำ" },
  { value: "medium", label: "ปานกลาง" },
  { value: "high", label: "สูง" },
  { value: "critical", label: "วิกฤต" },
];

// ============================================================
// PRIORITY COLORS (for UI display)
// ============================================================
export const PRIORITY_COLORS: Record<ComplaintPriority, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

// ============================================================
// PRIORITY SORT ORDER
// ============================================================
export const PRIORITY_SORT_ORDER: Record<ComplaintPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
