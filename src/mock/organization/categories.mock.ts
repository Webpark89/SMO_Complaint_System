import {
  FormTypeId,
  complaintTypes,
  CATEGORY_OPTIONS,
} from "../category-taxonomy";

export type CategoryStatus = "เปิดใช้งาน" | "ระงับ";

export type CategoryRow = {
  id: string;
  name: string;
  code: string; // X.X format
  formTypeId: FormTypeId;
  description: string;
  subcategoryCount: number;
  status: CategoryStatus;
};
export const mockCategories: CategoryRow[] = [
  {
    id: "CMP-001",
    name: "จริยธรรม",
    code: "1.1",
    formTypeId: "ethics",
    description: "เรื่องร้องเรียนด้านจริยธรรม",
    subcategoryCount: 6,
    status: "เปิดใช้งาน",
  },
  {
    id: "CMP-002",
    name: "การทุจริต",
    code: "1.2",
    formTypeId: "fraud",
    description: "เรื่องร้องเรียนด้านการทุจริต",
    subcategoryCount: 6,
    status: "เปิดใช้งาน",
  },
  {
    id: "CMP-003",
    name: "พฤติกรรมพนักงาน",
    code: "1.3",
    formTypeId: "employee_conduct",
    description: "เรื่องร้องเรียนด้านพฤติกรรมพนักงาน",
    subcategoryCount: 6,
    status: "เปิดใช้งาน",
  },
  {
    id: "CMP-004",
    name: "ผลิตภัณฑ์และบริการ",
    code: "1.4",
    formTypeId: "product_service",
    description: "เรื่องร้องเรียนด้านผลิตภัณฑ์และบริการ",
    subcategoryCount: 6,
    status: "เปิดใช้งาน",
  },
  {
    id: "CMP-005",
    name: "ความปลอดภัย",
    code: "1.5",
    formTypeId: "safety",
    description: "เรื่องร้องเรียนด้านความปลอดภัย",
    subcategoryCount: 7,
    status: "เปิดใช้งาน",
  },
  {
    id: "CMP-006",
    name: "ด้านสิ่งแวดล้อม",
    code: "1.6",
    formTypeId: "environmental",
    description: "เรื่องร้องเรียนด้านสิ่งแวดล้อม",
    subcategoryCount: 5,
    status: "เปิดใช้งาน",
  },
];
export { CATEGORY_OPTIONS };

export const CATEGORY_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
];

export function getCategoryByFormTypeId(
  formTypeId: FormTypeId,
): CategoryRow | undefined {
  return mockCategories.find((c) => c.formTypeId === formTypeId);
}

/**
 * Get total category count
 */
export function getTotalCategoryCount(): number {
  return mockCategories.length;
}

/**
 * Get total subcategory count across all categories
 */
export function getTotalSubcategoryCountInCategories(): number {
  return mockCategories.reduce((acc, cat) => acc + cat.subcategoryCount, 0);
}
