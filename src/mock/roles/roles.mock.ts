export type RoleStatus = "เปิดใช้งาน" | "ปิดใช้งาน";

export type RoleRow = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: RoleStatus;
};

export const ROLE_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ปิดใช้งาน", label: "ปิดใช้งาน" },
];

export interface PermissionAction {
  value: string;
  label: string;
  description: string;
}

export interface PagePermission {
  id: string;
  name: string;
  actions: PermissionAction[];
}

export interface CategoryPermission {
  category: string;
  pages: PagePermission[];
}

export const ALL_PERMISSIONS: CategoryPermission[] = [
  {
    category: "จัดการเรื่องร้องเรียน",
    pages: [
      {
        id: "complaint_list",
        name: "รายการเรื่องร้องเรียน",
        actions: [
          { value: "complaint_list:view", label: "ดูรายการ", description: "เข้าใช้งานและดูรายการเรื่องร้องเรียนทั้งหมด" },
          { value: "complaint_list:edit", label: "แก้ไข", description: "แก้ไขรายละเอียดและสถานะเบื้องต้นของเรื่องร้องเรียน" },
          { value: "complaint_list:delete", label: "ลบ", description: "ลบเรื่องร้องเรียนออกจากระบบ" },
        ],
      },
      {
        id: "complaint_intake",
        name: "รับเรื่องร้องเรียน",
        actions: [
          { value: "complaint_intake:view", label: "ดูหน้าจอ", description: "เข้าใช้งานหน้าจอรับเรื่องร้องเรียน" },
          { value: "complaint_intake:create", label: "รับเรื่อง", description: "บันทึกเรื่องร้องเรียนใหม่เข้าระบบ" },
        ],
      },
      {
        id: "complaint_assignment",
        name: "มอบหมายและประสานงาน",
        actions: [
          { value: "complaint_assignment:view", label: "ดูหน้าจอ", description: "เข้าใช้งานหน้าจอมอบหมายและประสานงาน" },
          { value: "complaint_assignment:create", label: "เพิ่มงานมอบหมาย", description: "สร้างงานมอบหมายเรื่องร้องเรียนใหม่" },
          { value: "complaint_assignment:assign", label: "มอบหมายงาน", description: "มอบหมายงานให้กับผู้ตรวจสอบหรือหน่วยงานที่เกี่ยวข้อง" },
          { value: "complaint_assignment:edit", label: "แก้ไข", description: "แก้ไขข้อมูลการมอบหมายงาน" },
          { value: "complaint_assignment:delete", label: "ลบ", description: "ลบงานมอบหมายออกจากระบบ" },
        ],
      },
      {
        id: "complaint_investigation",
        name: "ตรวจสอบและสอบสวน",
        actions: [
          { value: "complaint_investigation:view", label: "ดูหน้าจอ", description: "เข้าใช้งานหน้าจอตรวจสอบและสอบสวน" },
          { value: "complaint_investigation:create", label: "เพิ่มงานสืบสวน", description: "เพิ่มประวัติงานสืบสวนข้อเท็จจริงใหม่" },
          { value: "complaint_investigation:investigate", label: "บันทึกการสอบสวน", description: "บันทึกผลการตรวจสอบ ข้อเท็จจริง และความเห็นการสอบสวน" },
          { value: "complaint_investigation:edit", label: "แก้ไข", description: "แก้ไขรายงานผลและรายละเอียดการสืบสวน" },
          { value: "complaint_investigation:delete", label: "ลบ", description: "ลบงานสืบสวนสอบสวนออกจากระบบ" },
        ],
      },
      {
        id: "complaint_approval",
        name: "อนุมัติผลการสอบสวน",
        actions: [
          { value: "complaint_approval:view", label: "ดูหน้าจอ", description: "เข้าใช้งานหน้าจออนุมัติผลการสอบสวน" },
          { value: "complaint_approval:approve", label: "อนุมัติผล", description: "อนุมัติหรือส่งกลับแก้ไขรายงานผลการสอบสวน" },
          { value: "complaint_approval:edit", label: "แก้ไข", description: "แก้ไขรายการขออนุมัติผลการสอบสวน" },
          { value: "complaint_approval:delete", label: "ลบ", description: "ลบรายงานขออนุมัติผลออกจากระบบ" },
        ],
      },
      {
        id: "complaint_extension",
        name: "ขยายระยะเวลาดำเนินการ",
        actions: [
          { value: "complaint_extension:view", label: "ดูหน้าจอ", description: "เข้าใช้งานหน้าจอขอขยายระยะเวลาดำเนินการ" },
          { value: "complaint_extension:create", label: "ขอขยายเวลา", description: "ยื่นเรื่องคำขอขยายเวลาดำเนินการใหม่" },
          { value: "complaint_extension:edit", label: "แก้ไข", description: "แก้ไขข้อมูลคำขอขยายระยะเวลาดำเนินการ" },
          { value: "complaint_extension:delete", label: "ลบ", description: "ลบคำขอขยายระยะเวลาออกจากระบบ" },
          { value: "complaint_extension:approve", label: "อนุมัติขอขยายเวลา", description: "อนุมัติหรือปฏิเสธคำขอขยายระยะเวลาดำเนินการเรื่องร้องเรียน" },
        ],
      },
      {
        id: "sensitive_cases",
        name: "เรื่องร้องเรียนข้อมูลอ่อนไหว",
        actions: [
          { value: "sensitive_cases:view", label: "เข้าถึงข้อมูลอ่อนไหว", description: "เข้าถึงและดูเรื่องร้องเรียนประเภทที่เป็นข้อมูลอ่อนไหวสูง" },
        ],
      },
      {
        id: "documents_evidence",
        name: "เอกสารและหลักฐาน",
        actions: [
          { value: "documents_evidence:view", label: "ดูเอกสาร", description: "เข้าดูรายการและดาวน์โหลดเอกสารหลักฐานของเรื่องร้องเรียน" },
          { value: "documents_evidence:upload", label: "อัปโหลด", description: "อัปโหลดเอกสารหลักฐานเพิ่มเติมเข้าระบบ" },
          { value: "documents_evidence:edit", label: "แก้ไข", description: "แก้ไขชื่อเอกสารและประเภทเอกสารแนบ" },
          { value: "documents_evidence:delete", label: "ลบ", description: "ลบเอกสารหลักฐานออกจากเรื่องร้องเรียน" },
        ],
      },
    ],
  },
  {
    category: "รายงาน",
    pages: [
      {
        id: "report_summary",
        name: "รายงานสรุปเรื่องร้องเรียน",
        actions: [
          { value: "report_summary:view", label: "ดูรายงาน", description: "เข้าดูรายงานสรุปสถิติจำนวนเรื่องร้องเรียน" },
          { value: "report_summary:export", label: "ส่งออกรายงาน", description: "ดาวน์โหลดรายงานสรุปในรูปแบบ Excel หรือ PDF" },
        ],
      },
      {
        id: "report_sla",
        name: "รายงาน SLA",
        actions: [
          { value: "report_sla:view", label: "ดูรายงาน", description: "เข้าดูรายงานการดำเนินการตามดัชนีชี้วัด SLA" },
          { value: "report_sla:export", label: "ส่งออกรายงาน", description: "ดาวน์โหลดรายงาน SLA ในรูปแบบ Excel หรือ PDF" },
        ],
      },
      {
        id: "report_investigation",
        name: "รายงานผลการสอบสวน",
        actions: [
          { value: "report_investigation:view", label: "ดูรายงาน", description: "เข้าดูรายงานสรุปผลการตรวจสอบและสอบสวน" },
          { value: "report_investigation:export", label: "ส่งออกรายงาน", description: "ดาวน์โหลดรายงานผลสอบสวนในรูปแบบ Excel หรือ PDF" },
        ],
      },
      {
        id: "report_executive",
        name: "รายงานสำหรับผู้บริหาร",
        actions: [
          { value: "report_executive:view", label: "ดูรายงาน", description: "เข้าดูรายงานสรุปวิเคราะห์ข้อมูลระดับผู้บริหาร" },
          { value: "report_executive:export", label: "ส่งออกรายงาน", description: "ดาวน์โหลดรายงานสำหรับผู้บริหาร" },
        ],
      },
      {
        id: "report_audit_log",
        name: "รายงาน Audit Log",
        actions: [
          { value: "report_audit_log:view", label: "ดูรายงาน", description: "เข้าดูรายงานสรุปประวัติการทำรายการในระบบทั้งหมด" },
          { value: "report_audit_log:export", label: "ส่งออกรายงาน", description: "ส่งออกไฟล์ประวัติการทำรายการออกภายนอก" },
        ],
      },
    ],
  },
  {
    category: "ตั้งค่าระบบ",
    pages: [
      {
        id: "users",
        name: "ผู้ใช้งาน",
        actions: [
          { value: "users:view", label: "ดูข้อมูล", description: "เข้าดูรายละเอียดผู้ใช้งานระบบทั้งหมด" },
          { value: "users:create", label: "เพิ่มผู้ใช้งาน", description: "ลงทะเบียนเพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ" },
          { value: "users:edit", label: "แก้ไขข้อมูล", description: "แก้ไขข้อมูลและสถานะการใช้งานของผู้ใช้" },
          { value: "users:delete", label: "ลบ/ระงับ", description: "ลบผู้ใช้หรือระงับการใช้งานในระบบ" },
        ],
      },
      {
        id: "roles_permissions",
        name: "สิทธิ์การใช้งาน",
        actions: [
          { value: "roles_permissions:view", label: "ดูข้อมูล", description: "ดูรายชื่อบทบาทและสิทธิ์ที่กำหนดในระบบ" },
          { value: "roles_permissions:create", label: "เพิ่มบทบาท", description: "สร้างบทบาทใหม่และกำหนดสิทธิ์ระดับหน้าจอ" },
          { value: "roles_permissions:edit", label: "แก้ไขสิทธิ์", description: "ปรับเปลี่ยนสิทธิ์ของบทบาทการใช้งานที่มีอยู่" },
          { value: "roles_permissions:delete", label: "ลบบทบาท", description: "ลบบทบาทการใช้งานออกจากระบบ" },
        ],
      },
      {
        id: "categories",
        name: "หัวข้อหลักเรื่องร้องเรียน",
        actions: [
          { value: "categories:view", label: "ดูข้อมูล", description: "ดูรายการหัวข้อร้องเรียนหลักทั้งหมด" },
          { value: "categories:create", label: "เพิ่มหัวข้อหลัก", description: "เพิ่มรายการหัวข้อร้องเรียนหลักใหม่" },
          { value: "categories:edit", label: "แก้ไข", description: "แก้ไขหัวข้อร้องเรียนหลักที่มีอยู่" },
          { value: "categories:delete", label: "ลบ", description: "ลบหัวข้อร้องเรียนหลักออกจากระบบ" },
        ],
      },
      {
        id: "subcategories",
        name: "หัวข้อย่อยเรื่องร้องเรียน",
        actions: [
          { value: "subcategories:view", label: "ดูข้อมูล", description: "ดูรายการหัวข้อร้องเรียนย่อยทั้งหมด" },
          { value: "subcategories:create", label: "เพิ่มหัวข้อย่อย", description: "เพิ่มรายการหัวข้อร้องเรียนย่อยใหม่" },
          { value: "subcategories:edit", label: "แก้ไข", description: "แก้ไขหัวข้อร้องเรียนย่อยที่มีอยู่" },
          { value: "subcategories:delete", label: "ลบ", description: "ลบหัวข้อร้องเรียนย่อยออกจากระบบ" },
        ],
      },
      {
        id: "forms",
        name: "แบบฟอร์มร้องเรียน",
        actions: [
          { value: "forms:view", label: "ดูข้อมูล", description: "ดูรายการแบบฟอร์มของแต่ละประเภทเรื่องร้องเรียน" },
          { value: "forms:create", label: "เพิ่มแบบฟอร์ม", description: "สร้างและเพิ่มแบบฟอร์มรับเรื่องร้องเรียนใหม่" },
          { value: "forms:edit", label: "แก้ไข", description: "สร้าง แก้ไข หรือตั้งค่าฟิลด์ข้อมูลในแบบฟอร์ม" },
          { value: "forms:delete", label: "ลบ", description: "ลบแบบฟอร์มรับเรื่องร้องเรียนออกจากระบบ" },
        ],
      },
      {
        id: "termandprivacy",
        name: "เงื่อนไขดำเนินการ",
        actions: [
          { value: "termandprivacy:view", label: "ดูข้อมูล", description: "ดูข้อมูลข้อกำหนด ความเป็นส่วนตัว และเงื่อนไขการรับเรื่อง" },
          { value: "termandprivacy:edit", label: "แก้ไข/จัดการ", description: "ปรับปรุงแก้ไขเนื้อหาข้อตกลงและเงื่อนไข" },
        ],
      },
      {
        id: "sla",
        name: "SLA",
        actions: [
          { value: "sla:view", label: "ดูข้อมูล", description: "ดูระยะเวลา SLA ของหัวข้อร้องเรียนต่างๆ" },
          { value: "sla:create", label: "เพิ่ม SLA", description: "เพิ่มการตั้งค่ากำหนด SLA ใหม่" },
          { value: "sla:edit", label: "แก้ไข", description: "ปรับแก้ระยะเวลาดำเนินการ SLA ในแต่ละขั้นตอน" },
          { value: "sla:delete", label: "ลบ", description: "ลบการตั้งค่ากำหนด SLA ออกจากระบบ" },
        ],
      },
      {
        id: "organizations",
        name: "หน่วยงานและโครงสร้างองค์กร",
        actions: [
          { value: "organizations:view", label: "ดูข้อมูล", description: "ดูโครงสร้างหน่วยงานทั้งหมดในองค์กร" },
          { value: "organizations:create", label: "เพิ่มหน่วยงาน", description: "เพิ่มหน่วยงานหรือสาขาผู้รับผิดชอบใหม่" },
          { value: "organizations:edit", label: "แก้ไข", description: "แก้ไขหน่วยงานและผู้รับผิดชอบหลัก" },
          { value: "organizations:delete", label: "ลบ", description: "ลบหน่วยงานออกจากระบบ" },
        ],
      },
      {
        id: "audit_logs",
        name: "Audit Log",
        actions: [
          { value: "audit_logs:view", label: "ดูประวัติ", description: "เข้าตรวจสอบบันทึกประวัติการกระทำต่างๆ ของพนักงานในระบบอย่างละเอียด" },
        ],
      },
    ],
  },
];

