import { complaintTypes } from "@/mock/complaints/complaintTypes";
import { mockAuth } from "@/services/mock/auth";
import { createId, createMockCrudStore } from "@/services/mock/crud";
import type {
  Category,
  Complaint,
  ComplaintComment,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintStatusHistory,
  SubmitComplaintInput,
  UrgencyLevel,
} from "@/services/ComplaintService";

type ComplaintWithCategory = Complaint & {
  category?: Pick<Category, "name" | "is_sensitive"> | null;
};

const now = new Date();

function daysAgo(days: number) {
  const value = new Date(now);
  value.setDate(value.getDate() - days);
  return value.toISOString();
}

const categories: Category[] = complaintTypes.map((category, index) => ({
  id: category.id,
  name: category.name,
  description: category.description ?? null,
  active: true,
  is_sensitive: ["ethics", "fraud"].includes(category.id),
  created_at: daysAgo(45 + index),
}));

// 1. นำข้อมูล CMP-0005 ถึง CMP-0008 เข้ามาไว้ใน Array ของ complaintStore ให้ถูกต้อง
const complaintStore = createMockCrudStore<Complaint>([
  createSeedComplaint({
    id: "CMP-0001",
    reference_number: "CMP-2026-0001",
    title: "[การทุจริต] เรื่องร้องเรียน",
    description:
      "วันที่เกิดเหตุ: 2026-05-05 12:00\nสาขา: บริษัท กลุ่มสมอทอง จำกัด (มหาชน) \nหมวดหมู่: การทุจริต\nหัวข้อย่อย: ยักยอกเงินบริษัท\nรายละเอียดเพิ่มเติม: พบการโอนเงินภายในบัญชีทางการโดยไม่ได้รับอนุมัติจากผู้บริหาร\n",
    category_id: "fraud",
    subtopic_id: "fraud_ledger",
    priority: "critical",
    status: "pending",
    is_sensitive: true,
    created_at: daysAgo(0),
    updated_at: daysAgo(0),
    reporter_name: "สมชาย ใจดี",
    reporter_email: "somchai.jaidee@example.com",
    reporter_phone: "081-234-5678",
    reporter_department: "บัญชี",
    occurred_date: "2026-05-05",
    occurred_time: "12:00",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สำนักงานใหญ่",
    requestFollowUp: true,
    followUpContact: "somchai.jaidee@example.com",
  }),
  createSeedComplaint({
    id: "CMP-0002",
    reference_number: "CMP-2026-0002",
    title: "[พฤติกรรมพนักงาน] เรื่องร้องเรียน",
    description:
      "วันที่เกิดเหตุ: 2026-05-04 15:30\nสาขา: สาขาท่าชนะ\nหมวดหมู่: พฤติกรรมพนักงาน\nหัวข้อย่อย: พูดจาไม่สุภาพกับลูกค้า\nรายละเอียดเพิ่มเติม: พนักงานแสดงกิริยาไม่สุภาพและไม่ให้ความร่วมมือกับลูกค้า",
    category_id: "employee_behavior",
    subtopic_id: "employee_rude_customer",
    priority: "medium",
    status: "in_progress",
    is_sensitive: false,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    reporter_name: "กาญจนา แซ่ตั้ง",
    reporter_email: "kanjana.sae@example.com",
    reporter_phone: "089-765-4321",
    reporter_department: "บริการลูกค้า",
    occurred_date: "2026-05-04",
    occurred_time: "15:30",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาท่าชนะ",
    hasWitness: true,
    witnessNames: ["กิตติ วงศ์ศรี"],
    requestFollowUp: true,
    followUpContact: "kanjana.sae@example.com",
  }),
  createSeedComplaint({
    id: "CMP-0003",
    reference_number: "CMP-2026-0003",
    title: "[ผลิตภัณฑ์และบริการ] เรื่องร้องเรียน",
    description:
      "วันที่เกิดเหตุ: 2026-05-03 09:20\nสาขา: บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาพนม\nหมวดหมู่: ผลิตภัณฑ์และบริการ\nหัวข้อย่อย: สินค้าชำรุดหรือไม่ได้มาตรฐาน\nรายละเอียดเพิ่มเติม: สินค้าที่รับมามีรอยชำรุดและข้อมูลบรรจุภัณฑ์ไม่ตรงตามสเปก\n",
    category_id: "products_services",
    subtopic_id: "product_defect",
    product_type: "PK",
    lot_reference: "PK-20260503-77",
    contract_number: "CN-2026-3821",
    delivery_date: "2026-05-02",
    priority: "low",
    status: "completed",
    is_sensitive: false,
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
    reporter_name: "อรทัย แก้วใส",
    reporter_email: "orathai@example.com",
    reporter_phone: "082-987-6543",
    reporter_department: "ฝ่ายตรวจสอบคุณภาพ",
    occurred_date: "2026-05-03",
    occurred_time: "09:20",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาพนม",
  }),
  createSeedComplaint({
    id: "CMP-0004",
    reference_number: "CMP-2026-0004",
    title: "[ความปลอดภัย] เรื่องร้องเรียน",
    description:
      "วันที่เกิดเหตุ: 2026-05-02 11:10\nสาขา: บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาสระบุรี\nหมวดหมู่: ความปลอดภัย\nหัวข้อย่อย: ไม่สวมอุปกรณ์ป้องกัน (PPE)\nรายละเอียดเพิ่มเติม: พนักงานปฏิบัติงานในพื้นที่เสี่ยงโดยไม่สวมหมวกนิรภัยและถุงมือ",
    category_id: "safety",
    subtopic_id: "safety_ppe",
    priority: "high",
    status: "investigating",
    is_sensitive: false,
    created_at: daysAgo(3),
    updated_at: daysAgo(2),
    is_anonymous: true,
    occurred_date: "2026-05-02",
    occurred_time: "11:10",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สาขาสระบุรี",
  }),
  createSeedComplaint({
    id: "CMP-0005",
    reference_number: "CMP-2026-0005",
    title: "[สิ่งแวดล้อม] การทิ้งของเสียไม่ถูกต้อง",
    description:
      "วันที่เกิดเหตุ: 2026-05-01 14:00\nสาขา: สาขามวกเหลัก\nหมวดหมู่: สิ่งแวดล้อม\nหัวข้อย่อย: การจัดการของเสีย\nรายละเอียดเพิ่มเติม: พบการทิ้งของเสียอุตสาหกรรมในพื้นที่ใกล้แหล่งน้ำโดยไม่ผ่านกระบวนการบำบัด",
    category_id: "environment",
    subtopic_id: "env_waste",
    priority: "high",
    status: "rejected",
    is_sensitive: false,
    created_at: daysAgo(4),
    updated_at: daysAgo(3),
    reporter_name: "นภา วงศ์สกุล",
    reporter_email: "napa@example.com",
    reporter_phone: "086-111-2222",
    reporter_department: "ฝ่ายบำรุงรักษา",
    occurred_date: "2026-05-01",
    occurred_time: "14:00",
    location: "สาขามวกเหลัก",
  }),
  createSeedComplaint({
    id: "CMP-0006",
    reference_number: "CMP-2026-0006",
    title: "[การทุจริต] การรายงานข้อมูลเท็จ",
    description:
      "วันที่เกิดเหตุ: 2026-04-28 10:00\nสาขา: บริษัท กลุ่มสมอทอง จำกัด (มหาชน) \nหมวดหมู่: การทุจริต\nหัวข้อย่อย: การรายงานข้อมูลเท็จ\nรายละเอียดเพิ่มเติม: พบการปรับปรุงตัวเลขรายงานการผลิตให้สูงขึ้นเพื่อรับโบนัส",
    category_id: "fraud",
    subtopic_id: "fraud_falsereport",
    priority: "critical",
    status: "investigating",
    is_sensitive: true,
    created_at: daysAgo(7),
    updated_at: daysAgo(2),
    reporter_name: "วิชัย รุ่งเรือง",
    reporter_email: "wichai@example.com",
    reporter_phone: "089-888-9999",
    reporter_department: "บัญชี",
    occurred_date: "2026-04-28",
    occurred_time: "10:00",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สำนักงานใหญ่",
    hasWitness: true,
    witnessNames: ["สมหมาย มั่นคง", "แพรวา สุขใจ"],
    requestFollowUp: true,
    followUpContact: "wichai@example.com",
  }),
  createSeedComplaint({
    id: "CMP-0007",
    reference_number: "CMP-2026-0007",
    title: "[ผลิตภัณฑ์และบริการ] บริการหลังการขายไม่ดี",
    description:
      "วันที่เกิดเหตุ: 2026-04-25 16:30\nสาขา: สาขาบางนา\nหมวดหมู่: ผลิตภัณฑ์และบริการ\nหัวข้อย่อย: บริการหลังการขาย\nรายละเอียดเพิ่มเติม: ติดต่อขอเคลมสินค้า แต่ไม่ได้รับการตอบกลับจากฝ่ายบริการลูกค้า",
    category_id: "products_services",
    subtopic_id: "product_aftersales",
    product_type: "CPO",
    lot_reference: "CPO-20260425-45",
    contract_number: "CN-2026-2934",
    delivery_date: "2026-04-20",
    priority: "medium",
    status: "closed",
    is_sensitive: false,
    created_at: daysAgo(10),
    updated_at: daysAgo(5),
    reporter_name: "ประทิน วิริยะ",
    reporter_email: "pratin@example.com",
    reporter_phone: "081-555-6666",
    reporter_department: "การตลาด",
    occurred_date: "2026-04-25",
    occurred_time: "16:30",
    location: "สาขาบางนา",
  }),
  createSeedComplaint({
    id: "CMP-0008",
    reference_number: "CMP-2026-0008",
    title: "[จริยธรรม] การใช้ทรัพยากรบริษัทเพื่อประโยชน์ส่วนตัว",
    description:
      "วันที่เกิดเหตุ: 2026-04-20 08:30\nสาขา: บริษัท กลุ่มสมอทอง จำกัด (มหาชน) \nหมวดหมู่: จริยธรรม\nหัวข้อย่อย: การใช้ทรัพยากรในทางที่ผิด\nรายละเอียดเพิ่มเติม: พบการใช้รถบริษัทเพื่อกิจกรรมส่วนตัวอย่างสม่ำเสมอ",
    category_id: "ethics",
    subtopic_id: "eth_other",
    priority: "medium",
    status: "in_progress",
    is_sensitive: true,
    created_at: daysAgo(15),
    updated_at: daysAgo(3),
    reporter_name: "เพชรา ใจเย็น",
    reporter_email: "petcha@example.com",
    reporter_phone: "085-777-8888",
    reporter_department: "ทรัพยากรบุคคล",
    occurred_date: "2026-04-20",
    occurred_time: "08:30",
    location: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) สำนักงานใหญ่",
    hasWitness: true,
    witnessNames: ["มาลี รักสงบ"],
    requestFollowUp: false,
  }),
  createSeedComplaint({
    id: "CMP-0009",
    reference_number: "CMP-2026-0009",
    title: "[จรรยาบรรณทางธุรกิจ] การปฏิบัติต่อผู้มีส่วนได้เสีย",
    description: "ทดสอบข้อมูลสถานะยาวๆ ตามแบบในภาพอ้างอิง",
    category_id: "ethics", // หมวดหมู่จรรยาบรรณ
    priority: "medium",
    status: "closed", // สถานะปัจจุบันคือ ปิดเรื่อง
    is_sensitive: false,
    created_at: "2026-06-09T15:48:55+07:00",
    updated_at: "2026-06-19T10:20:31+07:00",
    occurred_date: "2026-05-02",
    occurred_time: "15:42",
    location: "สาขาท่าชนะ",
  }),
]);

