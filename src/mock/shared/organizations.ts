/**
 * SHARED ORGANIZATION DATA - Single Source of Truth
 * Centralized organization mock data
 */

import type { Organization } from "./types";

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org_hq",
    name: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สำนักงานใหญ่",
    branch_code: "HQ",
    parent_id: null,
    level: 0,
    is_active: true,
  },
  {
    id: "org_bkk",
    name: "สาขาท่าชนะ",
    branch_code: "BKK",
    parent_id: "org_hq",
    level: 1,
    is_active: true,
  },
  {
    id: "org_nont",
    name: "สาขาพนม",
    branch_code: "NONT",
    parent_id: "org_hq",
    level: 1,
    is_active: true,
  },
  {
    id: "org_dept_1",
    name: "แผนกบริการลูกค้า",
    branch_code: "CS",
    parent_id: "org_bkk",
    level: 2,
    is_active: true,
  },
  {
    id: "org_dept_2",
    name: "แผนกการกำกับดูแล",
    branch_code: "COMPLY",
    parent_id: "org_hq",
    level: 2,
    is_active: true,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get organization by ID
 */
export function getOrganizationById(id: string): Organization | undefined {
  return MOCK_ORGANIZATIONS.find((o) => o.id === id);
}

/**
 * Get organizations by parent ID
 */
export function getOrganizationsByParentId(
  parentId: string | null,
): Organization[] {
  return MOCK_ORGANIZATIONS.filter((o) => o.parent_id === parentId);
}

/**
 * Get active organizations
 */
export function getActiveOrganizations(): Organization[] {
  return MOCK_ORGANIZATIONS.filter((o) => o.is_active);
}

/**
 * Get top-level organizations (no parent)
 */
export function getRootOrganizations(): Organization[] {
  return MOCK_ORGANIZATIONS.filter((o) => o.parent_id === null);
}

/**
 * Get branch organizations
 */
export function getBranches(): Organization[] {
  return MOCK_ORGANIZATIONS.filter((o) => o.level === 1);
}

// ============================================================
// BRANCHES LIST
// ============================================================
export const BRANCHES = [
  {
    value: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ",
    label: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ",
  },
  { value: "สาขาท่าขนะ", label: "สาขาท่าชนะ" },
  { value: "สาขาพนม", label: "สาขาพนม" },
  { value: "สาขาสระบุรี", label: "สาขาสระบุรี" },
] as const;
