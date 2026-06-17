/**
 * DEPARTMENTS - ฝ่าย/แผนกที่รับผิดชอบเรื่องร้องเรียนตามประเภท
 *
 * Canonical department data used for assignment routing
 */

export type DepartmentCode =
  | "CS" // กลยุทธ์องค์กร
  | "SC" // เลขานุการบริษัท
  | "RP" // จัดซื้อวัตถุดิบ
  | "HR" // ทรัพยากรบุคคล
  | "DSM" // ขายและการตลาดในประเทศ
  | "ISM" // ขายและการตลาดต่างประเทศ
  | "GP" // จัดซื้อทั่วไป
  | "OS" // สำนักงานเลขานุการบริหาร
  | "LG" // โลจิสติกส์
  | "QE" // บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม
  | "FN"; // การเงิน

export type Department = {
  code: DepartmentCode;
  name: string;
  nameEn: string;
};

export const departments: Department[] = [
  { code: "CS", name: "กลยุทธ์องค์กร", nameEn: "Corporate Strategy" },
  { code: "SC", name: "เลขานุการบริษัท", nameEn: "Corporate Secretary" },
  { code: "RP", name: "จัดซื้อวัตถุดิบ", nameEn: "Raw Material Procurement" },
  { code: "HR", name: "ทรัพยากรบุคคล", nameEn: "Human Resources" },
  {
    code: "DSM",
    name: "ขายและการตลาดในประเทศ",
    nameEn: "Domestic Sales & Marketing",
  },
  {
    code: "ISM",
    name: "ขายและการตลาดต่างประเทศ",
    nameEn: "International Sales & Marketing",
  },
  { code: "GP", name: "จัดซื้อทั่วไป", nameEn: "General Procurement" },
  { code: "OS", name: "สำนักงานเลขานุการบริหาร", nameEn: "Board Secretariat" },
  { code: "LG", name: "โลจิสติกส์", nameEn: "Logistics" },
  {
    code: "QE",
    name: "บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม",
    nameEn: "Quality, Safety, Occupational Health & Environment",
  },
  { code: "FN", name: "การเงิน", nameEn: "Finance" },
];

export function getDepartmentByCode(
  code: DepartmentCode,
): Department | undefined {
  return departments.find((d) => d.code === code);
}

export function getDepartmentName(code: DepartmentCode): string {
  return getDepartmentByCode(code)?.name ?? code;
}

export function getDepartmentNameEn(code: DepartmentCode): string {
  return getDepartmentByCode(code)?.nameEn ?? code;
}

/**
 * Mapping ฝ่ายที่รับผิดชอบตามประเภทเรื่องร้องเรียน (form type) และหัวข้อย่อย (subcategory)
 * อ้างอิงตามนโยบายองค์กร
 */
export const DEPARTMENT_ASSIGNMENTS: Record<
  string,
  Record<string, DepartmentCode[]>