// 2. ดึง Comment ที่หลุดไปอยู่ใน createComplaint() กลับมาอยู่ใน Store
const commentStore = createMockCrudStore<ComplaintComment>([
  {
    id: "comment-0001",
    complaint_id: "CMP-0002",
    author_id: "USR-0001",
    author_name: "somchai.jaidee@example.com",
    body: "รับเรื่องแล้ว ทีมงานกำลังตรวจสอบข้อมูลเบื้องต้น",
    is_internal: false,
    created_at: daysAgo(1),
  },
  {
    id: "comment-0002",
    complaint_id: "CMP-0001",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "เรื่องนี้ถูกจัดเป็นความลับสูง กรุณาดำเนินการอย่างระมัดระวัง",
    is_internal: true,
    created_at: daysAgo(0),
  },
  {
    id: "comment-0003",
    complaint_id: "CMP-0002",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "ได้ตรวจสอบกล้องวงจรปิดแล้ว พบว่ามีการกระทำที่ไม่เหมาะสมจริง",
    is_internal: true,
    created_at: daysAgo(0),
  },
  {
    id: "comment-0004",
    complaint_id: "CMP-0003",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "ทางฝ่ายคุณภาพได้ตรวจสอบแล้ว ยอมรับเคลมสินค้าและทำการเปลี่ยนให้ลูกค้า",
    is_internal: false,
    created_at: daysAgo(1),
  },
  {
    id: "comment-0005",
    complaint_id: "CMP-0004",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "อยู่ระหว่างการสืบสวน ขอเวลาอีก 7 วัน",
    is_internal: false,
    created_at: daysAgo(2),
  },
  {
    id: "comment-0006",
    complaint_id: "CMP-0005",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "หลังจากตรวจสอบพบว่าของเสียถูกทิ้งตามขั้นตอนมาตรฐาน ปฏิเสธเรื่องร้องเรียน",
    is_internal: false,
    created_at: daysAgo(3),
  },
  {
    id: "comment-0007",
    complaint_id: "CMP-0006",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "อยู่ระหว่างรวบรวมหลักฐาน กรุณารอการแจ้งผล",
    is_internal: true,
    created_at: daysAgo(5),
  },
  {
    id: "comment-0008",
    complaint_id: "CMP-0007",
    author_id: "USR-0001",
    author_name: "admin@company.com",
    body: "ได้ติดต่อลูกค้าแล้ว และทำการเปลี่ยนสินค้าให้เรียบร้อย",
    is_internal: false,
    created_at: daysAgo(6),
  },
]);

