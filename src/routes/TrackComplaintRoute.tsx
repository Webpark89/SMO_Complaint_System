import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, FileSearch, AlertTriangle, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/CMS/CMSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/CMS/PageContainer";
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
  complaint_type_name?: string;
  branch_name?: string;
  incident_date?: string;
  incident_time?: string;
  immediate_actions?: string[];
  causes?: string[];
  preventive_actions?: string[];
  history: {
    to_status: ComplaintStatus;
    from_status: ComplaintStatus | null;
    created_at: string;
  }[];
}

interface ResolutionCardProps {
  title: string;
  items?: string[];
}

function ResolutionCard({ title, items }: ResolutionCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-[20px] sm:p-6 shadow-sm mb-4">
      <h4 className="font-bold text-gray-800">{title}</h4>
      {items && items.length > 0 ? (
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">- ไม่มีข้อมูล -</p>
      )}
    </div>
  );
}

// ฟังก์ชันสำหรับจัดเรียงและดึงเวลาที่รองรับ พ.ศ.
const parseTime = (dateStr: string) => {
  if (!dateStr || dateStr.trim() === "") return null;
  const iso = new Date(dateStr).getTime();
  if (!isNaN(iso)) return iso;
  const parts = dateStr.split(/[ /:TZ-]+/);
  if (parts.length >= 3) {
    let y = Number(parts[2]);
    if (y > 2500) y -= 543;
    return new Date(y, Number(parts[1]) - 1, Number(parts[0]), Number(parts[3]||0), Number(parts[4]||0), Number(parts[5]||0)).getTime();
  }
  return 0;
};

// ฟังก์ชันแสดงเวลาปลอดภัย
const displayDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) ? d.toLocaleString("th-TH") : dateStr;
};

// --- MOCK DATA สำหรับกรณีที่ Backend ยังไม่ส่งข้อมูลส่วนนี้มา ---
const mockResolutionData = {
  immediateAction: [
    "เจ้าหน้าที่ได้รับเรื่องร้องเรียนและดำเนินการตรวจสอบข้อเท็จจริงเบื้องต้นทันที",
    "มีการรวบรวมข้อมูลที่เกี่ยวข้อง รวมถึงเอกสาร หลักฐาน และข้อมูลจากผู้เกี่ยวข้อง เพื่อใช้ประกอบการพิจารณา",
    "ประสานงานไปยังหน่วยงานที่รับผิดชอบเพื่อระงับหรือควบคุมผลกระทบที่อาจเกิดขึ้นระหว่างการตรวจสอบ"
  ],
  cause: [
    "จากการตรวจสอบพบว่ากระบวนการปฏิบัติงานและการสื่อสารระหว่างผู้เกี่ยวข้องมีความคลาดเคลื่อน ส่งผลให้เกิดความเข้าใจที่ไม่ตรงกัน",
    "แนวทางการดำเนินงานบางส่วนยังขาดความชัดเจนในการกำกับดูแลและติดตามผล ทำให้เกิดข้อร้องเรียนดังกล่าว"
  ],
  preventiveAction: [
    "ทบทวนและปรับปรุงแนวทางปฏิบัติงานที่เกี่ยวข้องให้มีความชัดเจนและเป็นมาตรฐานเดียวกัน",
    "สื่อสารและสร้างความเข้าใจแก่พนักงานและผู้ที่เกี่ยวข้องกับจรรยาบรรณทางธุรกิจและแนวปฏิบัติที่ถูกต้อง",
    "กำหนดกระบวนการติดตามและตรวจสอบอย่างสม่ำเสมอ เพื่อป้องกันการเกิดเหตุในลักษณะเดียวกันซ้ำ",
    "เพิ่มช่องทางการรับฟังข้อเสนอแนะและข้อร้องเรียน เพื่อให้สามารถตรวจพบและแก้ไขปัญหาได้อย่างรวดเร็ว"
  ]
};

const DEFAULT_VISIBLE_COUNT = 3;

function TrackPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [ref, setRef] = useState(search.ref ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null | "not_found">(null);
  
  // State สำหรับควบคุมการ Expand/Collapse ของ Timeline
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const { user, loading: authLoading } = useAuth();

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    try {
      const r = await trackByReference(ref.trim().toUpperCase());
      setResult(r ? (r as TrackResult) : "not_found");
      setIsTimelineExpanded(false); // รีเซ็ตสถานะเมื่อค้นหาใหม่
    } finally {
      setLoading(false);
    }
  }

  // ฟังก์ชันกลับสู่หน้าค้นหา (เคลียร์ข้อมูล)
  const handleBackToSearch = () => {
    setResult(null);
    setRef("");
    setIsTimelineExpanded(false);
    navigate({ search: {} }); // เคลียร์ URL param
  };

  const showResult = result && result !== "not_found";

  // หา Status ล่าสุดเพื่อนำไปกำหนดสี Badge และดึง sorted history
  let currentStatusLabel = "-";
  let sortedHistory: TrackResult["history"] = [];
  
  if (showResult && typeof result !== "string") {
    sortedHistory = [...result.history].sort((a, b) => {
      const timeA = parseTime(a.created_at);
      const timeB = parseTime(b.created_at);
      if (timeA === null && timeB === null) return 0;
      if (timeA === null) return -1;
      if (timeB === null) return 1;
      return timeB - timeA;
    });
    const latest = sortedHistory[0];
    currentStatusLabel = latest ? (STATUS_LABELS[latest.to_status] || latest.to_status) : (STATUS_LABELS[result.status] || result.status);
  }

  // คำนวณข้อมูลสำหรับการแสดง Timeline
  const visibleHistory = isTimelineExpanded 
    ? sortedHistory 
    : sortedHistory.slice(0, DEFAULT_VISIBLE_COUNT);
  
  const hasMoreHistory = sortedHistory.length > DEFAULT_VISIBLE_COUNT;

  // กำหนดสีพื้นหลัง Badge ตามสถานะ
  const getBadgeColor = (status: string) => {
    if (status === "ปิดเรื่อง") return "bg-[#09A129]"; // สีเขียว
    if (status === "ปฏิเสธ" || status === "ส่งกลับให้ทบทวน") return "bg-[#FF4D00]"; // สีแดง
    if (status === "รอพิจารณา") return "bg-[#F9C80E]"; // สีเหลือง
    return "bg-[#484D57]"; // สีเทา (อื่นๆ)
  };

  return (
    <PageContainer>
      <section className="py-3 md:py-8">
        <MainLayout>
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#002856] hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>กลับสู่หน้าแรก</span>
            </Link>
          </div>

          {/* =======================
              VIEW 1: หน้าฟอร์มค้นหา
              ======================= */}
          {!showResult && (
            <>
              <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">
                ติดตามสถานะเรื่องร้องเรียน
              </h1>
              <div className="mt-3 h-px w-24 bg-[#D29E0E]" />
              <p className="mt-4 text-sm leading-relaxed text-[#002856]">
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
                    <div className="flex flex-col gap-2 sm:flex-row">
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
            </>
          )}


          {/* =======================
              VIEW 2: หน้าแสดงผลลัพธ์
              ======================= */}
          {showResult && typeof result !== "string" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <button
                onClick={handleBackToSearch}
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าติดตามสถานะเรื่องร้องเรียน
              </button>
              
              <h1 className="mt-6 font-display text-3xl font-bold text-primary md:text-4xl">
                ติดตามสถานะเรื่องร้องเรียน
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง (รูปแบบ CMP-YYYY-XXXX) เพื่อความเป็นส่วนตัว ระบบจะแสดงเฉพาะข้อมูลสรุปเท่านั้น
              </p>

              <div className="mt-8 rounded-lg border border-border bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-border bg-[#F4F4F4]">
                  <h2 className="text-xl font-bold text-[#002856]">
                    สถานะเรื่องร้องเรียน
                  </h2>
                  <div className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-md text-sm font-semibold text-white ${getBadgeColor(currentStatusLabel)}`}>
                    {currentStatusLabel}
                  </div>
                </div>

                <div className="p-6">
                  
                  {/* กรอบรายละเอียด */}
                  <div className="bg-[#F9FAFB] border border-[#D6D7D9] rounded-lg p-5 space-y-3">
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                      <span className="font-bold">หมายเลขอ้างอิง :</span>
                      <span>{result.reference_number}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                      <span className="font-bold">ประเภทเรื่องร้องเรียน :</span>
                      <span>{result.complaint_type_name || "-"}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                      <span className="font-bold">สาขาที่เกิดเหตุ :</span>
                      <span>{result.branch_name || "-"}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                      <span className="font-bold">วันที่และเวลาที่เกิดเหตุ :</span>
                      <span>
                        {result.incident_date 
                          ? `วันที่ ${result.incident_date} ${result.incident_time ? `เวลา ${result.incident_time} น.` : ''}` 
                          : "-"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                      <span className="font-bold">อัปเดตล่าสุด :</span>
                      <span>{new Date(result.updated_at).toLocaleDateString("th-TH")}</span>
                    </div>
                  </div>

                  {/* เส้นกั้น */}
                  <div className="my-8 border-t border-slate-200"></div>

                  {/* --- ส่วนแสดงผล Timeline --- */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      ลำดับสถานะ:
                    </h3>
                    
                    <div className="mt-6 ml-2">
                      {sortedHistory.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          ยังไม่มีการอัปเดตสถานะ
                        </div>
                      ) : (
                        <div className="flex flex-col transition-all duration-300 ease-in-out">
                          {visibleHistory.map((h, i) => {
                            const isLatest = i === 0 && !isTimelineExpanded; // Highlight เฉพาะอันล่าสุดจริงๆ ถ้าย่ออยู่
                            const statusLabel = STATUS_LABELS[h.to_status] || h.to_status;
                            const isLastVisible = i === visibleHistory.length - 1;

                            // จัดการสีของจุด
                            let textColor = "text-muted-foreground"; 
                            let dotBorder = "border-muted-foreground/30"; 
                            let dotBg = "bg-card"; 

                            // ให้จุดแรกสุด (index 0) ของทั้งหมดเป็นสีเด่น
                            if (i === 0) {
                              if (statusLabel === "ปิดเรื่อง") {
                                textColor = "text-[#00B14F]"; 
                                dotBorder = "border-[#00B14F]";
                                dotBg = "bg-[#00B14F]"; 
                              } else if (statusLabel === "รอพิจารณา") {
                                textColor = "text-amber-500"; 
                                dotBorder = "border-amber-500";
                                dotBg = "bg-amber-500"; 
                              } else if (statusLabel === "ปฏิเสธ" || statusLabel === "ส่งกลับให้ทบทวน") {
                                textColor = "text-red-500"; 
                                dotBorder = "border-red-500";
                                dotBg = "bg-red-500"; 
                              } else {
                                textColor = "text-primary";
                                dotBorder = "border-primary";
                                dotBg = "bg-primary";
                              }
                            } else {
                              // ถ้าเป็นจุดเก่า (ไม่อันดับ 1) สีเทา
                              textColor = "text-muted-foreground/70";
                              dotBg = "bg-transparent";
                            }

                            return (
                              <div key={i} className="relative pl-8 pb-8 last:pb-0 animate-in fade-in duration-300">
                                {/* เส้นเชื่อม (สีเทาเสมอ) */}
                                {!isLastVisible && (
                                  <span className="absolute left-[8px] top-[24px] bottom-[-8px] w-[2px] bg-muted-foreground/20" />
                                )}
                                
                                {/* จุด (Node) */}
                                <span 
                                  className={`absolute left-0 top-1.5 flex h-[18px] w-[18px] rounded-full border-2 ${dotBorder} ${dotBg}`}
                                />
                                
                                <div className={`font-bold text-[15px] ${textColor}`}>
                                  {statusLabel}
                                </div>
                                
                                <div className="mt-1 text-[13px] text-muted-foreground/70">
                                  {h.created_at ? displayDate(h.created_at) : "ยังไม่มีข้อมูลเวลา"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ปุ่มดูเพิ่มเติม / ย่อกลับ */}
                      {hasMoreHistory && (
                        <div className="mt-2 flex justify-center w-full">
                          <button
                            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                            className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer group"
                          >
                            <span>{isTimelineExpanded ? "ย่อกลับ" : "ดูเพิ่มเติม"}</span>
                            {isTimelineExpanded ? (
                              <ChevronUp className="h-4 w-4 mt-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            ) : (
                              <ChevronDown className="h-4 w-4 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- ส่วนแสดงผลแบบมีเงื่อนไข (Card 3 กล่อง) เมื่อปิดเรื่อง --- */}
                  {currentStatusLabel === "ปิดเรื่อง" && (
                    <div className="mt-8">
                      <div className="border-t border-slate-200 mb-8"></div>
                      <div className="space-y-4">
                        <ResolutionCard 
                          title="มาตรการแก้ไขเฉพาะหน้า :" 
                          items={mockResolutionData.immediateAction} 
                        />
                        <ResolutionCard 
                          title="สาเหตุ :" 
                          items={mockResolutionData.cause} 
                        />
                        <ResolutionCard 
                          title="มาตรการแก้ไขและป้องกันไม่ให้เกิดซ้ำ :" 
                          items={mockResolutionData.preventiveAction} 
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </MainLayout>
      </section>
    </PageContainer>
  );
}