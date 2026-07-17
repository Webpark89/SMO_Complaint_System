import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockUsers } from "@/mock/users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";
import { AdminLayout } from "@/components/admin/layout";
import { mockCombinedRoles } from "@/mock/roles/roles.mock";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/settings/users/edit/$id")({
  component: EditUserPage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ปิดใช้งาน", "รอยืนยัน"];

function EditUserPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { hasPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading && !hasPermission("manage_users")) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, hasPermission, navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (loading || !hasPermission("manage_users")) return;
    setIsLoading(true);
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      } else {
        setError("ไม่พบข้อมูลผู้ใช้งานรหัสนี้");
      }
      setIsLoading(false);
    }, 500);
  }, [id, loading, hasPermission]);

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
          department: "",
          status: formData.status as any,
        };
      }
      
      setIsLoading(false);
      navigate({ to: "/admin/settings/users" });
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

  if (!hasPermission("manage_users")) return null;

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="ผู้ใช้งาน"
            description="จัดการผู้ใช้งานระบบ (ข้อมูลจำลอง)"
            breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "ผู้ใช้งาน" }]}
          />
          <Card className="w-full border-[var(--border)] bg-white shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-red-500 font-medium text-lg">{error}</p>
              <Button variant="outline" onClick={() => navigate({ to: "/admin/settings/users" })}>
                ย้อนกลับ
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <PageHeader
          title="ผู้ใช้งาน"
          description="จัดการผู้ใช้งานระบบ (ข้อมูลจำลอง)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" }, 
            { label: "ผู้ใช้งาน" },
            { label: "แก้ไขข้อมูลผู้ใช้" }
          ]}
          actionButtons={
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/admin/settings/users" })}
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
                แก้ไขข้อมูลผู้ใช้
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    บทบาท/แผนก <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                  >
                    <option value="" disabled>เลือกบทบาท/แผนก</option>
                    {mockCombinedRoles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="flex gap-3 pt-6 mt-6">
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-[140px]"
                  disabled={isLoading || !formData.name || !formData.email}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  บันทึกการแก้ไข
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => navigate({ to: "/admin/settings/users" })}
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