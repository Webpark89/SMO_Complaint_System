// FormTypeId is now imported from the canonical source (master-data/enums.ts)
// and re-exported here for backward compatibility with existing import paths
import type { FormTypeId } from "../master-data/enums";
export type { FormTypeId } from "../master-data/enums";

export type SubCategory = {
  id: string;
  code: string;
  name: string; // Thai name
  nameEn?: string; // English name (Added for i18n support)
  formTypeId: FormTypeId;
};

export type ComplaintType = {
  id: FormTypeId;
  code: string;
  name: string; // Thai name
  nameEn?: string; // English name (Added for i18n support)
  description: string;
  hasWitnessField: boolean;
  subcategories: SubCategory[];
};

export const complaintTypes: ComplaintType[] = [
  {
    id: "ethics",
    code: "1.1",
    name: "การปฏิบัติต่อผู้มีส่วนได้เสีย (จรรยาบรรณทางธุรกิจ)",
    nameEn: "Stakeholder Treatment Form (Business Ethics)",
    description: "เรื่องร้องเรียนด้านการปฏิบัติต่อผู้มีส่วนได้เสีย",
    hasWitnessField: false,
    subcategories: [
      {
        id: "eth_shareholder",
        code: "1.1.1",
        name: "ผู้ถือหุ้น",
        nameEn: "Shareholders",
        formTypeId: "ethics",
      },
      {
        id: "eth_customer",
        code: "1.1.2",
        name: "ลูกค้า",
        nameEn: "Customers",
        formTypeId: "ethics",
      },
      {
        id: "eth_employee",
        code: "1.1.3",
        name: "พนักงาน",
        nameEn: "Employees",
        formTypeId: "ethics",
      },
      {
        id: "eth_supplier",
        code: "1.1.4",
        name: "คู่ค้า",
        nameEn: "Business Partners / Suppliers",
        formTypeId: "ethics",
      },
      {
        id: "eth_creditor",
        code: "1.1.5",
        name: "เจ้าหนี้",
        nameEn: "Creditors",
        formTypeId: "ethics",
      },
      {
        id: "eth_export",
        code: "1.1.6",
        name: "ลูกค้า (ลูกค้าที่ซื้อสินค้าส่งออกเป็นหลัก)",
        nameEn: "Customers (Primarily Export Customers)",
        formTypeId: "ethics",
      },

      {
        id: "eth_outsource",
        code: "1.1.7",
        name: "คู่ค้า (Outsource เช่น ท่าเรือ เซอร์เวย์ ชิปปิ้ง)",
        nameEn:
          "Business Partners (Outsourced Service Providers, e.g., Ports, Surveyors, Shipping Agents)",
        formTypeId: "ethics",
      },
      {
        id: "eth_other",
        code: "1.1.8",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "ethics",
      },
    ],
  },

  {
    id: "business_ethics",
    code: "1.2",
    name: "จรรยาบรรณทางธุรกิจ",
    nameEn: "Business Ethics Form",
    description: "เรื่องร้องเรียนด้านจรรยาบรรณทางธุรกิจ",
    hasWitnessField: false,
    subcategories: [
      {
        id: "be_disclosure",
        code: "1.2.1",
        name: "การเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต",
        nameEn: "Unauthorized disclosure of confidential company information",
        formTypeId: "business_ethics",
      },
      {
        id: "be_gift",
        code: "1.2.2",
        name: "การรับของขวัญหรือผลประโยชน์เกินสมควร",
        nameEn:
          "Accepting gifts or benefits beyond what is considered appropriate",
        formTypeId: "business_ethics",
      },
      {
        id: "be_conflict",
        code: "1.2.3",
        name: "การมีผลปะโยชน์ทับซ้อน การขัดแย้งทางผลประโยชน์",
        nameEn: "Conflict of Interest and Competing Interests",
        formTypeId: "business_ethics",
      },
      {
        id: "be_abuse",
        code: "1.2.4",
        name: "การใช้อำนาจในทางที่ไม่เหมาะสม",
        nameEn: "Abuse or misuse of authority",
        formTypeId: "business_ethics",
      },
      {
        id: "be_insider",
        code: "1.2.5",
        name: "การใช้ข้อมูลภายใน",
        nameEn: "Use of Insider Information",
        formTypeId: "business_ethics",
      },
      {
        id: "be_corruption",
        code: "1.2.6",
        name: "การต่อต้านคอร์รัปชัน เช่น การให้ของขวัญ การบริจาคเพื่อการกุศล การมีส่วนร่วมทางการเมือง",
        nameEn:
          "Anti-Corruption (e.g., Gifts and Hospitality, Charitable Donations, Political Contributions)",
        formTypeId: "business_ethics",
      },
      {
        id: "be_violation",
        code: "1.2.7",
        name: "การไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ",
        nameEn:
          "Failure to comply with professional ethics and codes of conduct",
        formTypeId: "business_ethics",
      },
      {
        id: "be_other",
        code: "1.2.8",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "business_ethics",
      },
    ],
  },

  {
    id: "fraud",
    code: "2.1",
    name: "การทุจริต",
    nameEn: "Fraud Reporting Form",
    description: "เรื่องร้องเรียนด้านการทุจริต",
    hasWitnessField: true,
    subcategories: [
      {
        id: "fr_embezzlement",
        code: "2.1.1",
        name: "ยักยอกทรัพย์",
        nameEn: "Asset misappropriation / embezzlement",
        formTypeId: "fraud",
      },
      {
        id: "fr_forgery",
        code: "2.1.2",
        name: "ปลอมแปลงเอกสารหรือข้อมูล",
        nameEn: "Forgery of documents or falsification of information",
        formTypeId: "fraud",
      },
      {
        id: "fr_bribery",
        code: "2.1.3",
        name: "เรียกรับสินบน",
        nameEn: "Bribery and solicitation of kickbacks",
        formTypeId: "fraud",
      },
      {
        id: "fr_procurement",
        code: "2.1.4",
        name: "ทุจริตในการจัดซื้อจัดจ้าง",
        nameEn: "Fraud in procurement and purchasing processes",
        formTypeId: "fraud",
      },
      {
        id: "fr_expense",
        code: "2.1.5",
        name: "เบิกค่าใช้จ่ายเท็จ",
        nameEn: "False expense reimbursement claims",
        formTypeId: "fraud",
      },
      {
        id: "fr_logistics",
        code: "2.1.6",
        name: "ทุจริตในส่วนงานขนส่ง",
        nameEn: "Fraud within transportation operations",
        formTypeId: "fraud",
      },
      {
        id: "fr_corruption",
        code: "2.1.7",
        name: "คอร์รัปชั่น",
        nameEn: "Corruption",
        formTypeId: "fraud",
      },
      {
        id: "fr_financial",
        code: "2.1.8",
        name: "ตกแต่งงบการเงิน",
        nameEn: "Financial Statement Manipulation",
        formTypeId: "fraud",
      },
      {
        id: "fr_other",
        code: "2.1.9",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "fraud",
      },
    ],
  },

  {
    id: "employee_conduct",
    code: "3.1",
    name: "พฤติกรรมพนักงาน",
    nameEn: "Employee Conduct Form",
    description: "เรื่องร้องเรียนด้านพฤติกรรมพนักงาน",
    hasWitnessField: false,
    subcategories: [
      {
        id: "ec_rude",
        code: "3.1.1",
        name: "พูดจาไม่สุภาพกับลูกค้า",
        nameEn: "Using inappropriate or disrespectful language with customers",
        formTypeId: "employee_conduct",
      },
      {
        id: "ec_absent",
        code: "3.1.2",
        name: "มาทำงานสาย/ขาดงานบ่อย",
        nameEn: "Frequent tardiness or absenteeism",
        formTypeId: "employee_conduct",
      },
      {
        id: "ec_disobey",
        code: "3.1.3",
        name: "ไม่ปฏิบัติตามคำสั่งงาน",
        nameEn: "Failure to comply with assigned duties or work instructions",
        formTypeId: "employee_conduct",
      },
      {
        id: "ec_conflict",
        code: "3.1.4",
        name: "กลั่นแกล้งหรือสร้างความขัดแย้งในทีม",
        nameEn: "Bullying or creating conflicts within the team",
        formTypeId: "employee_conduct",
      },
      {
        id: "ec_private",
        code: "3.1.5",
        name: "ใช้เวลางานทำเรื่องส่วนตัวมากเกินไป",
        nameEn: "Excessive use of working hours for personal matters",
        formTypeId: "employee_conduct",
      },
      {
        id: "ec_other",
        code: "3.1.6",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "employee_conduct",
      },
    ],
  },

  {
    id: "product_service",
    code: "4.1",
    name: "ผลิตภัณฑ์และบริการ",
    nameEn: "Product and Service Form",
    description: "เรื่องร้องเรียนด้านผลิตภัณฑ์และบริการ",
    hasWitnessField: false,
    subcategories: [
      {
        id: "ps_defective",
        code: "4.1.1",
        name: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
        nameEn: "Defective or substandard products",
        formTypeId: "product_service",
      },
      {
        id: "ps_delay",
        code: "4.1.2",
        name: "ส่งมอบล่าช้า",
        nameEn: "Delayed delivery of products or services",
        formTypeId: "product_service",
      },
      {
        id: "ps_info",
        code: "4.1.3",
        name: "ให้ข้อมูลสินค้า/บริการไม่ครบถ้วน",
        nameEn: "Incomplete or misleading product/service information",
        formTypeId: "product_service",
      },
      {
        id: "ps_warranty",
        code: "4.1.4",
        name: "การรับประกันไม่เป็นไปตามที่แจ้ง",
        nameEn: "Warranty claims not honored as stated",
        formTypeId: "product_service",
      },
      {
        id: "ps_service",
        code: "4.1.5",
        name: "การให้บริการไม่ตรงตามที่ตกลง (ได้รับสินค้าไม่ตรงสเปคตามสัญญาซื้อขาย)",
        nameEn: "Failure to provide services as agreed",
        formTypeId: "product_service",
      },
      {
        id: "ps_other",
        code: "4.1.6",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "product_service",
      },
    ],
  },

  {
    id: "safety",
    code: "5.1",
    name: "ความปลอดภัย",
    nameEn: "Safety Form",
    description: "เรื่องร้องเรียนด้านความปลอดภัย",
    hasWitnessField: false,
    subcategories: [
      {
        id: "sf_ppe",
        code: "5.1.1",
        name: "ไม่สวมอุปกรณ์ป้องกัน (PPE)",
        nameEn: "Failure to wear required Personal Protective Equipment (PPE)",
        formTypeId: "safety",
      },
      {
        id: "sf_hazard",
        code: "5.1.2",
        name: "พื้นที่ทำงานมีความเสี่ยงแต่ไม่แก้ไข",
        nameEn: "Failure to address identified workplace hazards",
        formTypeId: "safety",
      },
      {
        id: "sf_equipment",
        code: "5.1.3",
        name: "อุปกรณ์ชำรุดแต่ยังใช้งาน",
        nameEn: "Continued use of damaged or defective equipment",
        formTypeId: "safety",
      },
      {
        id: "sf_emergency",
        code: "5.1.4",
        name: "ไม่มีแผนฉุกเฉินหรือซ้อมอพยพ",
        nameEn: "Lack of emergency plans or evacuation drills", // Added translation
        formTypeId: "safety",
      },
      {
        id: "sf_accident",
        code: "5.1.5",
        name: "เกิดอุบัติเหตุจากการละเลยมาตรการความปลอดภัย",
        nameEn:
          "Accidents caused by negligence in complying with safety measures",
        formTypeId: "safety",
      },
      {
        id: "sf_driving",
        code: "5.1.6",
        name: "ขับรถไม่สุภาพ / ขับรถประมาท",
        nameEn: "Reckless or inappropriate driving",
        formTypeId: "safety",
      },
      {
        id: "sf_other",
        code: "5.1.7",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "safety",
      },
    ],
  },
  {
    id: "environmental",
    code: "6.1",
    name: "ด้านสิ่งแวดล้อม",
    nameEn: "Environmental Form",
    description: "เรื่องร้องเรียนด้านสิ่งแวดล้อม",
    hasWitnessField: true,
    subcategories: [
      {
        id: "ev_noise",
        code: "6.1.1",
        name: "มลพิษด้านเสียง",
        nameEn: "Noise pollution",
        formTypeId: "environmental",
      },
      {
        id: "ev_water",
        code: "6.1.2",
        name: "มลพิษด้านน้ำเสีย",
        nameEn: "Water pollution / wastewater issues",
        formTypeId: "environmental",
      },
      {
        id: "ev_air",
        code: "6.1.3",
        name: "มลพิษด้านอากาศ (ควัน กลิ่นเหม็น)",
        nameEn: "Air pollution (e.g., smoke, dust, unpleasant odors)",
        formTypeId: "environmental",
      },
      {
        id: "ev_waste",
        code: "6.1.4",
        name: "มลพิษด้านกากของเสียอันตรายและกากของเสียไม่อันตราย",
        nameEn: "Improper management of hazardous and non-hazardous waste",
        formTypeId: "environmental",
      },
      {
        id: "ev_other",
        code: "6.1.5",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (additional categories can be added as required)",
        formTypeId: "environmental",
      },
    ],
  },
  {
    id: "financial",
    code: "7.1",
    name: "ด้านการเงิน",
    nameEn: "Financial Matters",
    description: "เรื่องร้องเรียนด้านการเงิน",
    hasWitnessField: true,
    subcategories: [
      {
        id: "fn_payment_delay",
        code: "7.1.1",
        name: "การชำระเงินล่าช้า ไม่ตรงตามกำหนด / ผิดพลาด",
        nameEn: "Late, Incorrect, or Delayed Payments",
        formTypeId: "financial",
      },
      {
        id: "fn_other",
        code: "7.1.2",
        name: "อื่นๆ (โปรดระบุ)",
        nameEn: "Others (Please Specify)",
        formTypeId: "financial",
      },
    ],
  },
];

// Helper functions updated to support i18n conditionally
export function getFormTypeName(
  formTypeId: FormTypeId,
  locale: "th" | "en" = "th",
): string {
  const form = complaintTypes.find((x) => x.id === formTypeId);
  if (!form) return formTypeId;
  return locale === "en" && form.nameEn ? form.nameEn : form.name;
}

export function getSubcategoryName(
  formTypeId: FormTypeId,
  subcategoryId: string,
  locale: "th" | "en" = "th",
): string {
  const form = complaintTypes.find((x) => x.id === formTypeId);
  const sub = form?.subcategories.find((x) => x.id === subcategoryId);
  if (!sub) return subcategoryId;
  return locale === "en" && sub.nameEn ? sub.nameEn : sub.name;
}

export function getSubcategories(formTypeId: FormTypeId): SubCategory[] {
  return complaintTypes.find((x) => x.id === formTypeId)?.subcategories ?? [];
}

export function hasWitnessField(formTypeId: FormTypeId): boolean {
  return (
    complaintTypes.find((x) => x.id === formTypeId)?.hasWitnessField ?? false
  );
}

export function getFormTypeById(id: string): ComplaintType | undefined {
  return complaintTypes.find((x) => x.id === id);
}
