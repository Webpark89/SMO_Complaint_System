# Complaint Management System

ระบบร้องเรียนออนไลน์ (Complaint System) สำหรับองค์กร รองรับการแจ้งเรื่องร้องเรียนแบบระบุตัวตนและไม่ระบุตัวตน พร้อมระบบติดตามสถานะผ่านหมายเลขอ้างอิง

---

## Features

### Complaint Submission

- ระบบแจ้งเรื่องร้องเรียนแบบ multi-step form
- เลือกประเภทและหัวข้อย่อยของปัญหา
- ระบุวันเวลาและสถานที่เกิดเหตุ
- เพิ่มรายละเอียดเหตุการณ์แบบอิสระ

### Anonymous Mode

- รองรับการแจ้งแบบไม่ระบุตัวตน
- เก็บเฉพาะข้อมูลจำเป็น (เช่น email สำหรับรับ reference number)
- ออกแบบเพื่อคุ้มครองข้อมูลผู้ร้องเรียนตาม privacy policy

### File Attachments

- รองรับไฟล์ PDF, PNG, JPG, DOCX
- Drag & Drop upload
- จำกัดจำนวนไฟล์สูงสุด

### Tracking System

- ตรวจสอบสถานะด้วย reference number
- รองรับการติดตามเรื่องร้องเรียนย้อนหลัง

### Dynamic Form Logic

- ฟอร์มปรับตามประเภทเรื่องร้องเรียน
- Validation ด้วย Zod
- รองรับ auto-step progression

---

## Tech Stack

- React + TypeScript
- TanStack Router
- TailwindCSS
- shadcn/ui
- Zod (Validation)
- Sonner (Toast notifications)
- Lucide Icons

---

# install dependencies

npm install

# run development server

npm run dev

# build production

npm run build