export const initialRoles: RoleRow[] = [
  {
    id: "ROLE-001",
    name: "ผู้ดูแลระบบ (Super Admin)",
    description: "ดูแลและจัดการตั้งค่าระบบทั้งหมด",
    userCount: 2,
    permissions: [
      // จัดการเรื่องร้องเรียน
      "complaint_list:view", "complaint_list:edit", "complaint_list:delete",
      "complaint_intake:view", "complaint_intake:create",
      "complaint_assignment:view", "complaint_assignment:create", "complaint_assignment:assign", "complaint_assignment:edit", "complaint_assignment:delete",
      "complaint_investigation:view", "complaint_investigation:create", "complaint_investigation:investigate", "complaint_investigation:edit", "complaint_investigation:delete",
      "complaint_approval:view", "complaint_approval:approve", "complaint_approval:edit", "complaint_approval:delete",
      "complaint_extension:view", "complaint_extension:create", "complaint_extension:edit", "complaint_extension:delete", "complaint_extension:approve",
      "sensitive_cases:view",
      "documents_evidence:view", "documents_evidence:upload", "documents_evidence:edit", "documents_evidence:delete",
      // รายงาน
      "report_summary:view", "report_summary:export",
      "report_sla:view", "report_sla:export",
      "report_investigation:view", "report_investigation:export",
      "report_executive:view", "report_executive:export",
      "report_audit_log:view", "report_audit_log:export",
      // ตั้งค่าระบบ
      "users:view", "users:create", "users:edit", "users:delete",
      "roles_permissions:view", "roles_permissions:create", "roles_permissions:edit", "roles_permissions:delete",
      "categories:view", "categories:create", "categories:edit", "categories:delete",
      "subcategories:view", "subcategories:create", "subcategories:edit", "subcategories:delete",
      "forms:view", "forms:create", "forms:edit", "forms:delete",
      "termandprivacy:view", "termandprivacy:edit",
      "sla:view", "sla:create", "sla:edit", "sla:delete",
      "organizations:view", "organizations:create", "organizations:edit", "organizations:delete",
      "audit_logs:view"
    ],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-CS",
    name: "กลยุทธ์องค์กร",
    description: "ฝ่าย/แผนก: Corporate Strategy",
    userCount: 0,
    permissions: [
      "complaint_list:view", 
      "complaint_intake:view", 
      "complaint_intake:create", 
      "report_summary:view"
    ],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-SC",
    name: "เลขานุการบริษัท",
    description: "ฝ่าย/แผนก: Corporate Secretary",
    userCount: 0,
    permissions: ["complaint_list:view", "report_summary:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-RP",
    name: "จัดซื้อวัตถุดิบ",
    description: "ฝ่าย/แผนก: Raw Material Procurement",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-HR",
    name: "ทรัพยากรบุคคล",
    description: "ฝ่าย/แผนก: Human Resources",
    userCount: 0,
    permissions: [
      "complaint_list:view", 
      "users:view", "users:create", "users:edit", "users:delete"
    ],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-DSM",
    name: "ขายและการตลาดในประเทศ",
    description: "ฝ่าย/แผนก: Domestic Sales & Marketing",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-ISM",
    name: "ขายและการตลาดต่างประเทศ",
    description: "ฝ่าย/แผนก: International Sales & Marketing",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-GP",
    name: "จัดซื้อทั่วไป",
    description: "ฝ่าย/แผนก: General Procurement",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-OS",
    name: "สำนักงานเลขานุการบริหาร",
    description: "ฝ่าย/แผนก: Board Secretariat",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-LG",
    name: "โลจิสติกส์",
    description: "ฝ่าย/แผนก: Logistics",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-QE",
    name: "บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม",
    description: "ฝ่าย/แผนก: Quality, Safety, Occupational Health & Environment",
    userCount: 0,
    permissions: [
      "complaint_list:view", 
      "complaint_investigation:view", 
      "complaint_investigation:investigate"
    ],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-FN",
    name: "การเงิน",
    description: "ฝ่าย/แผนก: Finance",
    userCount: 0,
    permissions: ["complaint_list:view"],
    status: "ปิดใช้งาน",
  },
];

export const mockCombinedRoles: RoleRow[] = [...initialRoles];

export const getUserPermissions = (userRoles: string[]): string[] => {
  if (userRoles.includes("super-admin") || userRoles.includes("admin")) {
    const adminRole = mockCombinedRoles.find((r) => r.id === "ROLE-001");
    return adminRole ? adminRole.permissions : [];
  }

  const perms = new Set<string>();
  userRoles.forEach((r) => {
    // เช่น หา DEPT-HR ถ้าบทบาทคือ hr
    const matchId = mockCombinedRoles.find(
      (role) => role.id.toLowerCase() === `dept-${r.toLowerCase()}`
    );
    if (matchId) {
      matchId.permissions.forEach((p) => perms.add(p));
    } else {
      const generalRole = mockCombinedRoles.find((role) =>
        role.name.toLowerCase().includes(r.toLowerCase())
      );
      if (generalRole) {
        generalRole.permissions.forEach((p) => perms.add(p));
      }
    }
  });

  return Array.from(perms);
};
