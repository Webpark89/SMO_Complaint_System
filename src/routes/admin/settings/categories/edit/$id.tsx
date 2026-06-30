import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
// สมมติฐานว่าคุณดึง mockCategories มาจากที่นี่
import { mockCategories } from "@/mock/organization"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";

// สำคัญ: Import AdminLayout เข้ามาใช้งาน (กรุณาตรวจสอบ Path ให้ตรงกับโฟลเดอร์โปรเจกต์ของคุณ)
import { AdminLayout } from "@/components/admin/layout"

// กำหนด Route สำหรับหน้าแก้ไขหมวดหมู่
export const Route = createFileRoute("/admin/settings/categories/edit/$id")({
  component: EditCategoryPage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ระงับ"];

function EditCategoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    setIsLoading(true);
    // จำลองการดึงข้อมูล
    setTimeout(() => {
      const category = mockCategories.find((c) => c.id === id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          status: category.status,
        });
      } else {
        setError("ไม่พบข้อมูลหมวดหมู่รหัสนี้");
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // จำลองการบันทึกข้อมูล
    setTimeout(() => {
      const catIndex = mockCategories.findIndex((c) => c.id === id);
      if (catIndex !== -1) {
        mockCategories[catIndex] = {
          ...mockCategories[catIndex],
          name: formData.name,
          description: formData.description,
          status: formData.status as any,
        };
      }
      
      setIsLoading(false);
      // เปลี่ยน path กลับไปยังหน้ารายการที่คุณต้องการ
      navigate({ to: "/admin/settings/categories" }); 
    }, 800);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-red-500 font-medium text-lg">{error}</p>
        <Button variant="outline" onClick={() => navigate({ to: "/admin/settings/categories" })}>
          กลับไปหน้าหมวดหมู่
        </Button>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="หมวดหมู่"
          description="จัดการหมวดหมู่ระบบ (ข้อมูลจำลอง)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" }, 
            { label: "หมวดหมู่" },
            { label: "แก้ไขข้อมูลหมวดหมู่" }
          ]}
          actionButtons={
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/admin/settings/categories" })}
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 gap-2 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              ย้อนกลับ
            </Button>
          }
        />

        <Card className="w-full border-[var(--border)] bg-white shadow-soft">
          <CardContent className="p-6">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">
                แก้ไขข้อมูลหมวดหมู่รหัส: <span className="text-[#b08730]">{id}</span>
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  ชื่อหมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                  placeholder="เช่น ร้องเรียนการบริการ"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all resize-none"
                  placeholder="กรอกคำอธิบายหมวดหมู่"
                />
              </div>
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
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => navigate({ to: "/admin/settings/categories" })}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm"
                  disabled={isLoading || !formData.name || !formData.description}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}  
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
}
