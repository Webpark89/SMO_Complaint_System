import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockCombinedRoles, ALL_PERMISSIONS, type RoleStatus } from "@/mock/roles/roles.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/settings/roles/new")({
  component: AddRolePage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ระงับ"];

function AddRolePage() {
  const navigate = useNavigate();
  const { hasPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading && !hasPermission("manage_roles")) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, hasPermission, navigate]);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "เปิดใช้งาน",
    permissions: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePermission = (value: string) => {
    setFormData((prev) => {
      const isSelected = prev.permissions.includes(value);
      const newPerms = isSelected
        ? prev.permissions.filter((p) => p !== value)
        : [...prev.permissions, value];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSelectAllInCategory = (category: string, availablePerms: string[]) => {
    setFormData((prev) => {
      const allSelected = availablePerms.every((p) => prev.permissions.includes(p));
      let newPerms;
      if (allSelected) {
        newPerms = prev.permissions.filter((p) => !availablePerms.includes(p));
      } else {
        newPerms = Array.from(new Set([...prev.permissions, ...availablePerms]));
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newItem = {
        id: `ROLE-${String(mockCombinedRoles.length + 1).padStart(3, "0")}`,
        name: formData.name,
        description: formData.description,
        userCount: 0,
        permissions: formData.permissions,
        status: formData.status as RoleStatus,
      };
      mockCombinedRoles.push(newItem);
      
      setIsLoading(false);
      navigate({ to: "/admin/settings/roles" });
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

  if (!hasPermission("manage_roles")) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <PageHeader
          title="บทบาทและสิทธิ์"
          description="จัดการบทบาทผู้ใช้งานและสิทธิ์การเข้าถึง (ข้อมูลจำลอง)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" }, 
            { label: "บทบาทและสิทธิ์" },
            { label: "เพิ่มบทบาทใหม่" }
          ]}
          actionButtons={
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/admin/settings/roles" })}
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
                เพิ่มบทบาทใหม่
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full space-y-8">
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">
                    ชื่อบทบาท <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                    placeholder="เช่น ผู้ดูแลเรื่องร้องเรียนทั่วไป"
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
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  คำอธิบายบทบาท <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full flex min-h-[80px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                  placeholder="กรอกคำอธิบายเกี่ยวกับบทบาทนี้..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="h-5 w-5 text-[#b08730]" />
                  <h3 className="font-bold text-slate-800">กำหนดสิทธิ์การใช้งาน (Permissions)</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {ALL_PERMISSIONS.map((group) => {
                    const availablePerms = group.items.map((i) => i.value);
                    const allSelected = availablePerms.every((p) => formData.permissions.includes(p));
                    
                    return (
                      <Card key={group.category} className="border-slate-200 shadow-none bg-slate-50/50">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-sm text-slate-700">{group.category}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectAllInCategory(group.category, availablePerms)}
                              className="h-7 px-2 text-xs text-[#b08730] hover:text-[#8e6c25] hover:bg-slate-100"
                            >
                              {allSelected ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {group.items.map((perm) => {
                              const isChecked = formData.permissions.includes(perm.value);
                              return (
                                <div
                                  key={perm.value}
                                  onClick={() => handleTogglePermission(perm.value)}
                                  className="flex items-start gap-2.5 p-1.5 rounded hover:bg-white cursor-pointer select-none"
                                >
                                  <div className="mt-0.5 text-slate-400">
                                    {isChecked ? (
                                      <CheckSquare className="h-4 w-4 text-[#b08730] fill-[#b08730]/10" />
                                    ) : (
                                      <Square className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="text-xs font-semibold text-slate-700">{perm.label}</div>
                                    <div className="text-[11px] text-slate-400 leading-normal">{perm.description}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-[140px]"
                  disabled={isLoading || !formData.name || !formData.description || formData.permissions.length === 0}
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
                  onClick={() => navigate({ to: "/admin/settings/roles" })}
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
