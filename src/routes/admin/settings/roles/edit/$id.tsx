import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockCombinedRoles, ALL_PERMISSIONS, type RoleStatus } from "@/mock/roles/roles.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/settings/roles/edit/$id")({
  component: EditRolePage,
});

const STATUS_OPTIONS = ["เปิดใช้งาน", "ระงับ"];

function EditRolePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { hasPermission, loading } = useAuth();

  useEffect(() => {
    if (!loading && !hasPermission("manage_roles")) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, hasPermission, navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "เปิดใช้งาน",
    permissions: [] as string[],
  });

  useEffect(() => {
    if (loading || !hasPermission("manage_roles")) return;
    setIsLoading(true);
    setTimeout(() => {
      const role = mockCombinedRoles.find((r) => r.id === id);
      if (role) {
        setFormData({
          name: role.name,
          description: role.description,
          status: role.status,
          permissions: [...role.permissions],
        });
      } else {
        setError("ไม่พบข้อมูลบทบาท/แผนกนี้");
      }
      setIsLoading(false);
    }, 400);
  }, [id]);

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
        // Deselect all in this category
        newPerms = prev.permissions.filter((p) => !availablePerms.includes(p));
      } else {
        // Select all in this category (without duplicates)
        newPerms = Array.from(new Set([...prev.permissions, ...availablePerms]));
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const index = mockCombinedRoles.findIndex((r) => r.id === id);
      if (index !== -1) {
        mockCombinedRoles[index] = {
          ...mockCombinedRoles[index],
          name: formData.name,
          description: formData.description,
          status: formData.status as RoleStatus,
          permissions: formData.permissions,
        };
      }
      
      setIsLoading(false);
      navigate({ to: "/admin/settings/roles" });
    }, 600);
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

  // Group permissions by category
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="สิทธิ์การใช้งาน"
            description="จัดการสิทธิ์การใช้งานของระบบ (ข้อมูลจำลอง)"
            breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "สิทธิ์การใช้งาน" }]}
          />
          <Card className="w-full border-[var(--border)] bg-white shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-red-500 font-medium text-lg">{error}</p>
              <Button variant="outline" onClick={() => navigate({ to: "/admin/settings/roles" })}>
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
          title="สิทธิ์การใช้งาน"
          description="จัดการและแก้ไขสิทธิ์ระดับบทบาท/แผนก (ข้อมูลจำลอง)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" }, 
            { label: "สิทธิ์การใช้งาน" },
            { label: "แก้ไขสิทธิ์การใช้งาน" }
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
                แก้ไขข้อมูลสิทธิ์
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">
                    ชื่อบทบาท/แผนก <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                    placeholder="กรอกชื่อบทบาท"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
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

                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-sm font-semibold text-slate-700">
                    คำอธิบาย
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all"
                    placeholder="กรอกคำอธิบายเพิ่มเติม"
                  />
                </div>
              </div>

              {/* Granular Action Permissions */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#b08730]" />
                  กำหนดสิทธิ์การดำเนินการโดยละเอียด (Granular Action Permissions)
                </h3>
                <p className="text-xs text-slate-500">
                  เลือกสิทธิ์การดำเนินการในแต่ละส่วนที่เกี่ยวข้องกับบทบาทนี้เพื่อควบคุมการเข้าใช้งานหลังบ้าน
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
                  {categories.map((category) => {
                    const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === category);
                    const categoryPermsValues = categoryPerms.map((p) => p.value);
                    const allSelected = categoryPermsValues.every((v) => formData.permissions.includes(v));

                    return (
                      <div key={category} className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                          <span className="text-sm font-bold text-slate-700">{category}</span>
                          <button
                            type="button"
                            onClick={() => handleSelectAllInCategory(category, categoryPermsValues)}
                            className="text-xs font-semibold text-[#b08730] hover:text-[#8e6c25] flex items-center gap-1 transition-colors"
                          >
                            {allSelected ? "ล้างการเลือก" : "เลือกทั้งหมด"}
                          </button>
                        </div>

                        <div className="space-y-2">
                          {categoryPerms.map((perm) => {
                            const isChecked = formData.permissions.includes(perm.value);
                            return (
                              <button
                                key={perm.value}
                                type="button"
                                onClick={() => handleTogglePermission(perm.value)}
                                className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left hover:bg-slate-100 transition-colors"
                              >
                                {isChecked ? (
                                  <CheckSquare className="h-4 w-4 text-[#b08730] shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                )}
                                <div className="leading-tight">
                                  <div className="text-sm font-medium text-slate-700">{perm.label}</div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{perm.value}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-[140px]"
                  disabled={isLoading || !formData.name}
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
