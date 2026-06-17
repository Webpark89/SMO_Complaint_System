/**
 * SHARED CONSTANTS - Single Source of Truth
 * Centralized application constants
 */

// ============================================================
// SYSTEM CONSTANTS
// ============================================================
export const APP_NAME = "ระบบจัดการเรื่องร้องเรียน";
export const APP_NAME_SHORT = "CMP-";

// ============================================================
// REFERENCE NUMBER PREFIX
// ============================================================
export const REF_PREFIX = "CMP-";
export const REF_YEAR = "2026";

// ============================================================
// DATE FORMATS
// ============================================================
export const DATE_FORMAT = "dd/MM/yyyy";
export const TIME_FORMAT = "HH:mm";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";

// ============================================================
// SLA DEFAULTS (hours)
// ============================================================
export const SLA_DEFAULTS = {
  RESPONSE_LOW: 72,
  RESPONSE_MEDIUM: 48,
  RESPONSE_HIGH: 24,
  RESPONSE_CRITICAL: 4,
  RESOLUTION_LOW: 720,
  RESOLUTION_MEDIUM: 168,
  RESOLUTION_HIGH: 72,
  RESOLUTION_CRITICAL: 24,
} as const;

// ============================================================
// PAGINATION
// ============================================================
export const PAGE_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

// ============================================================
// FILE UPLOAD
// ============================================================
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

// ============================================================
// WORKFLOW STEPS
// ============================================================
export const WORKFLOW_STEP_NAMES = {
  INTAKE: "รับเรื่อง",
  ASSIGNMENT: "มอบหมาย",
  INVESTIGATION: "สืบสวน",
  APPROVAL: "อนุมัติ",
  CLOSED: "ปิดเรื่อง",
} as const;

// ============================================================
// COMPLAINT LOCATION EXAMPLES
// ============================================================
export const COMPLAINT_LOCATIONS = [
  "สำนักงานใหญ่ - ชั้น 1",
  "สำนักงานใหญ่ - ชั้น 2",
  "สาขากรุงเทพฯ",
  "สาขานนทบุรี",
  "ออนไลน์",
] as const;

// ============================================================
// STATUS COLORS (for UI display)
// ============================================================
export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  investigating: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  closed: "bg-gray-100 text-gray-800",
  approved: "bg-green-100 text-green-800",
  unassigned: "bg-gray-100 text-gray-800",
  assigned: "bg-blue-100 text-blue-800",
  // Add more as needed
};

// ============================================================
// THAI MONTHS
// ============================================================
export const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;
