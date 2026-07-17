import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mockCombinedRoles, ALL_PERMISSIONS, type RoleStatus } from "@/mock/roles/roles.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { PageHeader } from "@/components/admin/crud";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

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

  const handleToggleGranularPermission = (page: any, action: any) => {
    setFormData((prev) => {
      const isChecked = prev.permissions.includes(action.value);
      const isView = action.value.endsWith(":view");
      const viewActionVal = `${page.id}:view`;

      let newPerms = [...prev.permissions];

      if (isChecked) {
        // Uncheck
        if (isView) {
          // If unchecking view, remove ALL actions for this page
          const pageVals = page.actions.map((a: any) => a.value);
          newPerms = newPerms.filter((p) => !pageVals.includes(p));
        } else {
          newPerms = newPerms.filter((p) => p !== action.value);
        }
      } else {
        // Check
        newPerms.push(action.value);
        if (!isView) {
          // If checking any action, automatically check the view action if not already checked
          if (!newPerms.includes(viewActionVal)) {
            newPerms.push(viewActionVal);
          }
        }
      }

      return { ...prev, permissions: Array.from(new Set(newPerms)) };
    });
  };

  const handleToggleAllInPage = (page: any) => {
    const pageVals = page.actions.map((a: any) => a.value);
    setFormData((prev) => {
      const allChecked = pageVals.every((val: string) => prev.permissions.includes(val));
      let newPerms = [...prev.permissions];

      if (allChecked) {
        // Remove all
        newPerms = newPerms.filter((p) => !pageVals.includes(p));
      } else {
        // Add all
        newPerms = [...newPerms, ...pageVals];
      }

      return { ...prev, permissions: Array.from(new Set(newPerms)) };
    });
  };

  const handleSelectAllCategory = (catPerm: any) => {
    const allCatVals: string[] = [];
    catPerm.pages.forEach((p: any) => {
      p.actions.forEach((a: any) => {
        allCatVals.push(a.value);
      });
    });

    setFormData((prev) => {
      const newPerms = Array.from(new Set([...prev.permissions, ...allCatVals]));
      return { ...prev, permissions: newPerms };
    });
  };

  const handleClearCategory = (catPerm: any) => {
    const allCatVals: string[] = [];
    catPerm.pages.forEach((p: any) => {
      p.actions.forEach((a: any) => {
        allCatVals.push(a.value);
      });
    });

    setFormData((prev) => {
      const newPerms = prev.permissions.filter((p) => !allCatVals.includes(p));
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
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#b08730]" />
                  <div>
                    <h3 className="text-md font-bold text-slate-800">
                      กำหนดสิทธิ์การดำเนินการโดยละเอียด (Granular Action Permissions)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      เลือกสิทธิ์การเข้าถึงแต่ละหน้าและกำหนดสิทธิ์การกระทำในหน้านั้นๆ (เช่น ดู, เพิ่ม, แก้ไข, ลบ)
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mt-4">
                  {ALL_PERMISSIONS.map((catPerm) => {
                    return (
                      <div key={catPerm.category} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700">{catPerm.category}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectAllCategory(catPerm)}
                              className="text-xs font-semibold text-[#b08730] hover:text-[#8e6c25]"
                            >
                              เลือกทั้งหมดในหมวดหมู่นี้
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => handleClearCategory(catPerm)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                            >
                              ล้างทั้งหมด
                            </button>
                          </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {catPerm.pages.map((page) => {
                            const viewAction = page.actions.find(a => a.value.endsWith(":view"));
                            const hasViewPermission = viewAction ? formData.permissions.includes(viewAction.value) : false;
                            
                            // check if all actions of this page are checked
                            const allPageValues = page.actions.map(a => a.value);
                            const allChecked = allPageValues.every(val => formData.permissions.includes(val));

                            return (
                              <div key={page.id} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-start hover:bg-slate-50/50 transition-colors">
                                {/* Left Column: Page Name & Select All for Page */}
                                <div className="md:col-span-1 space-y-1">
                                  <span className="font-semibold text-sm text-slate-700 block">{page.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono block mb-2">{page.id}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAllInPage(page)}
                                    className="text-[11px] text-[#b08730] hover:underline font-medium"
                                  >
                                    {allChecked ? "ยกเลิกทั้งหมดในหน้านี้" : "เลือกทั้งหมดในหน้านี้"}
                                  </button>
                                </div>

                                {/* Right Column: Checkboxes for Actions */}
                                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {page.actions.map((act) => {
                                    const isChecked = formData.permissions.includes(act.value);
                                    const isView = act.value.endsWith(":view");

                                    return (
                                      <div
                                        key={act.value}
                                        onClick={() => handleToggleGranularPermission(page, act)}
                                        className={cn(
                                          "flex items-start gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/30 cursor-pointer select-none hover:bg-white hover:border-slate-300 transition-all",
                                          isChecked && "border-[#b08730]/40 bg-[#b08730]/5 hover:bg-[#b08730]/5 hover:border-[#b08730]/50",
                                          !isView && !hasViewPermission && "opacity-50 cursor-not-allowed bg-slate-100"
                                        )}
                                      >
                                        <div className="mt-0.5 shrink-0">
                                          {isChecked ? (
                                            <CheckSquare className="h-4 w-4 text-[#b08730] fill-[#b08730]/10" />
                                          ) : (
                                            <Square className="h-4 w-4 text-slate-400" />
                                          )}
                                        </div>
                                        <div className="leading-tight">
                                          <div className="text-xs font-semibold text-slate-700">{act.label}</div>
                                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">{act.value}</div>
                                          <div className="text-[10px] text-slate-400 leading-normal mt-1">{act.description}</div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
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