// 3. ดึง createHistory ที่หลุดไปอยู่ใน Parameter ของ updateComplaintStatus() กลับมาอยู่ใน Store
const historyStore = createMockCrudStore<ComplaintStatusHistory>([
  createHistory("history-0001", "CMP-0001", null, "pending", daysAgo(0)),
  createHistory("history-0002", "CMP-0002", null, "pending", daysAgo(1)),
  createHistory(
    "history-0003",
    "CMP-0002",
    "pending",
    "in_progress",
    daysAgo(1),
  ),
  createHistory("history-0004", "CMP-0003", null, "pending", daysAgo(2)),
  createHistory("history-0005", "CMP-0003", "pending", "completed", daysAgo(1)),
  createHistory("history-0006", "CMP-0004", null, "pending", daysAgo(3)),
  createHistory(
    "history-0007",
    "CMP-0004",
    "pending",
    "investigating",
    daysAgo(2),
  ),
  createHistory("history-0008", "CMP-0005", null, "pending", daysAgo(4)),
  createHistory(
    "history-0009",
    "CMP-0005",
    "pending",
    "investigating",
    daysAgo(4),
  ),
  createHistory(
    "history-0010",
    "CMP-0005",
    "investigating",
    "rejected",
    daysAgo(3),
  ),
  createHistory("history-0011", "CMP-0006", null, "pending", daysAgo(7)),
  createHistory(
    "history-0012",
    "CMP-0006",
    "pending",
    "investigating",
    daysAgo(5),
  ),
  createHistory(
    "history-0013",
    "CMP-0006",
    "investigating",
    "in_progress",
    daysAgo(2),
  ),
  createHistory("history-0014", "CMP-0007", null, "pending", daysAgo(10)),
  createHistory(
    "history-0015",
    "CMP-0007",
    "pending",
    "in_progress",
    daysAgo(8),
  ),
  createHistory(
    "history-0016",
    "CMP-0007",
    "in_progress",
    "completed",
    daysAgo(6),
  ),
  createHistory("history-0017", "CMP-0007", "completed", "closed", daysAgo(5)),
  createHistory("history-0018", "CMP-0008", null, "pending", daysAgo(15)),
  createHistory(
    "history-0019",
    "CMP-0008",
    "pending",
    "investigating",
    daysAgo(10),
  ),
  createHistory(
    "history-0020",
    "CMP-0008",
    "investigating",
    "in_progress",
    daysAgo(3),
  ),
  createHistory("history-0021", "CMP-0009", null, "รอพิจารณา" as ComplaintStatus, "2026-06-09T15:48:55+07:00"),
  createHistory("history-0022", "CMP-0009", "รอพิจารณา" as ComplaintStatus, "รับเรื่องและคัดกรองแล้ว" as ComplaintStatus, "2026-06-10T15:48:55+07:00"),
  createHistory("history-0023", "CMP-0009", "รับเรื่องและคัดกรองแล้ว" as ComplaintStatus, "รอมอบหมายผู้รับผิดชอบ" as ComplaintStatus, "2026-06-11T15:48:55+07:00"),
  createHistory("history-0024", "CMP-0009", "รอมอบหมายผู้รับผิดชอบ" as ComplaintStatus, "มอบหมายผู้รับผิดชอบแล้ว" as ComplaintStatus, "2026-06-12T15:48:55+07:00"),
  createHistory("history-0025", "CMP-0009", "มอบหมายผู้รับผิดชอบแล้ว" as ComplaintStatus, "อยู่ระหว่างดำเนินการ" as ComplaintStatus, "2026-06-13T15:48:55+07:00"),
  createHistory("history-0026", "CMP-0009", "อยู่ระหว่างดำเนินการ" as ComplaintStatus, "อยู่ระหว่างสอบสวน" as ComplaintStatus, "2026-06-14T15:48:55+07:00"),
  createHistory("history-0027", "CMP-0009", "อยู่ระหว่างสอบสวน" as ComplaintStatus, "รอสรุปผลสอบสวน" as ComplaintStatus, "2026-06-15T15:48:55+07:00"),
  createHistory("history-0028", "CMP-0009", "รอสรุปผลสอบสวน" as ComplaintStatus, "สรุปผลสอบสวนแล้ว" as ComplaintStatus, "2026-06-16T15:48:55+07:00"),
  createHistory("history-0029", "CMP-0009", "สรุปผลสอบสวนแล้ว" as ComplaintStatus, "รออนุมัติผล" as ComplaintStatus, "2026-06-17T15:48:55+07:00"),
  createHistory("history-0030", "CMP-0009", "รออนุมัติผล" as ComplaintStatus, "อนุมัติแล้ว" as ComplaintStatus, "2026-06-18T15:48:55+07:00"),
  createHistory("history-0031", "CMP-0009", "อนุมัติแล้ว" as ComplaintStatus, "ปิดเรื่อง" as ComplaintStatus, "2026-06-19T10:20:31+07:00"),
]);

