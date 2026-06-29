import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  mockUsers,
  DEPARTMENTS as DEPARTMENTS_CANONICAL,
  ROLES as ROLES_CANONICAL,
} from "@/mock/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";

// 1. กำหนด Route สำหรับ TanStack Router
export const Route = createFileRoute("/admin/settings/users/edit/$id")({
  component: EditUserPage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ระงับ", "รอยืนยัน"];

function EditUserPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "",
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
        });
      } else {
        setError("ไม่พบข้อมูลผู้ใช้งานรหัสนี้");
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const userIndex = mockUsers.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: formData.status as any,
        };
      }
      
      setIsLoading(false);
      navigate({ to: "/admin/settings/users" });
    }, 800);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-red-500 font-medium text-lg">{error}</p>
        <Button variant="outline" onClick={() => navigate({ to: "/admin/settings/users" })}>
          กลับไปหน้าผู้ใช้งาน
        </Button>
      </div>
    );
  }

  return (
    // เพิ่ม Wrapper นี้เพื่อจัดให้อยู่ตรงกลางหน้าจอในแนวตั้ง (เหลือที่เผื่อ Header ไว้ 120px)
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 md:p-8">
      <PageHeader
              title="ผู้ใช้งาน"
              description="จัดการผู้ใช้งานระบบ (ข้อมูลจำลอง)"
              breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "ผู้ใช้งาน" }]}
      />
      
      {/* กำหนดความกว้างสูงสุดและจัดให้อยู่กึ่งกลาง */}
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header ส่วนบน */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/admin/settings/users" })}
            className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">แก้ไขผู้ใช้</h1>
            <p className="text-sm text-slate-500">
              แก้ไขข้อมูลผู้ใช้รหัส: <span className="font-semibold text-slate-700">{id}</span>
            </p>
          </div>
        </div>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-700">ข้อมูลรายละเอียด</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* ชื่อ-นามสกุล */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                  placeholder="สมชาย ใจดี"
                />
              </div>

              {/* อีเมล */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                  placeholder="somchai@company.com"
                />
              </div>

              {/* บทบาท */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  บทบาท <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                >
                  <option value="" disabled>เลือกบทบาท</option>
                  {ROLES_CANONICAL.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* แผนก */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  แผนก <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                >
                  <option value="" disabled>เลือกแผนก</option>
                  {DEPARTMENTS_CANONICAL.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* สถานะ */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  สถานะ <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                >
                  <option value="" disabled>เลือกสถานะ</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* ปุ่ม Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => navigate({ to: "/admin/settings/users" })}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm"
                  disabled={isLoading || !formData.name || !formData.email}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  บันทึกการแก้ไข
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}