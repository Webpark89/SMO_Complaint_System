import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockCategories } from "@/mock/organization"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/settings/categories/new")({
  component: AddCategoryPage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ระงับ"];

function AddCategoryPage() {
  const navigate = useNavigate();
  const { hasPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading && !hasPermission("manage_settings")) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, hasPermission, navigate]);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "เปิดใช้งาน",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newItem = {
        id: `CAT-${String(mockCategories.length + 1).padStart(3, "0")}`,
        name: formData.name,
        description: formData.description,
        subcategoryCount: 0,
        status: formData.status as any,
      };
      mockCategories.push(newItem);
      
      setIsLoading(false);
      navigate({ to: "/admin/settings/categories" }); 
    }, 800);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)]" />
          <span className="ml-2 text-sm text-slate-500">กำลังโหลด...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!hasPermission("manage_settings")) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <PageHeader
          title="หมวดหมู่"
          description="จัดการหมวดหมู่ระบบ (ข้อมูลจำลอง)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" }, 
            { label: "หมวดหมู่" },
            { label: "เพิ่มหมวดหมู่ใหม่" }
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
                เพิ่มหมวดหมู่ใหม่
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              
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
                  placeholder="กรอกชื่อหมวดหมู่"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full flex min-h-[80px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
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

              <div className="flex gap-3 pt-6 mt-6">
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-[140px]"
                  disabled={isLoading || !formData.name || !formData.description}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  บันทึก
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => navigate({ to: "/admin/settings/categories" })}
                  disabled={isLoading}
                >
                  ยกเลิก
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
