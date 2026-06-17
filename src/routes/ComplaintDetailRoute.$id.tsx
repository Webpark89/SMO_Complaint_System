import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ArrowLeft,
  Send,
  Lock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/CMS/PageContainer";
import { StatusBadge, PriorityDot } from "@/components/CMS/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { RequireAuth } from "@/services/security/RouteGuardService";
import {
  getComplaint,
  listComments,
  addComment,
  updateStatus,
  listStatusHistory,
  STATUS_LABELS,
  type ComplaintStatus,
  type UrgencyLevel,
} from "@/services/ComplaintService";

export const Route = createFileRoute("/ComplaintDetailRoute/$id")({
  head: () => ({
    meta: [
      { title: "รายละเอียดเรื่องร้องเรียน — บริษัท กลุ่มสมอทอง จำกัด (มหาชน)" },
    ],
  }),
  component: DetailPage,
});

interface ComplaintRow {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: string;
  is_anonymous: boolean;
  is_sensitive: boolean;
  hasWitness?: boolean;
  witnessNames?: string[];
  urgencyLevel?: UrgencyLevel;
  requestFollowUp?: boolean;
  followUpContact?: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_department: string | null;
  created_at: string;
  category?: { name: string; is_sensitive: boolean } | null;
}

function DetailPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading, isStaff, canViewSensitive } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ComplaintRow | null>(null);
  const [comments, setComments] = useState<
    {
      id: string;
      body: string;
      author_name: string | null;
      created_at: string;
      is_internal: boolean;
    }[]
  >([]);
  const [history, setHistory] = useState<
    {
      id: string;
      to_status: ComplaintStatus;
      from_status: ComplaintStatus | null;
      created_at: string;
    }[]
  >([]);
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([getComplaint(id), listComments(id), listStatusHistory(id)])
      .then(([c, cm, h]) => {
        setData(c as ComplaintRow | null);
        setComments(cm);
        setHistory(h);
      })
      .catch(() => toast.error("ไม่สามารถโหลดข้อมูลเรื่องร้องเรียนได้"))
      .finally(() => setBusy(false));
  }, [id, user]);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      await addComment(id, body.trim(), internal && isStaff);
      setBody("");
      setInternal(false);
      const cm = await listComments(id);
      setComments(cm);
      toast.success("ส่งข้อความแล้ว");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ส่งข้อความไม่สำเร็จ");
    } finally {
      setPosting(false);
    }
  }

  async function changeStatus(s: ComplaintStatus) {
    try {
      await updateStatus(id, s);
      const [c, h] = await Promise.all([
        getComplaint(id),
        listStatusHistory(id),
      ]);
      setData(c as ComplaintRow | null);
      setHistory(h);
      toast.success(`อัปเดตสถานะเป็น ${STATUS_LABELS[s]}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "อัปเดตสถานะไม่สำเร็จ");
    }
  }

  if (authLoading || !user) return null;

  if (busy) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-12 text-sm text-muted-foreground">
          กำลังโหลดข้อมูล…
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <div className="container mx-auto max-w-xl px-4 py-3 text-center">
          <h1 className="font-display text-2xl font-bold">
            ไม่พบเรื่องร้องเรียน
          </h1>
          <p className="mt-2 text-muted-foreground">
            เรื่องนี้อาจไม่มีอยู่ หรือท่านอาจไม่มีสิทธิ์เข้าถึง
          </p>
          <Button asChild className="mt-6">
            <Link to="/">กลับ</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const restricted =
    data.is_sensitive && !canViewSensitive && !isStaff ? false : true;
  // (visibility already enforced by RLS — if data is here, user can see it)
  void restricted;

  return (
    <PageContainer>
      <section className="container mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> ย้อนกลับ
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {data.reference_number}
                  </div>
                  <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">
                    {data.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{data.category?.name ?? "ไม่ระบุหมวดหมู่"}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <PriorityDot priority={data.priority} />{" "}
                      {priorityLabel(data.priority)}
                    </span>
                    {data.is_anonymous && (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> ไม่ระบุตัวตน
                      </span>
                    )}
                    {data.is_sensitive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">
                        <AlertTriangle className="h-3 w-3" /> เป็นความลับสูง
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={data.status} />
              </div>

              <div className="mt-6 whitespace-pre-wrap rounded-lg border border-border bg-secondary/30 p-4 text-sm leading-relaxed">
                {data.description}
              </div>

              {!data.is_anonymous && (
                <div className="mt-4 grid gap-2 rounded-lg border border-border p-4 text-sm sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      ชื่อ-นามสกุล
                    </div>
                    <div>{data.reporter_name ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">อีเมล</div>
                    <div>{data.reporter_email ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      หน่วยงาน
                    </div>
                    <div>{data.reporter_department ?? "—"}</div>
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-2 rounded-lg border border-border bg-secondary/20 p-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">
                    มีพยานหรือไม่?
                  </div>
                  <div>{data.hasWitness ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Witness Names
                  </div>
                  <div>
                    {data.witnessNames?.length
                      ? data.witnessNames.join(", ")
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    ระดับความสำคัญ
                  </div>
                  <div>{urgencyLabel(data.urgencyLevel ?? "medium")}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Follow-up</div>
                  <div>
                    {data.requestFollowUp
                      ? data.followUpContact || "Requested"
                      : "No follow-up requested"}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4" /> การสนทนา
              </div>
              <div className="mt-4 space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    ยังไม่มีข้อความ
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-lg border p-4 ${c.is_internal ? "border-warning/40 bg-warning/5" : "border-border bg-secondary/30"}`}
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {c.author_name ?? "ผู้ใช้"}
                        </span>
                        <span>
                          {new Date(c.created_at).toLocaleString("th-TH")}
                        </span>
                      </div>
                      {c.is_internal && (
                        <div className="mt-1 text-[10px] font-bold tracking-wide text-warning-foreground">
                          บันทึกภายใน
                        </div>
                      )}
                      <div className="mt-2 whitespace-pre-wrap text-sm">
                        {c.body}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={postComment}
                className="mt-6 space-y-3 border-t border-border pt-6"
              >
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="เพิ่มข้อความ…"
                  maxLength={2000}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between gap-3">
                  {isStaff ? (
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                      <Checkbox
                        checked={internal}
                        onCheckedChange={(v) => setInternal(v === true)}
                      />
                      บันทึกภายใน (เฉพาะเจ้าหน้าที่)
                    </label>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" disabled={posting || !body.trim()}>
                    <Send className="mr-1.5 h-4 w-4" /> ส่ง
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {isStaff && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
                  อัปเดตสถานะ
                </h3>
                <Select
                  value={data.status}
                  onValueChange={(v: ComplaintStatus) => changeStatus(v)}
                >
                  <SelectTrigger
                    className="mt-2"
                    aria-label="สถานะเรื่องร้องเรียน"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABELS) as ComplaintStatus[]).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
                ลำดับสถานะ
              </h3>
              <ol className="mt-4 space-y-4 border-l-2 border-border pl-5">
                {history.map((h) => (
                  // แนะนำให้ใช้ h.id หรือ h.history_id แทน index ถ้ามี
                  <li
                    key={h.id ?? `${h.created_at}-${history.indexOf(h)}`}
                    className="relative"
                  >
                    <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div className="text-sm font-medium">
                      {STATUS_LABELS[h.to_status] || "ไม่ทราบสถานะ"}
                    </div>
                    <div
                      className="text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {h.created_at
                        ? new Date(h.created_at).toLocaleString("th-TH")
                        : "ไม่ระบุเวลา"}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}

function priorityLabel(p: string): string {
  const map: Record<string, string> = {
    low: "ต่ำ",
    medium: "ปานกลาง",
    high: "สูง",
    critical: "เร่งด่วน",
  };
  return map[p] ?? p;
}

function urgencyLabel(level: UrgencyLevel): string {
  const map: Record<UrgencyLevel, string> = {
    low: "ต่ำ",
    medium: "ปานกลาง",
    high: "สูง",
    critical: "เร่งด่วน",
  };
  return map[level] ?? level;
}