> = {
  /**
   * 1. ฟอร์มการปฏิบัติต่อผู้มีส่วนได้เสีย (Stakeholder Engagement Form)
   * Category: ethics (renamed from จริยธรรม → การปฏิบัติต่อผู้มีส่วนได้เสีย)
   */
  ethics: {
    // ผู้ถือหุ้น
    eth_shareholder: ["CS"],
    // ลูกค้า
    eth_customer: ["SC"],
    // พนักงาน
    eth_employee: ["RP"],
    // คู่ค้า
    eth_supplier: ["HR", "CS"],
    // เจ้าหนี้
    eth_creditor: ["DSM", "ISM"],
    // อื่นๆ
    eth_other: ["GP"],
    // fallback
    default: ["CS"],
  },

  /**
   * 2. ฟอร์มจรรยาบรรณทางธุรกิจ (Business Ethics Form)
   */
  business_ethics: {
    // การเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต
    be_disclosure: ["HR"],
    // การรับของขวัญหรือผลประโยชน์เกินสมควร
    be_gift: ["HR", "CS"],
    // การมีผลประโยชน์ทับซ้อน
    be_conflict: ["CS", "HR"],
    // การใช้อำนาจในทางที่ไม่เหมาะสม
    be_abuse: ["CS", "HR"],
    // การไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ
    be_violation: ["CS", "HR"],
    // อื่นๆ
    be_other: ["CS", "HR"],
    // fallback
    default: ["CS", "HR"],
  },

  /**
   * 3. ฟอร์มการทุจริต (Fraud Form)
   */
  fraud: {
    // ยักยอกทรัพย์
    fr_embezzlement: ["HR"],
    // ปลอมแปลงเอกสารหรือข้อมูล
    fr_forgery: ["HR"],
    // เรียกรับสินบน
    fr_bribery: ["HR", "CS"],
    // ทุจริตในการจัดซื้อจัดจ้าง
    fr_procurement: ["CS", "HR", "GP", "FN"],
    // เบิกค่าใช้จ่ายเท็จ
    fr_expense: ["CS", "HR", "FN"],
    // ทุจริตในส่วนงานขนส่ง
    fr_logistics: ["CS", "LG", "HR"],
    // อื่นๆ
    fr_other: ["CS", "HR"],
    // fallback
    default: ["CS", "HR"],
  },

  /**
   * 4. ฟอร์มพฤติกรรมพนักงาน (Employee Conduct Form)
   */
  employee_conduct: {
    // พูดจาไม่สุภาพกับลูกค้า
    ec_rude: ["HR"],
    // มาทำงานสาย/ขาดงานบ่อย
    ec_absent: ["HR"],
    // ไม่ปฏิบัติตามคำสั่งงาน
    ec_disobey: ["HR"],
    // กลั่นแกล้งหรือสร้างความขัดแย้งในทีม
    ec_conflict: ["HR"],
    // ใช้เวลางานทำเรื่องส่วนตัวมากเกินไป
    ec_private: ["HR"],
    // อื่นๆ
    ec_other: ["HR"],
    // fallback
    default: ["HR"],
  },

  /**
   * 5. ฟอร์มผลิตภัณฑ์และบริการ (Product & Service Form)
   */
  product_service: {
    // สินค้าชำรุดหรือไม่ได้มาตรฐาน
    ps_defective: ["DSM", "ISM"],
    // ส่งมอบล่าช้า
    ps_delay: ["DSM", "ISM"],
    // ให้ข้อมูลสินค้า/บริการไม่ครบถ้วน
    ps_info: ["DSM", "ISM"],
    // การให้บริการไม่ตรงตามที่ตกลง
    ps_service: ["DSM", "ISM"],
    // อื่นๆ
    ps_other: ["DSM", "ISM"],
    // fallback
    default: ["DSM", "ISM"],
  },

  /**
   * 6. ฟอร์มความปลอดภัย (Safety Form)
   */
  safety: {
    // ไม่สวมอุปกรณ์ป้องกัน (PPE)
    sf_ppe: ["QE"],
    // พื้นที่ทำงานมีความเสี่ยงแต่ไม่แก้ไข
    sf_hazard: ["QE"],
    // อุปกรณ์ชำรุดแต่ยังใช้งาน
    sf_equipment: ["QE"],
    // เกิดอุบัติเหตุจากการละเลยมาตรการความปลอดภัย
    sf_accident: ["LG", "QE"],
    // อื่นๆ
    sf_other: ["QE"],
    // fallback
    default: ["QE"],
  },

  /**
   * 7. ฟอร์มสิ่งแวดล้อม (Environmental Form)
   */
  environmental: {
    // มลพิษด้านเสียง
    ev_noise: ["QE", "OS"],
    // มลพิษด้านน้ำเสีย
    ev_water: ["QE", "OS"],
    // มลพิษด้านอากาศ (ควัน,กลิ่นเหม็น)
    ev_air: ["QE", "OS"],
    // มลพิษด้านกากของเสียอันตรายและกากของเสียไม่อันตราย
    ev_waste: ["LG", "QE"],
    // อื่นๆ
    ev_other: ["QE"],
    // fallback
    default: ["QE", "OS"],
  },
};

/**
 * ดึงรายชื่อฝ่ายที่รับผิดชอบสำหรับประเภทเรื่องร้องเรียนและหัวข้อย่อย
 */
export function getAssigningDepartments(
  formTypeId: string,
  subcategoryId: string,
): DepartmentCode[] {
  const formAssignments = DEPARTMENT_ASSIGNMENTS[formTypeId];
  if (!formAssignments) return [];

  // ลองหา exact match
  if (formAssignments[subcategoryId]) {
    return formAssignments[subcategoryId];
  }

  // ลองหา prefix match (เช่น eth_customer จาก eth_)
  const prefix = subcategoryId.split("_")[0] + "_";
  for (const [key, depts] of Object.entries(formAssignments)) {
    if (key.startsWith(prefix) && key !== "default") {
      return depts;
    }
  }

  // fallback to default
  return formAssignments["default"] ?? [];
}

/**
 * ดึงรายชื่อฝ่ายทั้งหมดสำหรับ form type (ไม่รวม default)
 */
export function getDepartmentsForFormType(
  formTypeId: string,
): DepartmentCode[] {
  const formAssignments = DEPARTMENT_ASSIGNMENTS[formTypeId];
  if (!formAssignments) return [];

  const codes = new Set<DepartmentCode>();
  for (const [key, depts] of Object.entries(formAssignments)) {
    if (key !== "default") {
      depts.forEach((d) => codes.add(d));
    }
  }
  return Array.from(codes);
}
