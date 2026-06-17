import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, FileSearch, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/CMS/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/CMS/PageContainer";
import { StatusBadge } from "@/components/CMS/StatusBadge";
import {
  trackByReference,
  STATUS_LABELS,
  type ComplaintStatus,
} from "@/services/ComplaintService";

const searchSchema = z.object({
  ref: z.string().optional(),
});

export const Route = createFileRoute("/TrackComplaintRoute")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      {
        title: "ติดตามสถานะเรื่องร้องเรียน — บริษัท กลุ่มสมอทอง จำกัด (มหาชน)",
      },
      {
        name: "description",
        content: "ตรวจสอบสถานะเรื่องร้องเรียนด้วยหมายเลขอ้างอิง",
      },
    ],
  }),
  component: TrackPage,
});

interface TrackResult {
  reference_number: string;
  title: string;
  status: ComplaintStatus;
  priority: string;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
  history: {
    to_status: ComplaintStatus;
    from_status: ComplaintStatus | null;
    created_at: string;
  }[];
}

function TrackPage() {
  const search = Route.useSearch();
  const [ref, setRef] = useState(search.ref ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null | "not_found">(null);
  const { user, loading: authLoading } = useAuth();

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    try {
      const r = await trackByReference(ref.trim().toUpperCase());
      setResult(r ? (r as TrackResult) : "not_found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 text-xs text-muted-foreground">
          <span className="mx-1.5">›</span>{" "}
          <span className="text-foreground">ติดตามสถานะ</span>
        </div>
      </div>
      <section className="py-3">
        <MainLayout>
          <Link
            to="/"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> กลับสู่หน้าแรก
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">
            ติดตามสถานะเรื่องร้องเรียน
          </h1>
          <div className="mt-3 h-px w-12 bg-primary" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง (รูปแบบ{" "}
            <span className="font-mono">CMP-YYYY-XXXX</span>)
            เพื่อความเป็นส่วนตัว ระบบจะแสดงเฉพาะข้อมูลสรุปเท่านั้น
          </p>

          <div className="mt-6">
            <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
              <h1 className="font-display text-lg font-semibold text-primary">
                ติดตามสถานะเรื่องร้องเรียน
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง
              </p>
              <form onSubmit={lookup} className="mt-4">
                <Label
                  htmlFor="ref"
                  className="text-xs font-semibold tracking-wide text-muted-foreground"
                >
                  หมายเลขอ้างอิง
                </Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="ref"
                    placeholder="CMP-2026-0001"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    className="font-mono uppercase"
                  />
                  <Button
                    type="submit"
                    className="rounded-sm"
                    disabled={loading}
                  >
                    <FileSearch className="mr-1.5 h-4 w-4" />{" "}
                    {loading ? "กำลังตรวจสอบ…" : "ตรวจสอบสถานะ"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {result === "not_found" && (
            <div className="mt-6 flex items-start gap-3 border border-warning/40 bg-warning/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-warning-foreground" />
              <div>
                <div className="font-semibold">ไม่พบเรื่องร้องเรียน</div>
                <div className="text-sm text-muted-foreground">
                  ไม่พบเรื่องร้องเรียนที่ตรงกับหมายเลขอ้างอิง
                  โปรดตรวจสอบและลองใหม่อีกครั้ง
                </div>
              </div>
            </div>
          )}

          {result && result !== "not_found" && (
            <div className="mt-6 border border-border bg-card shadow-elegant">
              <div className="border-b border-border bg-[var(--surface-muted)] px-6 py-4">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-primary">
                  สถานะเรื่องร้องเรียน
                </div>
              </div>
              <div className="px-6 py-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {result.reference_number}
                    </div>
                    <h2 className="mt-1 font-display text-lg font-bold text-primary">
                      {result.is_sensitive
                        ? "เรื่องร้องเรียนที่เป็นความลับ"
                        : result.title}
                    </h2>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ส่งเมื่อ{" "}
                      {new Date(result.created_at).toLocaleDateString("th-TH")}{" "}
                      · อัปเดตล่าสุด{" "}
                      {new Date(result.updated_at).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                  <StatusBadge status={result.status} />
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
                    ลำดับสถานะ
                  </h3>
                  <ol className="mt-4 space-y-5 border-l border-border pl-6">
                    {result.history.length === 0 && (
                      <li className="text-sm text-muted-foreground">
                        ยังไม่มีการอัปเดตสถานะ
                      </li>
                    )}
                    {result.history.map((h, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border border-primary bg-card" />
                        <div className="font-medium">
                          {STATUS_LABELS[h.to_status]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(h.created_at).toLocaleString("th-TH")}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </MainLayout>
      </section>
    </PageContainer>
  );
}
