import { useState, useCallback } from "react";
import { FileText, Save, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PageHeader, ActionToolbar } from "@/components/admin/crud";

type TermPrivacyRow = {
  id: string;
  title: string;
  type: "terms" | "privacy";
  content: string;
  fileName: string | null;
  updatedAt: string;
};

const mockTermPrivacyData: TermPrivacyRow[] = [
  {
    id: "TP-001",
    title: "เงื่อนไขการใช้งาน",
    type: "terms",
    content:
      "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) (สมอ.) ให้ความสำคัญต่อกระบวนการรับเรื่องร้องเรียน...",
    fileName: null,
    updatedAt: "2026-06-05",
  },
  {
    id: "TP-002",
    title: "การรักษาความปลอดภัยของข้อมูลส่วนบุคคล",
    type: "privacy",
    content:
      "ท่านสามารถศึกษารายละเอียดของ แบบแจ้งเกี่ยวกับข้อมูลส่วนบุคคล (Privacy Notice) ได้ที่นี่",
    fileName: "privacy-policy-2026.pdf",
    updatedAt: "2026-06-05",
  },
];

export function TermPrivacyPage() {
  const [items, setItems] = useState<TermPrivacyRow[]>(mockTermPrivacyData);
  const [isLoading, setIsLoading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const handleImport = useCallback(
    () => alert("นำเข้าเอกสาร Terms & Privacy (จำลอง)"),
    [],
  );
  const handleExport = useCallback(
    () => alert("ส่งออกเอกสาร Terms & Privacy (จำลอง)"),
    [],
  );

  const handleEditClick = useCallback((item: TermPrivacyRow) => {
    setEditingId(item.id);
    setEditValues({ title: item.title, content: item.content });
    setUploadedFile(null);
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
    },
    [],
  );

  const handleSave = useCallback(() => {
    if (!editingId || !editValues) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: editValues.title,
              content: editValues.content,
              fileName: uploadedFile ? uploadedFile.name : item.fileName,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : item,
      ),
    );
    setEditingId(null);
    setEditValues(null);
    setUploadedFile(null);
    alert("บันทึกเรียบร้อย");
  }, [editingId, editValues, uploadedFile]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditValues(null);
    setUploadedFile(null);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="เงื่อนไขการใช้งาน และการรักษาความปลอดภัยของข้อมูลส่วนบุคคล"
        description="จัดการเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว"
        breadcrumbs={[
          { label: "ตั้งค่าระบบ" },
          { label: "เงื่อนไขและความเป็นส่วนตัว" },
        ]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            exportLabel="ส่งออก"
            isLoading={isLoading}
          />
        }
      />

      {/* Terms & Privacy Card รวมอยู่ใน Card เดียว */}
      {items.map((item) => (
        <Card
          key={item.id}
          className="border-[var(--border)] bg-white shadow-soft"
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
              </div>
              {editingId !== item.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditClick(item)}
                  className="gap-1"
                >
                  <FileText className="h-3 w-3" /> แก้ไข
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Input
                value={
                  editingId === item.id && editValues
                    ? editValues.title
                    : item.title
                }
                onChange={(e) =>
                  editingId === item.id &&
                  setEditValues((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
                disabled={editingId !== item.id}
                className={
                  editingId !== item.id ? "bg-[var(--surface-muted)]" : ""
                }
              />
              <Textarea
                value={
                  editingId === item.id && editValues
                    ? editValues.content
                    : item.content
                }
                onChange={(e) =>
                  editingId === item.id &&
                  setEditValues((prev) =>
                    prev ? { ...prev, content: e.target.value } : null,
                  )
                }
                disabled={editingId !== item.id}
                className={`h-32 w-full ${editingId !== item.id ? "bg-[var(--surface-muted)]" : ""}`}
              />
              {editingId === item.id && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    ยกเลิก
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-1 h-3 w-3" /> บันทึก
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* File Upload */}
      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-700">อัปโหลดไฟล์เอกสาร</h3>
              <p className="text-sm text-muted-foreground">
                รองรับ PDF, DOC, DOCX
              </p>
            </div>
            <div className="flex items-center gap-3">
              {uploadedFile && (
                <span className="text-sm text-[var(--success)]">
                  {uploadedFile.name}
                </span>
              )}
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("term-privacy-file-upload")?.click()
                }
                className="gap-1"
              >
                <Upload className="h-4 w-4" /> เลือกไฟล์
              </Button>
              <Input
                id="term-privacy-file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
