/**
 * FORMS MOCK DATA
 * Fixed to align with 6-form canonical taxonomy
 * Uses FormTypeId from category-taxonomy.ts
 */
import { FormTypeId } from "../category-taxonomy";

export type FormRow = {
  id: string;
  name: string;
  formTypeId: FormTypeId;
  fields: number;
  version: string;
  updatedAt: string;
  status: string;
};

// ============================================================
// CORRECTED FORMS (mapped to 6-form taxonomy)
// ============================================================

export const mockForms: FormRow[] = [
  {
    id: "FORM-001",
    name: "ร้องเรียนทั่วไป",
    formTypeId: "ethics", // Mapped to ethics (default general complaint)
    fields: 12,
    version: "v2.1",
    updatedAt: "2026-05-15 10:00",
    status: "เปิดใช้งาน",
  },
  {
    id: "FORM-002",
    name: "ร้องเรียนผู้บริหาร",
    formTypeId: "fraud", // Re-mapped: management complaints are typically fraud-related
    fields: 18,
    version: "v1.5",
    updatedAt: "2026-05-10 14:30",
    status: "เปิดใช้งาน",
  },
  {
    id: "FORM-003",
    name: "ร้องเรียนสิ่งแวดล้อม",
    formTypeId: "environmental", // Kept correct mapping
    fields: 15,
    version: "v1.0",
    updatedAt: "2026-04-20 09:15",
    status: "แบบร่าง",
  },
  {
    id: "FORM-004",
    name: "ร้องเรียนบริการ",
    formTypeId: "product_service", // Re-mapped: บริการ → product_service
    fields: 10,
    version: "v1.0",
    updatedAt: "2026-04-18 11:00",
    status: "ปิดใช้งาน",
  },
  {
    id: "FORM-005",
    name: "แจ้งเบาะแส",
    formTypeId: "fraud", // Re-mapped: whistleblower forms are typically fraud-related
    fields: 8,
    version: "v1.2",
    updatedAt: "2026-05-01 08:30",
    status: "เปิดใช้งาน",
  },
];

// ============================================================
// FORM CATEGORIES (derived from canonical taxonomy)
// ============================================================

// Import from single source of truth
import { CATEGORY_OPTIONS } from "../category-taxonomy";

export { CATEGORY_OPTIONS };

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get form by FormTypeId
 */
export function getFormsByFormTypeId(formTypeId: FormTypeId): FormRow[] {
  return mockForms.filter((f) => f.formTypeId === formTypeId);
}

/**
 * Get form by ID
 */
export function getFormById(formId: string): FormRow | undefined {
  return mockForms.find((f) => f.id === formId);
}
