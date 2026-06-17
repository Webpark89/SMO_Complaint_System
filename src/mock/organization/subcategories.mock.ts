/**
 * SUBCATEGORIES MOCK DATA
 * Aligned with 7-form canonical taxonomy from category-taxonomy.ts
 * 43 total subcategories
 */
import {
  FormTypeId,
  SUBCATEGORY_OPTIONS,
  complaintTypes,
} from "../category-taxonomy";

export type SubStatus = "เปิดใช้งาน" | "ระงับ";

// Backward compatibility: category is the Thai name for display
export type SubcategoryRow = {
  id: string;
  code: string; // X.X.X format
  formTypeId: FormTypeId;
  category: string; // Thai category name (backward compat)
  name: string;
  description: string;
  status: SubStatus;
};

// ============================================================
// HELPER: Get Thai category name from formTypeId
// ============================================================
function getCategoryName(formTypeId: FormTypeId): string {
  const cat = complaintTypes.find((c) => c.id === formTypeId);
  return cat?.name ?? formTypeId;
}

// ============================================================
// SUBCATEGORIES (43 total - aligned with canonical taxonomy)
// ============================================================

export const mockSubcategories: SubcategoryRow[] = [
  // ========== 1.1 ฟอร์มการปฏิบัติต่อผู้มีส่วนได้เสีย (6 subcategories) ==========
  {
    id: "eth_shareholder",
    code: "1.1.1",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "ผู้ถือหุ้น (Shareholder)",
    description: "ร้องเรียนเรื่องผู้ถือหุ้น",
    status: "เปิดใช้งาน",
  },
  {
    id: "eth_customer",
    code: "1.1.2",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "ลูกค้า (Customer)",
    description: "ร้องเรียนเรื่องลูกค้า",
    status: "เปิดใช้งาน",
  },
  {
    id: "eth_employee",
    code: "1.1.3",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "พนักงาน (Employee)",
    description: "ร้องเรียนเรื่องพนักงาน",
    status: "เปิดใช้งาน",
  },
  {
    id: "eth_supplier",
    code: "1.1.4",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "คู่ค้า (Supplier)",
    description: "ร้องเรียนเรื่องคู่ค้า",
    status: "เปิดใช้งาน",
  },
  {
    id: "eth_creditor",
    code: "1.1.5",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "เจ้าหนี้ (Creditor)",
    description: "ร้องเรียนเรื่องเจ้าหนี้",
    status: "เปิดใช้งาน",
  },
  {
    id: "eth_other",
    code: "1.1.6",
    formTypeId: "ethics",
    category: getCategoryName("ethics"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านการปฏิบัติต่อผู้มีส่วนได้เสีย",
    status: "เปิดใช้งาน",
  },

  // ========== 1.2 ฟอร์มจรรยาบรรณทางธุรกิจ (6 subcategories) ==========
  {
    id: "be_disclosure",
    code: "1.2.1",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "การเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต",
    description:
      "ร้องเรียนเรื่องการเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต",
    status: "เปิดใช้งาน",
  },
  {
    id: "be_gift",
    code: "1.2.2",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "การรับของขวัญหรือผลประโยชน์เกินสมควร",
    description: "ร้องเรียนเรื่องการรับของขวัญหรือผลประโยชน์เกินสมควร",
    status: "เปิดใช้งาน",
  },
  {
    id: "be_conflict",
    code: "1.2.3",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "การมีผลประโยชน์ทับซ้อน",
    description: "ร้องเรียนเรื่องการมีผลประโยชน์ทับซ้อน",
    status: "เปิดใช้งาน",
  },
  {
    id: "be_abuse",
    code: "1.2.4",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "การใช้อำนาจในทางที่ไม่เหมาะสม",
    description: "ร้องเรียนเรื่องการใช้อำนาจในทางที่ไม่เหมาะสม",
    status: "เปิดใช้งาน",
  },
  {
    id: "be_violation",
    code: "1.2.5",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "การไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ",
    description: "ร้องเรียนเรื่องการไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ",
    status: "เปิดใช้งาน",
  },
  {
    id: "be_other",
    code: "1.2.6",
    formTypeId: "business_ethics",
    category: getCategoryName("business_ethics"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านจรรยาบรรณทางธุรกิจ",
    status: "เปิดใช้งาน",
  },

  // ========== 2.1 ฟอร์มการทุจริต (7 subcategories) ==========
  {
    id: "fr_embezzlement",
    code: "2.1.1",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "ยักยอกทรัพย์",
    description: "ร้องเรียนเรื่องยักยอกทรัพย์",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_forgery",
    code: "2.1.2",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "ปลอมแปลงเอกสารหรือข้อมูล",
    description: "ร้องเรียนเรื่องปลอมแปลงเอกสารหรือข้อมูล",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_bribery",
    code: "2.1.3",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "เรียกรับสินบน",
    description: "ร้องเรียนเรื่องการเรียกรับสินบน",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_procurement",
    code: "2.1.4",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "ทุจริตในการจัดซื้อจัดจ้าง",
    description: "ร้องเรียนเรื่องทุจริตในการจัดซื้อจัดจ้าง",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_expense",
    code: "2.1.5",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "เบิกค่าใช้จ่ายเท็จ",
    description: "ร้องเรียนเรื่องการเบิกค่าใช้จ่ายเท็จ",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_logistics",
    code: "2.1.6",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "ทุจริตในส่วนงานขนส่ง",
    description: "ร้องเรียนเรื่องทุจริตในส่วนงานขนส่ง",
    status: "เปิดใช้งาน",
  },
  {
    id: "fr_other",
    code: "2.1.7",
    formTypeId: "fraud",
    category: getCategoryName("fraud"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านการทุจริต",
    status: "เปิดใช้งาน",
  },

  // ========== 3.1 ฟอร์มพฤติกรรมพนักงาน (6 subcategories) ==========
  {
    id: "ec_rude",
    code: "3.1.1",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "พูดจาไม่สุภาพกับลูกค้า",
    description: "ร้องเรียนเรื่องพูดจาไม่สุภาพกับลูกค้า",
    status: "เปิดใช้งาน",
  },
  {
    id: "ec_absent",
    code: "3.1.2",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "มาทำงานสาย/ขาดงานบ่อย",
    description: "ร้องเรียนเรื่องมาทำงานสาย/ขาดงานบ่อย",
    status: "เปิดใช้งาน",
  },
  {
    id: "ec_disobey",
    code: "3.1.3",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "ไม่ปฏิบัติตามคำสั่งงาน",
    description: "ร้องเรียนเรื่องไม่ปฏิบัติตามคำสั่งงาน",
    status: "เปิดใช้งาน",
  },
  {
    id: "ec_conflict",
    code: "3.1.4",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "กลั่นแกล้งหรือสร้างความขัดแย้งในทีม",
    description: "ร้องเรียนเรื่องกลั่นแกล้งหรือสร้างความขัดแย้งในทีม",
    status: "เปิดใช้งาน",
  },
  {
    id: "ec_private",
    code: "3.1.5",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "ใช้เวลางานทำเรื่องส่วนตัวมากเกินไป",
    description: "ร้องเรียนเรื่องใช้เวลางานทำเรื่องส่วนตัวมากเกินไป",
    status: "เปิดใช้งาน",
  },
  {
    id: "ec_other",
    code: "3.1.6",
    formTypeId: "employee_conduct",
    category: getCategoryName("employee_conduct"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านพฤติกรรมพนักงาน",
    status: "เปิดใช้งาน",
  },

  // ========== 4.1 ฟอร์มผลิตภัณฑ์และบริการ (6 subcategories) ==========
  {
    id: "ps_defective",
    code: "4.1.1",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
    description: "ร้องเรียนเรื่องสินค้าชำรุดหรือไม่ได้มาตรฐาน",
    status: "เปิดใช้งาน",
  },
  {
    id: "ps_delay",
    code: "4.1.2",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "ส่งมอบล่าช้า",
    description: "ร้องเรียนเรื่องส่งมอบล่าช้า",
    status: "เปิดใช้งาน",
  },
  {
    id: "ps_info",
    code: "4.1.3",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "ให้ข้อมูลสินค้า/บริการไม่ครบถ้วน",
    description: "ร้องเรียนเรื่องให้ข้อมูลสินค้า/บริการไม่ครบถ้วน",
    status: "เปิดใช้งาน",
  },
  {
    id: "ps_warranty",
    code: "4.1.4",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "การรับประกันไม่เป็นไปตามที่แจ้ง",
    description: "ร้องเรียนเรื่องการรับประกันไม่เป็นไปตามที่แจ้ง",
    status: "เปิดใช้งาน",
  },
  {
    id: "ps_service",
    code: "4.1.5",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "การให้บริการไม่ตรงตามที่ตกลง (ได้รับสินค้าไม่ตรงสเปคตามสัญญาซื้อขาย)",
    description: "ร้องเรียนเรื่องการให้บริการไม่ตรงตามที่ตกลง",
    status: "เปิดใช้งาน",
  },
  {
    id: "ps_other",
    code: "4.1.6",
    formTypeId: "product_service",
    category: getCategoryName("product_service"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านผลิตภัณฑ์และบริการ",
    status: "เปิดใช้งาน",
  },

  // ========== 5.1 ฟอร์มความปลอดภัย (7 subcategories) ==========
  {
    id: "sf_ppe",
    code: "5.1.1",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "ไม่สวมอุปกรณ์ป้องกัน (PPE)",
    description: "ร้องเรียนเรื่องไม่สวมอุปกรณ์ป้องกัน (PPE)",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_hazard",
    code: "5.1.2",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "พื้นที่ทำงานมีความเสี่ยงแต่ไม่แก้ไข",
    description: "ร้องเรียนเรื่องพื้นที่ทำงานมีความเสี่ยงแต่ไม่แก้ไข",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_equipment",
    code: "5.1.3",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "อุปกรณ์ชำรุดแต่ยังใช้งาน",
    description: "ร้องเรียนเรื่องอุปกรณ์ชำรุดแต่ยังใช้งาน",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_emergency",
    code: "5.1.4",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "ไม่มีแผนฉุกเฉินหรือซ้อมอพยพ",
    description: "ร้องเรียนเรื่องไม่มีแผนฉุกเฉินหรือซ้อมอพยพ",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_accident",
    code: "5.1.5",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "เกิดอุบัติเหตุจากการละเลยมาตรการความปลอดภัย",
    description: "ร้องเรียนเรื่องเกิดอุบัติเหตุจากการละเลยมาตรการความปลอดภัย",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_driving",
    code: "5.1.6",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "ขับรถไม่สุภาพ / ขับรถประมาท",
    description: "ร้องเรียนเรื่องขับรถไม่สุภาพ / ขับรถประมาท",
    status: "เปิดใช้งาน",
  },
  {
    id: "sf_other",
    code: "5.1.7",
    formTypeId: "safety",
    category: getCategoryName("safety"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านความปลอดภัย",
    status: "เปิดใช้งาน",
  },

  // ========== 6.1 ฟอร์มสิ่งแวดล้อม (5 subcategories) ==========
  {
    id: "ev_noise",
    code: "6.1.1",
    formTypeId: "environmental",
    category: getCategoryName("environmental"),
    name: "มลพิษด้านเสียง",
    description: "ร้องเรียนเรื่องมลพิษด้านเสียง",
    status: "เปิดใช้งาน",
  },
  {
    id: "ev_water",
    code: "6.1.2",
    formTypeId: "environmental",
    category: getCategoryName("environmental"),
    name: "มลพิษด้านน้ำเสีย",
    description: "ร้องเรียนเรื่องมลพิษด้านน้ำเสีย",
    status: "เปิดใช้งาน",
  },
  {
    id: "ev_air",
    code: "6.1.3",
    formTypeId: "environmental",
    category: getCategoryName("environmental"),
    name: "มลพิษด้านอากาศ (ควัน กลิ่นเหม็น)",
    description: "ร้องเรียนเรื่องมลพิษด้านอากาศ (ควัน กลิ่นเหม็น)",
    status: "เปิดใช้งาน",
  },
  {
    id: "ev_waste",
    code: "6.1.4",
    formTypeId: "environmental",
    category: getCategoryName("environmental"),
    name: "มลพิษด้านกากของเสียอันตรายและกากของเสียไม่อันตราย",
    description:
      "ร้องเรียนเรื่องมลพิษด้านกากของเสียอันตรายและกากของเสียไม่อันตราย",
    status: "เปิดใช้งาน",
  },
  {
    id: "ev_other",
    code: "6.1.5",
    formTypeId: "environmental",
    category: getCategoryName("environmental"),
    name: "อื่นๆ (โปรดระบุ)",
    description: "ร้องเรียนเรื่องอื่นๆ ด้านสิ่งแวดล้อม",
    status: "เปิดใช้งาน",
  },
];

// ============================================================
// SUBCATEGORY OPTIONS (for dropdowns - derived from canonical)
// ============================================================
export { SUBCATEGORY_OPTIONS };

export const SUBCATEGORY_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get subcategory by FormTypeId
 */
export function getSubcategoriesByFormTypeId(
  formTypeId: FormTypeId,
): SubcategoryRow[] {
  return mockSubcategories.filter((s) => s.formTypeId === formTypeId);
}

/**
 * Get subcategory by code
 */
export function getSubcategoryByCode(code: string): SubcategoryRow | undefined {
  return mockSubcategories.find((s) => s.code === code);
}

/**
 * Get total subcategory count
 */
export function getTotalSubcategoryCount(): number {
  return mockSubcategories.length;
}

/**
 * Get active subcategory count
 */
export function getActiveSubcategoryCount(): number {
  return mockSubcategories.filter((s) => s.status === "เปิดใช้งาน").length;
}
