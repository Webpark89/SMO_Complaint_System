/**
 * CATEGORY TAXONOMY - SINGLE SOURCE OF TRUTH
 *
 * This file re-exports and extends the canonical taxonomy from complaintTypes.ts
 * DO NOT add duplicate data here - all category data lives in complaintTypes.ts
 *
 * Taxonomy:
 * 1.1 Ethics
 * 1.2 Fraud
 * 1.3 Employee Conduct
 * 1.4 Product & Service
 * 1.5 Safety
 * 1.6 Environmental
 */

// ============================================================
// RE-EXPORT FROM COMPLAINTS MODULE (Canonical Source)
// ============================================================
import {
  complaintTypes,
  getFormTypeName,
  getSubcategoryName,
  getSubcategories,
  hasWitnessField,
  getFormTypeById,
  type SubCategory,
  type ComplaintType,
} from "./complaints/complaintTypes";

import type { FormTypeId } from "./master-data/enums";
export type { FormTypeId } from "./master-data/enums";

export {
  complaintTypes,
  getFormTypeName,
  getSubcategoryName,
  getSubcategories,
  hasWitnessField,
  getFormTypeById,
};

export type { SubCategory, ComplaintType };

// ============================================================
// FORM TYPE ID CONSTANTS
// ============================================================
export const FORM_TYPE_IDS = {
  ETHICS: "ethics" as FormTypeId,
  BUSINESS_ETHICS: "business_ethics" as FormTypeId,
  FRAUD: "fraud" as FormTypeId,
  EMPLOYEE_CONDUCT: "employee_conduct" as FormTypeId,
  PRODUCT_SERVICE: "product_service" as FormTypeId,
  SAFETY: "safety" as FormTypeId,
  ENVIRONMENTAL: "environmental" as FormTypeId,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all categories
 */
export function getAllCategories(): ComplaintType[] {
  return complaintTypes;
}

/**
 * Get category by FormTypeId
 */
export function getCategoryById(
  formTypeId: FormTypeId,
): ComplaintType | undefined {
  return complaintTypes.find((x) => x.id === formTypeId);
}

/**
 * Get total subcategory count across all categories
 */
export function getTotalSubcategoryCountFromTaxonomy(): number {
  return complaintTypes.reduce((acc, cat) => acc + cat.subcategories.length, 0);
}

/**
 * Get all FormTypeId values as array (for dropdowns)
 */
export function getFormTypeIdValues(): FormTypeId[] {
  return [
    "ethics",
    "business_ethics",
    "fraud",
    "employee_conduct",
    "product_service",
    "safety",
    "environmental",
  ];
}

// ============================================================
// CATEGORY OPTIONS (for dropdowns)
// ============================================================
export const CATEGORY_OPTIONS = complaintTypes.map((cat) => ({
  value: cat.id,
  label: cat.name,
  code: cat.code,
}));

// ============================================================
// SUBCATEGORY OPTIONS (flattened, for dropdowns)
// ============================================================
export const SUBCATEGORY_OPTIONS = complaintTypes.flatMap((cat) =>
  cat.subcategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
    code: sub.code,
    formTypeId: sub.formTypeId,
    categoryCode: cat.code,
    categoryName: cat.name,
  })),
);

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Validate code format (X.X.X)
 */
export function isValidCodeFormat(code: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(code);
}

/**
 * Get category code from subcategory code
 */
export function getParentCode(subcategoryCode: string): string | null {
  const match = subcategoryCode.match(/^(\d+\.\d+)\.\d+$/);
  return match ? match[1] : null;
}

/**
 * Validate subcategory belongs to correct parent
 */
export function validateSubcategoryMapping(
  subcategoryCode: string,
  formTypeId: FormTypeId,
): boolean {
  const parentCode = getParentCode(subcategoryCode);
  const category = complaintTypes.find((c) => c.id === formTypeId);
  return parentCode === category?.code;
}