export const mockCategories = {
  async getAll() {
    return categories
      .filter((category) => category.active)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  getItems: async () => mockCategories.getAll(),
  async getItemById(id: string) {
    return categories.find((category) => category.id === id) ?? null;
  },
};

export const mockComplaints = {
  getItems: () => complaintStore.getItems(),
  getItemById: (id: string) => complaintStore.getItemById(id),
  createItem: (data: Omit<Complaint, "id"> & Partial<Pick<Complaint, "id">>) =>
    complaintStore.createItem(data),
  updateItem: (id: string, data: Partial<Complaint>) =>
    complaintStore.updateItem(id, data),
  deleteItem: (id: string) => complaintStore.deleteItem(id),
  getAll: () => complaintStore.getItems(),
  getById: (id: string) => complaintStore.getItemById(id),
  create: (data: Omit<Complaint, "id"> & Partial<Pick<Complaint, "id">>) =>
    complaintStore.createItem(data),
  update: (id: string, data: Partial<Complaint>) =>
    complaintStore.updateItem(id, data),
  delete: (id: string) => complaintStore.deleteItem(id),
};

export async function createComplaint(input: SubmitComplaintInput) {
  const session = await mockAuth.getSession();
  const category = await mockCategories.getItemById(input.category_id ?? "");
  const createdAt = new Date().toISOString();
  const hasWitness = input.hasWitness ?? false;
  const witnessNames = (input.witnesses ?? [])
    .map((w) => w.name.trim())
    .filter(Boolean);
  const witnessPhones = (input.witnesses ?? [])
    .map((w) => (w.phone ?? "").trim())
    .filter(Boolean);
  const complaint = await complaintStore.createItem({
    assignee_id: null,
    category_id: input.category_id,
    created_at: createdAt,
    description: input.description,
    is_anonymous: input.is_anonymous,
    is_sensitive: category?.is_sensitive ?? false,
    hasWitness,
    witnessNames,
    urgencyLevel: input.urgencyLevel ?? input.priority,
    requestFollowUp: input.requestFollowUp ?? false,
    followUpContact: input.requestFollowUp
      ? (input.followUpContact ?? null)
      : null,
    priority: input.priority,
    reference_number: await nextReferenceNumber(),
    reporter_department: input.is_anonymous
      ? null
      : (input.reporter_department ?? null),
    reporter_email: input.is_anonymous ? null : (input.reporter_email ?? null),
    reporter_name: input.is_anonymous ? null : (input.reporter_name ?? null),
    reporter_phone: input.is_anonymous ? null : (input.reporter_phone ?? null),
    subtopic_id: input.subtopic_id ?? null,
    subtopic_other: input.subtopic_other ?? null,
    subcategory_other: input.subcategory_other ?? null,
    product_type: input.product_type ?? null,
    product_type_other: input.product_type_other ?? null,
    lot_reference: input.lot_reference ?? null,
    contract_number: input.contract_number ?? null,
    delivery_date: input.delivery_date ?? null,
    occurred_date: input.occurred_date ?? null,
    occurred_time: input.occurred_time ?? null,
    location: input.location ?? null,
    reporter_user_id: input.is_anonymous ? null : (session?.user.id ?? null),
    status: "pending",
    title: input.title,
    track_token: createId("track"),
    updated_at: createdAt,
  });

  await historyStore.createItem({
    changed_by: session?.user.id ?? null,
    complaint_id: complaint.id,
    created_at: createdAt,
    from_status: null,
    note: "Created in mock data layer",
    to_status: "pending",
  });

  await commentStore.createItem({
    id: createId("comment"),
    complaint_id: complaint.id,
    author_id: session?.user.id ?? "system",
    author_name: "เจ้าหน้าที่",
    body: "นี่เป็น comment ตัวอย่างสำหรับเรื่องร้องเรียนใหม่",
    is_internal: false,
    created_at: createdAt,
  });

  return { reference_number: complaint.reference_number, id: complaint.id };
}

export async function listComplaintsWithCategory() {
  const complaints = await complaintStore.getItems();
  return complaints
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(withCategory);
}

export async function getComplaintWithCategory(id: string) {
  const complaint =
    (await complaintStore.getItemById(id)) ??
    (await complaintStore.getItems()).find(
      (item) => item.reference_number === id,
    );
  return complaint ? withCategory(complaint) : null;
}

export async function trackComplaint(referenceNumber: string) {
  const normalized = referenceNumber.trim().toUpperCase();
  const complaints = await complaintStore.getItems();
  const complaint = complaints.find(
    (item) => item.reference_number.toUpperCase() === normalized,
  );
  if (!complaint) return null;
  
  const history = await listStatusHistory(complaint.id);

  // ดึงชื่อหมวดหมู่ (ประเภทเรื่องร้องเรียน) จาก category_id
  const category = categories.find((c) => c.id === complaint.category_id);

  return {
    reference_number: complaint.reference_number,
    title: complaint.title,
    status: complaint.status,
    priority: complaint.priority,
    is_sensitive: complaint.is_sensitive,
    created_at: complaint.created_at,
    updated_at: complaint.updated_at,
    
    // --- เพิ่มฟิลด์ที่ขาดหายไปตรงนี้ ---
    complaint_type_name: category ? category.name : "-",
    branch_name: complaint.location, // ใน Mock data ใช้ location ในการเก็บชื่อสาขา
    incident_date: complaint.occurred_date,
    incident_time: complaint.occurred_time,
    // --------------------------------
    
    history,
  };
}

export async function listComments(complaintId: string) {
  const comments = await commentStore.getItems();
  return comments
    .filter((comment) => comment.complaint_id === complaintId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function addComment(
  complaintId: string,
  body: string,
  isInternal: boolean,
) {
  const session = await mockAuth.getSession();
  if (!session) throw new Error("Not authenticated");
  await commentStore.createItem({
    complaint_id: complaintId,
    author_id: session.user.id,
    author_name: session.user.email ?? null,
    body,
    is_internal: isInternal,
    created_at: new Date().toISOString(),
  });
}

export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
) {
  const complaint = await complaintStore.getItemById(complaintId);
  if (!complaint) throw new Error("Complaint not found");
  if (complaint.status === status) return;

  const session = await mockAuth.getSession();
  const updatedAt = new Date().toISOString();
  await complaintStore.updateItem(complaintId, {
    status,
    updated_at: updatedAt,
  });
  await historyStore.createItem({
    changed_by: session?.user.id ?? null,
    complaint_id: complaintId,
    created_at: updatedAt,
    from_status: complaint.status,
    note: null,
    to_status: status,
  });
}

export async function listStatusHistory(complaintId: string) {
  const history = await historyStore.getItems();
  return history
    .filter((item) => item.complaint_id === complaintId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

function withCategory(complaint: Complaint): ComplaintWithCategory {
  const category = categories.find((item) => item.id === complaint.category_id);
  return {
    ...complaint,
    hasWitness: complaint.hasWitness ?? false,
    witnessNames: complaint.witnessNames ?? [],
    urgencyLevel: complaint.urgencyLevel ?? complaint.priority ?? "medium",
    requestFollowUp: complaint.requestFollowUp ?? false,
    followUpContact: complaint.followUpContact ?? null,
    category: category
      ? { name: category.name, is_sensitive: category.is_sensitive }
      : null,
  };
}

async function nextReferenceNumber() {
  const year = new Date().getFullYear();
  const complaints = await complaintStore.getItems();
  const count =
    complaints.filter((item) =>
      item.reference_number.startsWith(`CMP-${year}-`),
    ).length + 1;
  return `CMP-${year}-${String(count).padStart(4, "0")}`;
}

function createSeedComplaint(input: {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  category_id: string;
  subtopic_id?: string;
  subtopic_other?: string | null;
  subcategory_other?: string | null;
  product_type?: string | null;
  product_type_other?: string | null;
  lot_reference?: string | null;
  contract_number?: string | null;
  delivery_date?: string | null;
  occurred_date?: string | null;
  occurred_time?: string | null;
  location?: string | null;
  priority: ComplaintPriority;
  hasWitness?: boolean;
  witnessNames?: string[];
  urgencyLevel?: UrgencyLevel;
  requestFollowUp?: boolean;
  followUpContact?: string | null;
  status: ComplaintStatus;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
  reporter_name?: string | null;
  reporter_email?: string | null;
  reporter_phone?: string | null;
  reporter_department?: string | null;
  is_anonymous?: boolean;
}): Complaint {
  return {
    assignee_id: null,
    category_id: input.category_id,
    created_at: input.created_at,
    description: input.description,
    id: input.id,
    is_anonymous: input.is_anonymous ?? false,
    is_sensitive: input.is_sensitive,
    hasWitness: input.hasWitness ?? false,
    witnessNames: input.witnessNames ?? [],
    urgencyLevel: input.urgencyLevel ?? input.priority,
    requestFollowUp: input.requestFollowUp ?? false,
    followUpContact: input.followUpContact ?? null,
    priority: input.priority,
    reference_number: input.reference_number,
    reporter_department: input.reporter_department ?? null,
    reporter_email: input.reporter_email ?? null,
    reporter_name: input.reporter_name ?? null,
    reporter_phone: input.reporter_phone ?? null,
    subtopic_id: input.subtopic_id ?? null,
    subtopic_other: input.subtopic_other ?? null,
    subcategory_other: input.subcategory_other ?? null,
    product_type: input.product_type ?? null,
    product_type_other: input.product_type_other ?? null,
    lot_reference: input.lot_reference ?? null,
    contract_number: input.contract_number ?? null,
    delivery_date: input.delivery_date ?? null,
    occurred_date: input.occurred_date ?? null,
    occurred_time: input.occurred_time ?? null,
    location: input.location ?? null,
    reporter_user_id: input.is_anonymous ? null : "USR-0001",
    status: input.status,
    title: input.title,
    track_token: `track-${input.id}`,
    updated_at: input.updated_at,
  };
}

function createHistory(
  id: string,
  complaintId: string,
  fromStatus: ComplaintStatus | null,
  toStatus: ComplaintStatus,
  createdAt: string,
): ComplaintStatusHistory {
  return {
    id,
    complaint_id: complaintId,
    changed_by: "USR-0001",
    created_at: createdAt,
    from_status: fromStatus,
    note: null,
    to_status: toStatus,
  };
}
