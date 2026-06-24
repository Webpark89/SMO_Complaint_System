import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Lock,
  CheckCircle2,
  Copy,
  Upload,
  X,
  FileText,
  Tag,
  MessageSquareText,
  Clock,
  Edit2,
  Plus,
  ClipboardCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PageContainer } from "@/components/CMS/PageContainer";
import { MainLayout } from "@/components/CMS/CMSLayout";
import { useI18n } from "@/i18n/i18n";
import {
  submitComplaint, // เก็บไว้เผื่ออนาคตกลับมาใช้
  type ComplaintPriority,
} from "@/services/ComplaintService";
import {
  complaintTypes,
  hasWitnessField,
} from "@/mock/complaints/complaintTypes";
import { complaintLocations } from "@/mock/organization";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, BookOpen, Edit, ShieldCheck } from "lucide-react";

interface TermsAndPrivacyContentProps {}
export const TermsAndPrivacyContent = forwardRef<
  HTMLDivElement,
  TermsAndPrivacyContentProps
>(function TermsAndPrivacyContent(_props, ref) {
  return (
    <div>
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:gap-4 md:text-left">
        <div className="flex-none">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex justify-center md:justify-start">
            <h1 className="font-display text-lg font-bold text-primary">
              เงื่อนไขการใช้งานและการรักษาความปลอดภัยของข้อมูลส่วนบุคคล
            </h1>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">05 พ.ค. 2569</div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-foreground/80 md:text-left">
        กรุณากด "เข้าใจและยอมรับเงื่อนไขการใช้งาน"{" "}
        <span className="whitespace-nowrap md:whitespace-normal">
          ก่อนไปหน้าถัดไป
        </span>
      </p>

      <div
        ref={ref}
        className="mt-4 max-h-[450px] overflow-y-auto rounded-md border border-border bg-[var(--surface-muted)] p-5"
      >
        <h2 className="text-base font-semibold text-primary">
          เงื่อนไขการใช้งาน
        </h2>
        <p className="mt-3 text-sm text-foreground/80">
          บริษัท กลุ่มสมอทอง จำกัด (มหาชน) (สมอ.)
          ให้ความสำคัญต่อกระบวนการรับเรื่องร้องเรียน
          หากท่านมีเรื่องร้องเรียนหรือข้อสงสัยในด้านการปฏิบัติงานของพนักงาน สมอ.
          ที่มีการฝ่าฝืนหรือการปฏิบัติงานไม่ถูกต้องไม่เป็นไปตามขั้นตอน
          หรือกล่าวโทษ พนักงานประพฤติตนไม่เหมาะสมทำให้เสื่อมเสียชื่อเสียง เช่น
          แสดงกริยาไม่เหมาะสม ทำลายทรัพย์สิน ให้ร้ายผู้อื่น ละทิ้งงาน วิวาท
          กลั่นแกล้ง รายงานเท็จ เสพสุรา เลินเล่อ และเล่นการพนัน เป็นต้น
          สามารถแจ้งเรื่องร้องเรียนผ่านช่องทางนี้
        </p>
        <p className="mt-3 text-sm text-foreground/80">
          สมอ. จะเก็บรักษาข้อมูลที่เกี่ยวกับเรื่องร้องเรียนทั้งหมดไว้เป็นความลับ
          ไม่เปิดเผยต่อบุคคลอื่นที่ไม่เกี่ยวข้องกับเรื่องร้องเรียนดังกล่าว
          ตามนโยบายการรักษาความลับ และการคุ้มครองปกป้องผู้ร้องเรียนหรือพยาน โดย
          สมอ. จะไม่ยอมรับการข่มขู่กรรโชก หรือ
          การกระทำที่เข้าข่ายการแก้แค้นเอาคืนต่อผู้ร้องเรียนหรือพยานที่เป็นพนักงาน
          ซึ่งให้เบาะแส ถ้อยคำ หรือข้อมูลใด ๆ ด้วยความสุจริต
          มิได้มีเจตนาร้ายหรือก่อให้เกิดความเสียหายแก่ผู้ถูกร้องเรียน สมอ.
          จะให้ความคุ้มครองพนักงานอย่างเหมาะสม
          ตามข้อกำหนดว่าด้วยการบริหารงานบุคคลของ สมอ. และกฎระเบียบองค์กรอื่น ๆ
          ที่เกี่ยวข้อง
        </p>
        <p className="mt-3 text-sm text-foreground/80">
          ทั้งนี้หากผู้ร้องเรียนแจ้งเรื่องร้องเรียนโดยเจตนาสุจริต
          แม้ว่าภายหลังได้ดำเนินการสืบสวนหาข้อเท็จจริงและสอบสวนทางวินัยแล้วพบว่าไม่มีการกระทำผิดตามที่ได้ร้องเรียน
          สมอ. จะไม่มีการพิจารณาลงโทษ หรือ ดำเนินคดีกับผู้ร้องเรียน
          แต่หากมีหลักฐานปรากฏชัดแจ้งเพียงพอว่าผู้ร้องเรียนแจ้งเรื่องร้องเรียนโดยมีเจตนาไม่สุจริต
          และ สมอ. ได้รับความเสียหาย สมอ.
          อาจพิจารณาดำเนินคดีกับผู้ร้องเรียนต่อไป
        </p>
        <p className="mt-3 text-sm text-foreground/80">
          ช่องทางแจ้งเรื่องร้องเรียนนี้
          ไม่รับพิจารณาข้อร้องเรียนเรื่องผลิตภัณฑ์หรือบริการ
          กรณีแจ้งเรื่องร้องเรียนเกี่ยวกับผลิตภัณฑ์และบริการ กรุณาติดต่อ 1365
          Contact Center (ตลอด 24 ชม.) เพื่อสอบถามข้อมูล
        </p>
        <h2 className="mt-6 text-base font-semibold text-primary">
          การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
        </h2>
        <p className="mt-3 text-sm text-foreground/80">
          ท่านสามารถศึกษารายละเอียดเกี่ยวกับการเก็บ ใช้
          และเปิดเผยข้อมูลส่วนบุคคล โดยคลิกที่{" "}
          <a className="text-primary underline" href="/privacy">
            แบบแจ้งเกี่ยวกับข้อมูลส่วนบุคคล (Privacy Notice)
          </a>
        </p>
      </div>
    </div>
  );
});

