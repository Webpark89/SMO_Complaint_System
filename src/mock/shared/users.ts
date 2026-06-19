/**
 * SHARED USER DATA - Single Source of Truth
 * Centralized user mock data used across modules
 */

import type { User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "usr_1",
    username: "admin",
    email: "admin@company.com",
    displayName: "ผู้ดูแลระบบ",
    role: "admin",
    department: "การกำกับดูแล",
    branch: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    lastLogin: "2024-12-01T09:00:00Z",
  },
  {
    id: "usr_2",
    username: "supervisor1",
    email: "supervisor1@company.com",
    displayName: "นายสมชาย มั่นคง",
    role: "supervisor",
    department: "การกำกับดูแล",
    branch: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    lastLogin: "2024-12-01T08:30:00Z",
  },
  {
    id: "usr_3",
    username: "investigator1",
    email: "investigator1@company.com",
    displayName: "นางสาวสมหญิง ตรวจสอบ",
    role: "investigator",
    department: "บริการลูกค้า",
    branch: "สาขากรุงเทพฯ",
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
    lastLogin: "2024-11-30T17:00:00Z",
  },
  {
    id: "usr_4",
    username: "investigator2",
    email: "investigator2@company.com",
    displayName: "นายวิชัย สืบสวน",
    role: "investigator",
    department: "บริการลูกค้า",
    branch: "สาขานนทบุรี",
    is_active: true,
    created_at: "2024-02-15T00:00:00Z",
    lastLogin: "2024-11-29T16:00:00Z",
  },
  {
    id: "usr_5",
    username: "viewer1",
    email: "viewer1@company.com",
    displayName: "นายธนา เป็นผู้ชม",
    role: "viewer",
    department: "บริการอำนวยความสะดวก",
    branch: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ",
    is_active: true,
    created_at: "2024-03-01T00:00:00Z",
    lastLogin: "2024-11-28T10:00:00Z",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

/**
 * Get user by username
 */
export function getUserByUsername(username: string): User | undefined {
  return MOCK_USERS.find((u) => u.username === username);
}

/**
 * Get users by role
 */
export function getUsersByRole(role: string): User[] {
  return MOCK_USERS.filter((u) => u.role === role);
}

/**
 * Get active users
 */
export function getActiveUsers(): User[] {
  return MOCK_USERS.filter((u) => u.is_active);
}

/**
 * Get investigator users
 */
export function getInvestigators(): User[] {
  return MOCK_USERS.filter((u) => u.role === "investigator");
}

/**
 * Get supervisor users
 */
export function getSupervisors(): User[] {
  return MOCK_USERS.filter((u) => u.role === "supervisor");
}
