import { useState, useCallback } from "react";
import { FileText, Save, Upload, ShieldCheck, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PageHeader, ActionToolbar } from "@/components/admin/crud";

// โครงสร้างข้อมูลรวบยอด
type TermPrivacyData = {
  termsTitle: string;
  termsContent: string;
  privacyTitle: string;
  privacyContent: string;
  privacyFileName: string | null;
  updatedAt: string;
};

const mockData: TermPrivacyData = {
  termsTitle: "เงื่อนไขการใช้งาน",
  termsContent:
    "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) (สมอ.) ให้ความสำคัญต่อกระบวนการรับเรื่องร้องเรียน...",
  privacyTitle: "การรักษาความปลอดภัยของข้อมูลส่วนบุคคล",
  privacyContent:
    "ท่านสามารถศึกษารายละเอียดเกี่ยวกับการเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคล โดยคลิกที่ แบบแจ้งเกี่ยวกับข้อมูลส่วนบุคคล (Privacy Notice)",
  privacyFileName: "privacy-policy-2026.pdf",
  updatedAt: "2026-06-05",
};

export function TermPrivacyPage() {
  const [data, setData] = useState<TermPrivacyData>(mockData);
  const [isLoading, setIsLoading] = useState(false);

  // --- State สำหรับส่วนแก้ไขข้อความ ---
  const [isEditingText, setIsEditingText] = useState(false);
  const [editValues, setEditValues] = useState<TermPrivacyData>(mockData);

  // --- State สำหรับส่วนอัปโหลดไฟล์ ---
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const handleImport = useCallback(
    () => alert("นำเข้าเอกสาร Terms & Privacy (จำลอง)"),
    [],
  );

  // --- Handlers สำหรับส่วนข้อความ ---
  const handleEditTextClick = useCallback(() => {
    setIsEditingText(true);
    setEditValues(data);
  }, [data]);

  const handleSaveText = useCallback(() => {
    setData((prev) => ({
      ...prev,
      termsTitle: editValues.termsTitle,
      termsContent: editValues.termsContent,
      privacyTitle: editValues.privacyTitle,
      privacyContent: editValues.privacyContent,
      updatedAt: new Date().toISOString().split("T")[0],
    }));
    setIsEditingText(false);
    alert("บันทึกข้อมูลเนื้อหาเรียบร้อย");
  }, [editValues]);

  const handleCancelText = useCallback(() => {
    setIsEditingText(false);
  }, []);

  // --- Handlers สำหรับส่วนไฟล์อัปโหลด ---
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
    },
    [],
  );

  const handleSaveFile = useCallback(() => {
    if (!uploadedFile) return;
    setData((prev) => ({
      ...prev,
      privacyFileName: uploadedFile.name,
      updatedAt: new Date().toISOString().split("T")[0],
    }));
    setUploadedFile(null);
    alert("อัปโหลดไฟล์เอกสารเรียบร้อย");
  }, [uploadedFile]);

  const handleCancelFile = useCallback(() => {
    setUploadedFile(null);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="เงื่อนไขการใช้งานและการรักษาความปลอดภัยของข้อมูลส่วนบุคคล"
        description="จัดการเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของแพลตฟอร์ม"
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

      {/* =========================================================
          ส่วนที่ 1: จัดการข้อความ (Terms & Privacy)
          ========================================================= */}
      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-[#111827]">
            เนื้อหาข้อตกลงและนโยบาย
          </CardTitle>
          {!isEditingText && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEditTextClick}
              className="gap-2"
            >
              <FileText className="h-4 w-4" /> แก้ไขข้อความ
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* เงื่อนไขการใช้งาน */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-800 text-base">
                เงื่อนไขการใช้งาน
              </h3>
            </div>
            <div className="space-y-3 pl-7">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  รายละเอียด
                </label>
                <Textarea
                  value={
                    isEditingText ? editValues.termsContent : data.termsContent
                  }
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      termsContent: e.target.value,
                    })
                  }
                  disabled={!isEditingText}
                  className={`h-28 w-full ${
                    !isEditingText
                      ? "bg-[var(--surface-muted)] text-slate-700 opacity-100"
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* การรักษาความปลอดภัยของข้อมูลส่วนบุคคล (Text Only) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-800 text-base">
                การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
              </h3>
            </div>
            <div className="space-y-4 pl-7">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">
                  รายละเอียด
                </label>
                <Textarea
                  value={
                    isEditingText
                      ? editValues.privacyContent
                      : data.privacyContent
                  }
                  onChange={(e) =>
                    setEditValues({
                      ...editValues,
                      privacyContent: e.target.value,
                    })
                  }
                  disabled={!isEditingText}
                  className={`h-28 w-full ${
                    !isEditingText
                      ? "bg-[var(--surface-muted)] text-slate-700 opacity-100"
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ปุ่ม Action สำหรับ Text */}
          {isEditingText && (
            <>
              <hr className="border-slate-100 mt-6 mb-4" />
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancelText}
                  className="px-6"
                >
                  ยกเลิก
                </Button>
                <Button onClick={handleSaveText} className="px-6 gap-2">
                  <Save className="h-4 w-4" /> บันทึกข้อความ
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* =========================================================
          ส่วนที่ 2: อัปโหลดไฟล์เอกสาร (Privacy Policy)
          ========================================================= */}
      <div>
        <h2 className="font-display text-lg font-semibold text-primary mb-3 pl-1">
          เอกสารแนบ: การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
        </h2>
        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-700">
                  ไฟล์ Privacy Policy ปัจจุบัน
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  รองรับ PDF, DOC, DOCX
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* แสดงชื่อไฟล์ */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-md w-full sm:w-auto">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span
                    className={`text-sm ${
                      uploadedFile
                        ? "text-[var(--success)] font-medium"
                        : "text-slate-600"
                    }`}
                  >
                    {uploadedFile
                      ? uploadedFile.name
                      : data.privacyFileName || "ยังไม่มีไฟล์เอกสาร"}
                  </span>
                  {uploadedFile && (
                    <Button
                      onClick={handleCancelFile}
                      className="ml-2 text-slate-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* กลุ่มปุ่ม Action ไฟล์ */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {!uploadedFile ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        document
                          .getElementById("term-privacy-file-upload")
                          ?.click()
                      }
                      className="gap-2 w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4" />
                      {data.privacyFileName ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSaveFile}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4" /> บันทึกไฟล์
                    </Button>
                  )}
                </div>

                {/* Hidden File Input */}
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
    </div>
  );
}