TermsAndPrivacyContent.displayName = "TermsAndPrivacyContent";

export const Route = createFileRoute("/SubmitComplaintRoute")({
  head: () => ({
    meta: [
      { title: "แจ้งเรื่องร้องเรียน — บริษัท กลุ่มสมอทอง จำกัด (มหาชน)" },
      {
        name: "description",
        content:
          "ส่งเรื่องร้องเรียนอย่างเป็นความลับ รองรับการแจ้งแบบไม่ระบุตัวตน",
      },
    ],
  }),
  component: SubmitPage,
});

const schema = z
  .object({
    category_id: z.string().min(1, "กรุณาเลือกประเภทเรื่องร้องเรียน"),
    subtopic_id: z.string().min(1, "กรุณาเลือกหัวข้อย่อย"),
    subtopic_other: z.string().optional(),
    subcategory_other: z.string().optional(),
    product_type: z.enum(["CPO", "PK", "OTHER", ""]),
    product_type_other: z.string().optional(),
    lot_reference: z.string().optional(),
    contract_number: z.string().optional(),
    delivery_date: z.string().optional(),
    occurred_date: z.string().min(1, "กรุณาเลือกวันที่เกิดเหตุ"),
    occurred_time: z.string().min(1, "กรุณาเลือกเวลาที่เกิดเหตุ"),
    location: z.string().min(1, "กรุณาเลือกสาขา"),
    priority: z.enum(["low", "medium", "high", "critical"]),
    has_witness: z.boolean(),
    witness_name: z.string().optional(),
    witnesses: z
      .array(z.object({ name: z.string(), phone: z.string() }))
      .optional(),
    request_contact: z.boolean(),
    description: z.string().trim().max(1000).optional(),
    is_anonymous: z.boolean(),
    reporter_email: z.string().optional(),
    reporter_name: z.string().optional(),
    reporter_phone: z.string().optional(),
    consent_truth: z.literal(true, {
      errorMap: () => ({ message: "กรุณายืนยันความถูกต้องของข้อมูล" }),
    }),
  })
  .superRefine((v, ctx) => {
    if (!v.is_anonymous && v.reporter_email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.reporter_email)) {
        ctx.addIssue({
          code: "custom",
          path: ["reporter_email"],
          message: "กรุณาระบุอีเมลที่ถูกต้อง",
        });
      }
    }

    if (v.subtopic_id.endsWith("_other") && !v.subtopic_other?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["subtopic_other"],
        message: "กรุณาระบุรายละเอียดเพิ่มเติม",
      });
    }

    if (v.category_id === "safety" && v.subtopic_id === "sf_driving") {
      if (!v.subcategory_other?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["subcategory_other"],
          message: "กรุณาระบุรายละเอียดเพิ่มเติม",
        });
      }
    }
  });

function formatThaiDateTime(date: string, time: string): string {
  if (!date || !time) return "--";
  try {
    const [yyyy, mm, dd] = date.split("-");
    const buddhistYear = (parseInt(yyyy, 10) + 543).toString();
    return `${dd}/${mm}/${buddhistYear} ${time}`;
  } catch {
    return "--";
  }
}

function SubmitPage() {
  return <ComplaintForm />;
}

type ComplaintFormData = {
  is_anonymous: boolean;
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string;

  category_id: string;
  subtopic_id: string;
  subtopic_other: string;
  subcategory_other: string;
  product_type: "CPO" | "PK" | "OTHER" | "";
  product_type_other: string;
  lot_reference: string;
  contract_number: string;
  delivery_date: string;
  occurred_date: string;
  occurred_time: string;
  location: string;
  priority: ComplaintPriority;
  has_witness: boolean;
  witness_name: string;
  witnesses: Array<{ name: string; phone: string }>;
  request_contact: boolean;
  description: string;
  details: Record<string, unknown>;
  consent_truth: boolean;
  files: File[];
};

type StepErrors = Partial<Record<keyof ComplaintFormData, string>>;

function ComplaintForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxVisibleStep, setMaxVisibleStep] = useState(1);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [form, setForm] = useState<ComplaintFormData>({
    is_anonymous: false,
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    category_id: "",
    subtopic_id: "",
    subtopic_other: "",
    subcategory_other: "",
    product_type: "",
    product_type_other: "",
    lot_reference: "",
    contract_number: "",
    delivery_date: "",
    occurred_date: "",
    occurred_time: "",
    location: "",
    priority: "medium",
    has_witness: false,
    witness_name: "",
    witnesses: [],
    request_contact: false,
    description: "",
    details: {},
    consent_truth: false,
    files: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ref: string } | null>(null);
  const [errors, setErrors] = useState<StepErrors>({});
  const [initialFillDone, setInitialFillDone] = useState(false);
  const [isDateTimeEditMode, setIsDateTimeEditMode] = useState(false);

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);

  useEffect(() => {
    if (!hasAcceptedTerms) {
      const el = contentRef.current;
      if (!el) return;
      const check = () => {
        const { scrollTop, clientHeight, scrollHeight } = el;
        setScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 8);
      };
      check();
      el.addEventListener("scroll", check, { passive: true });
      return () => el.removeEventListener("scroll", check);
    }
  }, [hasAcceptedTerms]);

  useEffect(() => {
    if (form.has_witness && (!form.witnesses || form.witnesses.length === 0)) {
      update("witnesses", [{ name: "", phone: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.has_witness, form.witnesses]);

  const selectedCategory = useMemo(
    () =>
      complaintTypes.find((category) => category.id === form.category_id) ??
      null,
    [form.category_id],
  );

  const subtopics = selectedCategory?.subcategories ?? [];
  const selectedLocation = useMemo(
    () =>
      complaintLocations.find((location) => location.id === form.location) ??
      null,
    [form.location],
  );

  useEffect(() => {
    setMaxVisibleStep((value) => Math.max(value, currentStep));
  }, [currentStep]);

  useEffect(() => {
    sectionRefs.current[currentStep - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentStep]);

  useEffect(() => {
    if (!initialFillDone) {
      const now = new Date();
      const yyyy = String(now.getFullYear()).padStart(4, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");

      setForm((f) => ({
        ...f,
        occurred_date: `${yyyy}-${mm}-${dd}`,
        occurred_time: `${hh}:${mins}`,
      }));
      setInitialFillDone(true);
    }
  }, [initialFillDone]);

  function update<K extends keyof ComplaintFormData>(
    key: K,
    value: ComplaintFormData[K],
  ) {
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "has_witness" && value === false
        ? { witness_name: "", witnesses: [] }
        : {}),
    }));

    setErrors((e) => {
      const nextErrors = { ...e };
      delete nextErrors[key];
      return nextErrors;
    });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).slice(0, 5 - form.files.length);
    update("files", [...form.files, ...next].slice(0, 5));
  }

  function openStep(step: number) {
    setCurrentStep(step);
    setMaxVisibleStep((value) => Math.max(value, step));
  }

  // ยุบรวม Validation ของทุกส่วนที่เหลือมาไว้ที่ Step 2
  function stepErrors(step: number): StepErrors {
    const next: StepErrors = {};
    
    // Step 1: หมวดหมู่และประเด็น
    if (step === 1) {
      if (!form.category_id) next.category_id = "กรุณาเลือกประเภทเรื่องร้องเรียน";
      if (!form.subtopic_id) next.subtopic_id = "กรุณาเลือกหัวข้อย่อย";
      if (form.subtopic_id.endsWith("_other") && !form.subtopic_other.trim())
        next.subtopic_other = "กรุณาระบุรายละเอียดเพิ่มเติม";
    }
    
    // Step 2: รายละเอียดเหตุการณ์ (วันที่ เวลา สาขา)
    if (step === 2) {
      if (!form.occurred_date) next.occurred_date = "กรุณาเลือกวันที่เกิดเหตุ";
      if (!form.occurred_time) next.occurred_time = "กรุณาเลือกเวลาที่เกิดเหตุ";
      if (!form.location) next.location = "กรุณาเลือกสาขา";
    }

    // Step 3: ข้อมูลผู้ร้องเรียน
    if (step === 3) {
      if (!form.is_anonymous) {
        if (!form.reporter_name || !form.reporter_name.trim()) {
          next.reporter_name = "กรุณาระบุชื่อ-นามสกุล";
        }
        if (!form.reporter_email || !form.reporter_email.trim()) {
          next.reporter_email = "กรุณาระบุอีเมล";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reporter_email)) {
          next.reporter_email = "กรุณาระบุอีเมลที่ถูกต้อง";
        }
      }
    }

    // Step 4: ตรวจสอบและยืนยันข้อมูล
    if (step === 4) {
      if (!form.consent_truth) next.consent_truth = "กรุณายืนยันความถูกต้องของข้อมูล";
    }
    
    return next;
  }

  function handleNextStep(stepToValidate: number) {
    const currentErrors = stepErrors(stepToValidate);
    setErrors((prev) => {
      const nextErrors = { ...prev };

      Object.keys(currentErrors).forEach((key) => {
        delete nextErrors[key as keyof ComplaintFormData];
      });
      return nextErrors;
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...currentErrors }));
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนไปหน้าถัดไป");
      return;
    }
    openStep(stepToValidate + 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Re-validate Step 2 on Submit as well just to be safe
    const finalErrors = stepErrors(2);
    if (Object.keys(finalErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...finalErrors }));
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนส่งแบบฟอร์ม");
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: StepErrors = {};
      for (const i of parsed.error.issues) {
        next[i.path[0] as keyof ComplaintFormData] = i.message;
      }
      setErrors((prev) => ({ ...prev, ...next }));
      toast.error(
        parsed.error.issues[0]?.message ?? "กรุณากรอกข้อมูลให้ครบถ้วน",
      );
      return;
    }
    setSubmitting(true);

    try {
      const year = new Date().getFullYear();
      let fakeCounter = 1;
      const number = fakeCounter.toString().padStart(4, "0");
      const fakeRef = `CMP-${year}-${number}`;

      fakeCounter += 1;

      setSuccess({ ref: fakeRef });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "การส่งล้มเหลว กรุณาลองใหม่",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <PageContainer>
        <section className="min-h-[80vh] py-16 flex flex-col items-center justify-center">
          <MainLayout narrow>
            <div className="text-center animate-[fadeInUp_0.4s_ease-out_both] flex flex-col items-center">
              
              {/* ไอคอน Check วงกลมสีเขียวอ่อน */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#09A129]/10 text-[#09A129] shadow-sm md:h-20 md:w-20">
                <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              
              {/* หัวข้อหลัก */}
              <h1 className="mt-6 font-display text-2xl font-bold text-[#002856] md:text-3xl">
                ระบบได้รับเรื่องของท่านเรียบร้อยแล้ว
              </h1>
              
              {/* คำอธิบาย */}
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                เจ้าหน้าที่จะดำเนินการตามนโยบายคุ้มครองผู้แจ้งเบาะแส
              </p>
              
              {/* การ์ดแสดงหมายเลขอ้างอิง (กล่องสีขาว) */}
              <div className="mx-auto mt-8 w-full max-w-[600px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="text-xs font-bold tracking-wide text-[#002856] md:text-sm">
                  หมายเลขอ้างอิง / Reference Number
                </div>
                
                {/* ตัวเลขหมายเลขอ้างอิง (ขยายให้ใหญ่และหนาขึ้น) */}
                <div className="mt-4 font-display text-3xl font-black tracking-wider text-[#002856] md:text-4xl">
                  {success.ref}
                </div>
                
                {/* กลุ่มปุ่ม คัดลอก / บันทึกภาพ แบบ Responsive */}
                <div className="mt-6 flex w-full flex-row gap-3 sm:justify-center">
                  <button
                    type="button"
                    className="flex h-11 flex-1 sm:flex-none sm:w-28 items-center justify-center gap-2 rounded-lg border border-[#D29E0E] bg-white text-sm font-medium text-[#002856] transition-colors hover:bg-slate-50"
                    onClick={() => {
                      navigator.clipboard.writeText(success.ref);
                      toast.success("คัดลอกแล้ว");
                    }}
                  >
                    <Copy className="h-4 w-4 text-slate-500" /> คัดลอก
                  </button>
                  <button
                    type="button"
                    className="flex h-11 flex-1 sm:flex-none sm:w-32 items-center justify-center gap-2 rounded-lg border border-[#D29E0E] bg-white text-sm font-medium text-[#002856] transition-colors hover:bg-slate-50"
                    onClick={() => {
                      navigator.clipboard.writeText(success.ref);
                      toast.success("คัดลอกแล้ว");
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    บันทึกภาพ
                  </button>
                </div>
                
                {/* ข้อความแจ้งเตือนสีส้ม */}
                <div className="mt-6 space-y-1">
                  <p className="text-xs font-medium text-[#FF4D00] md:text-sm">
                    โปรดเก็บหมายเลขนี้ไว้สำหรับติดตามสถานะ
                  </p>
                  <p className="text-[11px] text-[#FF4D00] md:text-xs">
                    Please keep this number for status tracking.
                  </p>
                </div>
              </div>
              
              {/* ปุ่มกลับหน้าแรก (ปุ่มสีทอง) */}
              <div className="mt-8 flex w-full justify-center">
                <Button 
                  className="h-12 w-auto px-8 sm:w-auto sm:px-12 rounded-lg bg-[#D29E0E] text-base font-medium text-white hover:bg-[#002856] disabled:bg-[#B8BBBF]" 
                  onClick={() => navigate({ to: "/" })}
                >
                  กลับสู่หน้าแรก
                </Button>
              </div>
              
            </div>
          </MainLayout>
        </section>
      </PageContainer>
    );
  }

  const summaryCategory = selectedCategory?.name || "ยังไม่ได้เลือกประเภท";
  const selectedSubtopic = subtopics.find(
    (item) => item.id === form.subtopic_id,
  );
  const summarySubtopic = selectedSubtopic?.name || "ยังไม่ได้เลือกเหตุการณ์";
  const summarySubtopicDetail = form.subtopic_id.endsWith("_other")
    ? form.subtopic_other || ""
    : form.category_id === "safety" && form.subtopic_id === "sf_driving";

  const summaryLocation = selectedLocation?.name || "ยังไม่ได้เลือกสาขา";

  if (!hasAcceptedTerms) {
    return (
      <PageContainer>
        <section className="py-12 md:py-8">
          <MainLayout>
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าแรก
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
              <TermsAndPrivacyContent ref={contentRef} />

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    disabled={!scrolledToBottom}
                    checked={isTermsAccepted}
                    onCheckedChange={(v) => setIsTermsAccepted(v === true)}
                  />
                  <span className="text-sm font-medium">เข้าใจและยอมรับเงื่อนไขการใช้งาน</span>
                </label>
                {!scrolledToBottom && (
                  <span className="text-xs text-[#FF4D00] font-medium">
                    กรุณาเลื่อนอ่านเนื้อหาให้จบเพื่อยอมรับเงื่อนไข
                  </span>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
                <Button
                  type="button"
                  className="bg-[#D29E0E] hover:bg-[#002856] disabled:bg-[#B8BBBF] text-white px-8 h-11"
                  disabled={!isTermsAccepted}
                  onClick={() => setHasAcceptedTerms(true)}
                >
                  ดำเนินการต่อ <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </MainLayout>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="py-12 md:py-8">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          {/* ส่วนหัว: ปุ่มกลับหน้าแรก */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าแรก
            </Link>
          </div>

          {/* แถบ Stepper */}
          <HorizontalStepper currentStep={currentStep} maxVisibleStep={maxVisibleStep} onStepClick={(step) => openStep(step)} />

          {/* เริ่มฟอร์มหลัก */}
          <form onSubmit={onSubmit} className="mt-8 transition-all duration-300">
            
            {/* ==========================================
                STEP 1: หมวดหมู่และประเด็น
            ========================================== */}
            {currentStep === 1 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                
                <div className="mb-6 border-b border-border pb-4">
                  <h2 className="text-lg font-bold text-[#002856]">
                    หมวดหมู่และประเด็นที่เกี่ยวข้อง (Category & Related Issue) <span className="text-destructive">*</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    กรุณาเลือกหมวดหมู่การแจ้งเรื่องและประเด็นที่เกี่ยวข้อง เพื่อให้บริษัทสามารถจัดประเภทและดำเนินการตรวจสอบได้อย่างเหมาะสม
                  </p>
                </div>
                
                <div className="grid gap-6">
                  {/* เลือกหมวดหมู่หลัก */}
                  <div>
                    <Label className="text-sm font-bold text-[#002856]">
                      เลือกหมวดหมู่การแจ้งเรื่อง (Select Reporting Category) <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                      {complaintTypes.map((category) => {
                        const active = form.category_id === category.id;
                        return (
                          <Button
                            key={category.id}
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              update("category_id", category.id);
                              update("subtopic_id", "");
                            }}
                            className={cn(
                              "h-auto w-full flex-col items-start justify-start whitespace-normal rounded-xl border p-4 text-left transition-all",
                              active
                                ? "border-[#002856] bg-[#002856] text-white shadow-md hover:bg-[#002856] hover:text-white"
                                : "border-border bg-card text-foreground hover:border-[#002856]/30 hover:bg-slate-50"
                            )}
                          >
                            <div className="font-bold text-sm md:text-base">{category.name}</div>
                            {category.nameEn && <div className="mt-0 text-xs font-medium opacity-80">{category.nameEn}</div>}
                            
                            {category.description && (
                              <div className="mt-0 text-[11px] md:text-xs opacity-90 leading-relaxed">
                                {category.description}
                              </div>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.category_id} />
                  </div>

                  {/* เลือกประเด็น (หัวข้อย่อย) */}
                  <div className={cn("transition-opacity", !selectedCategory && "pointer-events-none opacity-50")}>
                    <Label className="text-sm font-bold text-[#002856]">
                      เลือกประเด็นที่เกี่ยวข้อง (Select Related Issue) <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {subtopics.map((subtopic) => {
                        const active = form.subtopic_id === subtopic.id;
                        return (
                          <Button
                            key={subtopic.id}
                            type="button"
                            variant="ghost"
                            onClick={() => update("subtopic_id", subtopic.id)}
                            className={cn(
                              "h-auto w-full flex-col items-start justify-start whitespace-normal rounded-xl border p-4 text-left transition-all",
                              active
                                ? "border-[#002856] bg-[#002856] text-white shadow-md hover:bg-[#002856] hover:text-white"
                                : "border-border bg-card text-foreground hover:border-[#002856]/30 hover:bg-slate-50"
                            )}
                          >
                            <div className="font-bold text-sm">{subtopic.name}</div>
                            
                            {subtopic.nameEn && (
                              <div className="mt-1 text-[11px] md:text-xs font-medium opacity-80">
                                {subtopic.nameEn}
                              </div>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.subtopic_id} />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button 
                    type="button" 
                    className="bg-[#D29E0E] hover:bg-[#002856] disabled:bg-[#B8BBBF] text-white px-8 h-11"
                    onClick={() => handleNextStep(1)}
                  >
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 2: รายละเอียดเหตุการณ์ (แนบไฟล์อยู่ท้ายสุด)
            ========================================== */}
            {currentStep === 2 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                <h2 className="mb-6 border-b pb-4 text-lg font-bold text-[#002856]">
                  รายละเอียดเหตุการณ์ <span className="text-destructive">*</span>
                </h2>
                
                <div className="space-y-8">
                  
                  {/* แถวที่ 1: วันที่เวลา และ สาขา */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* คอลัมน์ซ้าย: วันที่และเวลาที่เกิดเหตุ */}
                    <div className="flex flex-col h-full">
                      <Label className="text-sm font-semibold text-foreground block mb-0">
                        วันที่และเวลาที่เกิดเหตุ (Date and Time of Incident){" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid gap-4 md:grid-cols-2 mt-3">
                        <div className="flex flex-col">
                          <Input
                            type="date"
                            className={cn(
                              // 1. โครงสร้างพื้นฐานและสถานะปกติ (Inactive)
                              "relative w-full h-[52px] rounded-lg px-3 text-sm transition-all outline-none",
                              "border-[#D6D7D9] bg-white text-[#002856]",
                              
                              // จัดการตำแหน่งไอคอนปฏิทินให้อยู่ชิดขวา
                              "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                              
                              // 2. สถานะ Hover & Focus
                              "hover:border-[#D29E0E]",
                              "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                              
                              // 3. สถานะ Disabled (เผื่อระบบมีการปิดไม่ให้แก้)
                              "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                              
                              // 4. สถานะ Error (ถ้ามี Error ให้เขียนทับ Hover/Focus สีอื่นให้เป็นสีส้มแดงทั้งหมด)
                              errors.occurred_date
                                ? "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                                : ""
                            )}
                            value={form.occurred_date}
                            onChange={(e) => update("occurred_date", e.target.value)}
                          />
                          <div className="min-h-[24px] mt-1"><FieldError msg={errors.occurred_date} /></div>
                        </div>

                        <div className="flex flex-col">
                          <Input
                            type="time"
                            className={cn(
                              // 1. โครงสร้างพื้นฐานและสถานะปกติ (Inactive)
                              "relative w-full h-[52px] rounded-lg px-3 text-sm transition-all outline-none",
                              "border-[#D6D7D9] bg-white text-[#002856]",
                              
                              // จัดการตำแหน่งไอคอนปฏิทินให้อยู่ชิดขวา
                              "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                              
                              // 2. สถานะ Hover & Focus
                              "hover:border-[#D29E0E]",
                              "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                              
                              // 3. สถานะ Disabled (เผื่อระบบมีการปิดไม่ให้แก้)
                              "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                              
                              // 4. สถานะ Error (ถ้ามี Error ให้เขียนทับ Hover/Focus สีอื่นให้เป็นสีส้มแดงทั้งหมด)
                              errors.occurred_time
                                ? "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                                : ""
                            )}
                            value={form.occurred_time}
                            onChange={(e) => update("occurred_time", e.target.value)}
                          />
                          <div className="min-h-[24px] mt-1"><FieldError msg={errors.occurred_time} /></div>
                        </div>
                      </div>
                    </div>

                    {/* คอลัมน์ขวา: สาขา (Branch Location) */}
                    <div className="flex flex-col h-full">
                      <Label className="text-sm font-semibold text-foreground block mb-0">
                        สาขาที่เกิดเหตุ (Branch Location){" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="mt-3 flex flex-col">
                        <Select
                          value={form.location}
                          onValueChange={(value) => update("location", value)}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full h-[52px] rounded-lg bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                              errors.location
                                ? "border-[#FF4D00] bg-[#FF4D00]/10 text-foreground"
                                : "border-border text-foreground",
                            )}
                          >
                            <SelectValue placeholder="-- กรุณาเลือกสาขา (Select Branch) --" />
                          </SelectTrigger>
                          <SelectContent>
                            {complaintLocations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="min-h-[24px] mt-1">
                          <FieldError msg={errors.location} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* แถวที่ 2: พยาน */}
                  <div className="rounded-xl border border-border bg-slate-50 dark:bg-[var(--surface-muted)] p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-semibold text-foreground">
                          มีพยานหรือไม่? (Are there witnesses?)
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-sm">
                          ระบุได้หากมีผู้เห็นเหตุการณ์หรือผู้เกี่ยวข้องเพิ่มเติม
                        </p>
                      </div>

                      <RadioGroup
                        className="flex items-center gap-6 shrink-0 p-2"
                        value={form.has_witness ? "true" : "false"}
                        onValueChange={(v) => update("has_witness", v === "true")}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="true" id="witness_yes" />
                          <Label htmlFor="witness_yes" className="text-sm font-medium cursor-pointer text-[#002856] border-slate-300 hover:border-[#D29E0E] data-[state=checked]:border-[#002856] hover:data-[state=checked]:border-[#D29E0E]">
                            มี <span className="text-muted-foreground font-normal ml-0.5">(Yes)</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="false" id="witness_no" />
                          <Label htmlFor="witness_no" className="text-sm font-medium cursor-pointer text-[#002856] border-slate-300 hover:border-[#D29E0E] data-[state=checked]:border-[#002856] hover:data-[state=checked]:border-[#D29E0E]">
                            ไม่มี <span className="text-muted-foreground font-normal ml-0.5">(No)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        form.has_witness
                          ? "grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-border"
                          : "grid-rows-[0fr] opacity-0 mt-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="mb-3 text-sm font-medium text-foreground">
                          รายชื่อพยาน <span className="text-xs text-muted-foreground ml-1">(Witness List)</span>
                        </div>
                        <div className="space-y-3 pb-1 px-1">
                          {form.witnesses?.map((witness, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <Input
                                className={cn(
                                  // โครงสร้างหลัก
                                  "flex-1 rounded-lg transition-all outline-none",
                                  "border-[#D6D7D9] bg-white text-[#002856]",
                                  "hover:border-[#D29E0E]",
                                  "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                                  "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                                  
                                  // เงื่อนไข Error ของ ชื่อพยาน (Name)
                                  // (หาก ts ฟ้อง error ตรงนี้ อาจต้องปรับ Type ของ StepErrors ให้รองรับโครงสร้าง Array ครับ)
                                  // @ts-ignore เผื่อกรณี Type แจ้งเตือน
                                  errors.witnesses?.[index]?.name
                                    ? "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                                    : ""
                                )}
                                value={witness.name}
                                onChange={(e) => {
                                  const updated = [...form.witnesses!];
                                  updated[index] = { ...updated[index], name: e.target.value };
                                  update("witnesses", updated);
                                }}
                                placeholder="ชื่อ-นามสกุล (Name)"
                              />
                              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                                <Input
                                  className={cn(
                                    // โครงสร้างหลัก
                                    "w-full rounded-lg transition-all outline-none",
                                    "border-[#D6D7D9] bg-white text-[#002856]",
                                    "hover:border-[#D29E0E]",
                                    "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                                    "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                                    
                                    // เงื่อนไข Error ของ เบอร์โทรศัพท์พยาน (Phone)
                                    // @ts-ignore
                                    errors.witnesses?.[index]?.phone
                                      ? "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                                      : ""
                                  )}
                                  value={witness.phone}
                                  onChange={(e) => {
                                    const updated = [...form.witnesses!];
                                    updated[index] = { ...updated[index], phone: e.target.value };
                                    update("witnesses", updated);
                                  }}
                                  placeholder="เบอร์โทรศัพท์ (Phone)"
                                />
                                {index === 0 ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="shrink-0 w-10 sm:w-24"
                                    onClick={() => {
                                      update("witnesses", [...(form.witnesses || []), { name: "", phone: "" }]);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">เพิ่ม</span>
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="shrink-0 w-10 sm:w-24 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => {
                                      update("witnesses", form.witnesses!.filter((_, i) => i !== index));
                                    }}
                                  >
                                    <X className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">ลบ</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* แถวที่ 3: รายละเอียดเพิ่มเติม */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground block mb-0.5">
                      รายละเอียดเพิ่มเติม
                    </Label>
                    <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                      <span>
                        Additional Information <span className="ml-1 opacity-70">(ไม่บังคับ / Optional)</span>
                      </span>
                    </div>

                    <Textarea
                      className="min-h-[120px] resize-y rounded-xl bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      maxLength={1000}
                      placeholder="สามารถระบุรายละเอียดเพิ่มเติม เช่น บุคคลที่เกี่ยวข้อง เหตุการณ์เพิ่มเติม หรือข้อมูลอื่น ๆ..."
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                    <div className="mt-2 flex items-center justify-end">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          form.description.length === 0 ? "text-muted-foreground/60" : "text-primary/70",
                        )}
                      >
                        {form.description.length} / 1000
                      </span>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* --- ฟังก์ชั่นแนบไฟล์ --- */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-[#002856]">
                      แนบไฟล์ / Attach Files (ถ้ามี)
                    </h3>
                    <label
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        addFiles(e.dataTransfer.files);
                      }}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition",
                        "border-border bg-[var(--surface-muted)] hover:border-primary/40",
                      )}
                    >
                      <Upload className="h-7 w-7 text-muted-foreground" />
                      <div className="mt-3 text-sm font-medium">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</div>
                      <div className="mt-1 text-sm font-medium">Drag and drop files here, or click to select</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        รองรับ PDF, DOCX, PNG, JPG, MP4, MOV · สูงสุด 5 ไฟล์
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,video/mp4,video/quicktime"
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </label>
                    {form.files.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {form.files.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <FileText className="h-4 w-4 flex-none text-primary" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => update("files", form.files.filter((_, itemIndex) => itemIndex !== index))}
                              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                              aria-label="ลบไฟล์"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>

                {/* --- ปุ่ม ถัดไป / ย้อนกลับ --- */}
                <div className="mt-10 flex flex-col-reverse justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                  <Button type="button" variant="outline" className="h-11 w-full px-8 sm:w-auto" onClick={() => openStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
                  </Button>
                  
                  <Button type="button" className="h-11 w-full bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto" onClick={() => handleNextStep(2)}>
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 3: ข้อมูลผู้ร้องเรียน
            ========================================== */}
            {currentStep === 3 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                <h2 className="mb-6 border-b pb-4 text-lg font-bold text-[#002856]">
                  ข้อมูลผู้ร้องเรียน (Reporter Information)
                </h2>
                
                <div className="space-y-4">
                  <label className="group flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-slate-50 dark:bg-[var(--surface-muted)] p-4 transition-colors hover:border-primary/40">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg border border-border bg-white p-1.5 text-slate-700 shadow-sm">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          ไม่เปิดเผยตัวตน (Anonymous)
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          หากเปิดใช้งาน ระบบจะข้ามการกรอกข้อมูลส่วนตัวทั้งหมดทันที
                        </div>
                      </div>
                    </div>
                    <Switch
                      className="mt-1 data-[state=checked]:bg-[#002856] hover:data-[state=checked]:bg-[#D29E0E] hover:data-[state=unchecked]:bg-[#898F98]"
                      checked={form.is_anonymous}
                      onCheckedChange={(v) => {
                        update("is_anonymous", v);
                        if (v) {
                          update("reporter_name", "");
                          update("reporter_email", "");
                          update("reporter_phone", "");
                        }
                      }}
                    />
                  </label>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {!form.is_anonymous && (
                      <>
                        <FieldGroup label="ชื่อ-นามสกุล" required error={errors.reporter_name}>
                          <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">Full Name</div>
                          <Input
                            className={cn(
                              "flex-1 rounded-lg transition-all outline-none",
                              // สถานะปกติ: กรอบเทา พื้นขาว ข้อความตอนพิมพ์สีน้ำเงิน และ Placeholder สีเทา #D6D7D9
                              "border-[#D6D7D9] bg-white text-[#002856] placeholder:text-[#D6D7D9]",
                              "hover:border-[#D29E0E]",
                              "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                              "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                              // สถานะ Error
                              errors.reporter_name && "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                            )}
                            value={form.reporter_name}
                            onChange={(e) => update("reporter_name", e.target.value)}
                            placeholder="ระบุชื่อ-สกุล"
                          />
                        </FieldGroup>

                        <FieldGroup label="อีเมล" required error={errors.reporter_email}>
                          <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">Email Address</div>
                          <Input
                            type="email"
                            className={cn(
                              "flex-1 rounded-lg transition-all outline-none",
                              // สถานะปกติ: กรอบเทา พื้นขาว ข้อความตอนพิมพ์สีน้ำเงิน และ Placeholder สีเทา #D6D7D9
                              "border-[#D6D7D9] bg-white text-[#002856] placeholder:text-[#D6D7D9]",
                              "hover:border-[#D29E0E]",
                              "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                              "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]", 
                              // สถานะ Error
                              errors.reporter_email && "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]"
                            )}
                            value={form.reporter_email}
                            onChange={(e) => update("reporter_email", e.target.value)}
                            placeholder="ระบุอีเมล"
                            autoComplete="email"
                          />
                        </FieldGroup>

                        <FieldGroup label="เบอร์โทรศัพท์" full error={errors.reporter_phone}>
                          <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">Phone Number</div>
                          <Input
                            className={cn("flex-1 rounded-lg transition-all outline-none",
                                  "border-[#D6D7D9] bg-white text-[#002856]",
                                  "hover:border-[#D29E0E]",
                                  "focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]",
                                  "disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]",
                                  errors.reporter_phone && "border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]")}
                            value={form.reporter_phone}
                            onChange={(e) => update("reporter_phone", e.target.value)}
                            placeholder="ระบุเบอร์โทรศัพท์"
                          />
                        </FieldGroup>
                      </>
                    )}
                  </div>
                </div>

                {/* --- ปุ่ม ถัดไป / ย้อนกลับ --- */}
                <div className="mt-10 flex flex-col-reverse justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                  <Button type="button" variant="outline" className="h-11 w-full px-8 sm:w-auto" onClick={() => openStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
                  </Button>
                  
                  <Button type="button" className="h-11 w-full bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto" onClick={() => handleNextStep(3)}>
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 4: ตรวจสอบและยืนยันข้อมูล
            ========================================== */}
            {currentStep === 4 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                {/* หัวข้อหลัก */}
                <div className="mb-6 border-b border-border pb-4">
                  <h2 className="text-xl font-bold text-[#002856]">
                    ตรวจสอบและยืนยันข้อมูล (Review & Confirmation) <span className="text-destructive">*</span>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    กรุณาตรวจสอบความถูกต้องของข้อมูลแจ้งเรื่อง และยืนยันว่าข้อมูลดังกล่าวเป็นความจริงและถูกต้องครบถ้วน
                  </p>
                </div>

                {/* กล่องสีฟ้าตามดีไซน์ (ใช้สีเทา 50 เป็นกรอบ) */}
                <div className="rounded-xl border-[1px] border-[#D6D7D9] p-6 md:p-8">
                  <h3 className="mb-4 text-base font-bold text-[#002856]">
                    การยืนยัน (Confirmation) <span className="text-destructive">*</span>
                  </h3>

                  {/* กล่องสรุปข้อมูลสีเทาอ่อน (System BG) */}
                  <div className="mb-6 rounded-xl border border-slate-200 bg-[#F9FAFB] p-6 text-sm text-slate-700 leading-relaxed">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="font-bold text-[#002856]">หมวดหมู่การแจ้งเรื่อง : </span>
                        {summaryCategory} {summarySubtopic ? `> ${summarySubtopic}` : ""}
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">สาขาที่เกิดเหตุ : </span>
                        {summaryLocation}
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">วันที่และเวลาที่เกิดเหตุ : </span>
                        วันที่ {form.occurred_date || "-"} เวลา {form.occurred_time || "-"} น.
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">พยาน : </span>
                        {form.has_witness ? `มี (${form.witnesses?.length || 0} คน)` : "ไม่มี"}
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">วันที่และเวลาที่ร้องเรียน : </span>
                        วันที่ {new Date().toLocaleDateString('th-TH')} เวลา {new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.
                      </div>
                    </div>
                  </div>

                  {/* Checkbox ยืนยัน */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      className="mt-0.5 border-slate-400 data-[state=checked]:bg-[#002856] hover:border-[#D29E0E] data-[state=checked]:border-[#002856]"
                      checked={form.consent_truth}
                      onCheckedChange={(v) => update("consent_truth", v === true)}
                    />
                    <div className="text-sm">
                      ข้าพเจ้ายืนยันว่า <span className="font-bold text-black">ข้อมูลที่ให้เป็นความจริง</span> และส่งด้วยเจตนาสุจริต
                    </div>
                  </label>
                  
                  {/* Error Message */}
                  {!form.consent_truth && (
                    <div className="mt-2 ml-7 flex items-center gap-1.5 text-xs text-[#FF4D00] font-medium">
                      <AlertCircle className="h-3.5 w-3.5" /> กรุณายืนยันความถูกต้องของข้อมูล
                    </div>
                  )}

                  {/* ปุ่ม Submit */}
                  <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full text-muted-foreground sm:w-auto" 
                      onClick={() => openStep(3)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปแก้ไข
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={submitting || !form.consent_truth}
                      className="w-full h-11 bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto"
                    >
                      {submitting ? "กำลังส่ง..." : "ส่งเรื่องร้องเรียน"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>
      </section>
    </PageContainer>
  );
}

function Section({
  icon,
  step,
  title,
  required,
  hint,
  children,
  hideHeader,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  required?: boolean;
  hint?: string;
  hideHeader?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-elegant">
      {!hideHeader && (
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            {step}
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-soft text-primary">
            {icon}
          </span>
          <h2 className="font-display text-base font-semibold text-primary">
            {title}
            {required && <span className="ml-1 text-destructive">*</span>}
          </h2>
          {hint && (
            <span className="ml-auto text-[11px] font-medium text-muted-foreground">
              {hint}
            </span>
          )}
        </div>
      )}
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

function FieldGroup({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="text-xs font-medium text-foreground/80">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      <FieldError msg={error} />
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF4D00]">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  );
}

function priorityLabel(priority: ComplaintPriority): string {
  const labels: Record<ComplaintPriority, string> = {
    low: "Low (ปกติ)",
    medium: "Medium (ปานกลาง)",
    high: "High (เร่งด่วน)",
    critical: "Critical (วิกฤต)",
  };
  return labels[priority];
}

// นำโค้ดนี้ไปวางล่างสุดของไฟล์ เพื่อสร้างตัว Stepper แนวนอนที่ Responsive เต็มรูปแบบ
function HorizontalStepper({ 
  currentStep, 
  maxVisibleStep, 
  onStepClick 
}: { 
  currentStep: number;
  maxVisibleStep: number;
  onStepClick: (step: number) => void;
}) {
  const STEPS = [
    { id: 1, labelTh: "หมวดหมู่และประเด็น", labelEn: "(Category & Related Issue)", icon: BookOpen },
    { id: 2, labelTh: "รายละเอียดเหตุการณ์", labelEn: "(Incident Information & Details)", icon: FileText },
    { id: 3, labelTh: "ข้อมูลผู้ร้องเรียน", labelEn: "(Reporter Information)", icon: Edit },
    { id: 4, labelTh: "ตรวจสอบและยืนยันข้อมูล", labelEn: "(Review & Confirmation)", icon: ShieldCheck },
  ];

  return (
    // ปรับ Padding ในมือถือให้ลดลง (px-2 py-6) และขยายกลับในจอใหญ่ (sm:px-5)
    <div className="mb-8 rounded-2xl border border-border bg-white px-2 py-6 sm:px-5 sm:pt-10 sm:pb-8 shadow-sm">
      <div className="relative z-0 flex w-full justify-between items-start">
        
        {/* ปรับกล่องคุมเส้น (Line Wrapper):
          - ใช้ left-[12.5%] right-[12.5%] เพื่อให้เส้นเริ่มต้นและจบที่ "กึ่งกลาง" ของ Step เสมอ (กรณีมี 4 Step)
          - ปรับ top-4 ในมือถือ (กึ่งกลางของวงกลมขนาด 8) และ top-6 ใน Desktop (กึ่งกลางของวงกลมขนาด 12)
        */}
        <div className="absolute top-4 md:top-6 left-[12.5%] right-[12.5%] h-1 -translate-y-1/2 z-0 pointer-events-none">
          {/* เส้นสีเทา (รองพื้น) */}
          <div className="absolute inset-0 w-full h-full bg-slate-100"></div>
          {/* เส้นสีเขียว (สถานะ) */}
          <div
            className="absolute left-0 top-0 h-full bg-[#09A129] transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
        </div>

        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = step.id <= maxVisibleStep;

          return (
            <div 
              key={step.id} 
              // ใช้ flex-1 เพื่อให้แต่ละ Step แบ่งพื้นที่ความกว้างเท่าๆ กัน 100%
              className={cn(
                "relative z-10 flex flex-col items-center flex-1",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* วงกลม (ปรับลดขนาดในมือถือเป็น h-8 w-8 และขยายเป็น h-12 w-12 ในจอใหญ่) */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2px] bg-white transition-colors duration-300 md:h-12 md:w-12 md:border-[3px]",
                  isCompleted || isActive 
                    ? "border-[#09A129] bg-[#09A129] text-white" 
                    : "border-slate-200 bg-white text-slate-300"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 md:h-6 md:w-6" /> 
                ) : (
                  <step.icon className="h-4 w-4 md:h-6 md:w-6" />
                )}
              </div>

              {/* ข้อความกำกับ */}
              <div className="mt-2 md:mt-3 flex flex-col items-center w-full px-1">
                <div className="w-full max-w-[80px] md:max-w-none text-center flex flex-col items-center">
                  {/* ภาษาไทย: เอา whitespace-nowrap ออก เพื่อให้ข้อความตัดขึ้นบรรทัดใหม่ได้เมื่อจอกว้างไม่พอ */}
                  <div className={cn(
                    "text-[9px] sm:text-[10px] md:text-xs font-bold leading-[1.2] break-words md:whitespace-nowrap", 
                    isActive || isCompleted ? "text-slate-800" : "text-slate-400"
                  )}>
                    {step.labelTh}
                  </div>
                  
                  {/* ภาษาอังกฤษ: ซ่อนในมือถือ (hidden) และแสดงตั้งแต่จอ sm ขึ้นไป (sm:block) เพื่อลดความรก */}
                  <div className="hidden sm:block text-[9px] md:text-[10px] font-medium opacity-60 mt-0.5 text-slate-500 leading-tight md:whitespace-nowrap">
                    {step.labelEn}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}