/**
 * SHARED FILE TYPE DATA - Single Source of Truth
 * Centralized file type and document type options
 */

// ============================================================
// DOCUMENT TYPES
// ============================================================
export const DOC_TYPES = [
  { value: "หนังสือราชการ", label: "หนังสือราชการ" },
  { value: "หลักฐานภาพถ่าย", label: "หลักฐานภาพถ่าย" },
  { value: "วีดีโอ", label: "วีดีโอ" },
  { value: "เอกสาร PDF", label: "เอกสาร PDF" },
  { value: "สัญญา", label: "สัญญา" },
  { value: "ใบเสร็จ", label: "ใบเสร็จ" },
  { value: "อื่นๆ", label: "อื่นๆ" },
] as const;

// ============================================================
// REPORT FORMATS
// ============================================================
export const FORMAT_OPTIONS = [
  { value: "PDF", label: "PDF" },
  { value: "Excel", label: "Excel" },
  { value: "Word", label: "Word" },
  { value: "CSV", label: "CSV" },
] as const;

// ============================================================
// INTAKE CHANNELS
// ============================================================
export const CHANNELS = [
  { value: "อีเมล", label: "อีเมล" },
  { value: "Line", label: "Line" },
  { value: "โทรศัพท์", label: "โทรศัพท์" },
  { value: "แบบฟอร์มออนไลน์", label: "แบบฟอร์มออนไลน์" },
  { value: "หนังสือราชการ", label: "หนังสือราชการ" },
] as const;

// ============================================================
// TEAMS
// ============================================================
export const TEAMS = [
  { value: "ทีมตรวจสอบ A", label: "ทีมตรวจสอบ A" },
  { value: "ทีมตรวจสอบ B", label: "ทีมตรวจสอบ B" },
  { value: "ทีมสืบสวนพิเศษ", label: "ทีมสืบสวนพิเศษ" },
  { value: "ทีมบริการลูกค้า", label: "ทีมบริการลูกค้า" },
  { value: "ทีมสิ่งแวดล้อม", label: "ทีมสิ่งแวดล้อม" },
  { value: "ทีมกำกับดูแล", label: "ทีมกำกับดูแล" },
] as const;

// ============================================================
// APPROVAL LEVELS
// ============================================================
export const LEVEL_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "ระดับ 1 - หัวหน้างาน", label: "ระดับ 1 - หัวหน้างาน" },
  { value: "ระดับ 2 - ผู้จัดการ", label: "ระดับ 2 - ผู้จัดการ" },
  { value: "ระดับ 3 - ผู้อำนวยการ", label: "ระดับ 3 - ผู้อำนวยการ" },
  { value: "ระดับ 4 - คณะกรรมการ", label: "ระดับ 4 - คณะกรรมการ" },
] as const;

export const LEVEL_OPTIONS_NO_ALL = [
  { value: "ระดับ 1 - หัวหน้างาน", label: "ระดับ 1 - หัวหน้างาน" },
  { value: "ระดับ 2 - ผู้จัดการ", label: "ระดับ 2 - ผู้จัดการ" },
  { value: "ระดับ 3 - ผู้อำนวยการ", label: "ระดับ 3 - ผู้อำนวยการ" },
  { value: "ระดับ 4 - คณะกรรมการ", label: "ระดับ 4 - คณะกรรมการ" },
] as const;

// ============================================================
// ORGANIZATION TYPES
// ============================================================
export const ORG_TYPES = [
  { value: "สำนักงานใหญ่", label: "สำนักงานใหญ่" },
  { value: "สาขา", label: "สาขา" },
  { value: "แผนก", label: "แผนก" },
  { value: "ฝ่าย", label: "ฝ่าย" },
] as const;

export const ORG_PARENT_OPTIONS = [
  { value: "ไม่มี", label: "ไม่มี (รากหลัก)" },
  { value: "สำนักงานใหญ่", label: "สำนักงานใหญ่" },
  { value: "สาขากรุงเทพฯ", label: "สาขากรุงเทพฯ" },
  { value: "สาขานนทบุรี", label: "สาขานนทบุรี" },
] as const;

// ============================================================
// SENSITIVE CASE CLASSIFICATIONS
// ============================================================
export const CLASSIFICATIONS = [
  { value: "ปกปิด", label: "ปกปิด" },
  { value: "เปิดเผยบางส่วน", label: "เปิดเผยบางส่วน" },
  { value: "ภายใน", label: "ภายใน" },
  { value: "เปิดเผย", label: "เปิดเผย" },
] as const;

export const SECURITY_LEVELS = [
  { value: "สูงสุด", label: "สูงสุด" },
  { value: "สูง", label: "สูง" },
  { value: "ปานกลาง", label: "ปานกลาง" },
  { value: "ทั่วไป", label: "ทั่วไป" },
] as const;
