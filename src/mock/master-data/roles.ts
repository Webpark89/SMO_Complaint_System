/**
 * ROLE OPTIONS - Single Source of Truth
 * All role dropdown options centralized here
 */

import type { UserRole } from "./enums";

// ============================================================
// USER ROLE OPTIONS
// ============================================================
export const USER_ROLE_OPTIONS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "admin", label: "ผู้ดูแลระบบ" },
  { value: "supervisor", label: "หัวหน้าฝ่าย" },
  { value: "investigator", label: "เจ้าหน้าที่" },
  { value: "viewer", label: "ผู้ใช้ทั่วไป" },
];

// ============================================================
// USER ROLE LABELS (Thai)
// ============================================================
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "ผู้ดูแลระบบ",
  supervisor: "หัวหน้าฝ่าย",
  investigator: "เจ้าหน้าที่",
  viewer: "ผู้ใช้ทั่วไป",
};

// ============================================================
// PERMISSIONS LIST
// ============================================================
export const PERMISSIONS_LIST = [
  "ดูเรื่อง",
  "เพิ่มเรื่อง",
  "แก้ไขเรื่อง",
  "ลบเรื่อง",
  "ตรวจสอบเรื่อง",
  "อนุมัติผล",
  "ปิดเรื่อง",
  "จัดการผู้ใช้",
  "จัดการบทบาท",
  "จัดการตั้งค่า",
  "ดูรายงาน",
  "ส่งออกรายงาน",
] as const;

// ============================================================
// ROLE PERMISSIONS MAPPING
// ============================================================
export const ROLE_PERMISSIONS: Record<
  UserRole,
  (typeof PERMISSIONS_LIST)[number][]
> = {
  admin: [...PERMISSIONS_LIST],
  supervisor: [
    "ดูเรื่อง",
    "เพิ่มเรื่อง",
    "แก้ไขเรื่อง",
    "ตรวจสอบเรื่อง",
    "อนุมัติผล",
    "ปิดเรื่อง",
    "ดูรายงาน",
    "ส่งออกรายงาน",
  ],
  investigator: [
    "ดูเรื่อง",
    "เพิ่มเรื่อง",
    "แก้ไขเรื่อง",
    "ตรวจสอบเรื่อง",
    "ดูรายงาน",
  ],
  viewer: ["ดูเรื่อง", "ดูรายงาน"],
};
