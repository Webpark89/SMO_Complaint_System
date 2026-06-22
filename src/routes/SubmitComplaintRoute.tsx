import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
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
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  return (
    <div className="transition-opacity duration-300">
      {!hasAcceptedTerms ? (
        <ConsentGate
          hasAccepted={hasAcceptedTerms}
          setHasAccepted={(v) => {
            setHasAcceptedTerms(v);
          }}
        />
      ) : (
        <ComplaintForm />
      )}
    </div>
  );
}

function ConsentGate({
  hasAccepted,
  setHasAccepted,
}: {
  hasAccepted: boolean;
  setHasAccepted: (v: boolean) => void;
}) {
  const [checked, setChecked] = useState<boolean>(hasAccepted);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => setChecked(hasAccepted), [hasAccepted]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      setScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 8);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, []);

  return (
    <PageContainer>
      <section className="py-12">
        <MainLayout narrow>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow">
            <TermsAndPrivacyContent ref={contentRef} />

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3">
                <Checkbox
                  disabled={!scrolledToBottom}
                  checked={checked}
                  onCheckedChange={(v) => setChecked(v === true)}
                />
                <span className="text-sm">
                  เข้าใจและยอมรับเงื่อนไขการใช้งาน
                </span>
              </label>
              <div className="pl-7 text-xs text-muted-foreground sm:pl-0 sm:text-right">
                {!scrolledToBottom
                  ? "กรุณาเลื่อนอ่านเนื้อหาจนจบเพื่อเปิดใช้งาน"
                  : ""}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/" })}
                className="h-11 w-full sm:w-auto"
              >
                ยกเลิก
              </Button>

              <Button
                variant="default"
                disabled={!checked}
                onClick={() => setHasAccepted(true)}
                className="h-11 w-full sm:w-auto"
              >
                ดำเนินการต่อ
              </Button>
            </div>
          </div>
        </MainLayout>
      </section>
    </PageContainer>
  );
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
    if (step === 1) {
      if (!form.category_id)
        next.category_id = "กรุณาเลือกประเภทเรื่องร้องเรียน";
      if (!form.subtopic_id) next.subtopic_id = "กรุณาเลือกหัวข้อย่อย";
      if (form.subtopic_id.endsWith("_other") && !form.subtopic_other.trim())
        next.subtopic_other = "กรุณาระบุรายละเอียดเพิ่มเติม";
    }
    if (step === 2) {
      if (!form.occurred_date) next.occurred_date = "กรุณาเลือกวันที่เกิดเหตุ";
      if (!form.occurred_time) next.occurred_time = "กรุณาเลือกเวลาที่เกิดเหตุ";
      if (!form.location) next.location = "กรุณาเลือกสาขา";

      // Validation ส่วนเก่าของหน้า 2 ที่อาจซ่อนอยู่
      if (form.category_id === "product_service") {
        if (!form.product_type) next.product_type = "กรุณาเลือกชนิดสินค้า";
        if (form.product_type === "OTHER" && !form.product_type_other.trim())
          next.product_type_other = "กรุณาระบุชนิดสินค้าที่ไม่อยู่ในรายการ";
        if (!form.lot_reference.trim())
          next.lot_reference = "กรุณาระบุล็อตอ้างอิง";
        if (!form.contract_number.trim())
          next.contract_number = "กรุณาระบุสัญญาซื้อขายเลขที่";
        if (!form.delivery_date.trim())
          next.delivery_date = "กรุณาเลือกวันส่งมอบสินค้า";
      }

      // Validation ส่วนข้อมูลผู้แจ้ง
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

      // Validation ส่วนยืนยัน
      if (!form.consent_truth)
        next.consent_truth = "กรุณายืนยันความถูกต้องของข้อมูล";
    }
    return next;
  }

  useEffect(() => {
    const nextErrors = stepErrors(currentStep);
    setErrors((prev) => ({ ...prev, ...nextErrors }));
  }, [currentStep, form]);

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
        <section className="min-h-[80vh] py-16">
          <MainLayout narrow>
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold text-primary">
                ระบบได้รับเรื่องของท่านเรียบร้อยแล้ว
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                เจ้าหน้าที่จะดำเนินการตามนโยบายคุ้มครองผู้แจ้งเบาะแส
              </p>
              <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-[var(--surface-muted)] p-6 text-left">
                <div className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
                  หมายเลขอ้างอิง / Reference Number
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="font-display text-2xl font-bold tracking-wider text-primary">
                    {success.ref}
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-muted"
                    onClick={() => {
                      navigator.clipboard.writeText(success.ref);
                      toast.success("คัดลอกแล้ว");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> คัดลอก
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-muted"
                    onClick={() => {
                      navigator.clipboard.writeText(success.ref);
                      toast.success("คัดลอกแล้ว");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> บันทึกภาพ
                  </button>
                </div>
                <p className="mt-3 text-xs text-red-500">
                  โปรดเก็บหมายเลขนี้ไว้สำหรับติดตามสถานะ
                </p>
                <p className="mt-1 text-xs text-red-500">
                  Please keep this number for status tracking.{" "}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={() => navigate({ to: "/" })}>
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

  return (
    <PageContainer>
      <section className="py-12 md:py-3">
        <MainLayout>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary shrink-0"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> กลับสู่หน้าแรก
            </Link>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {Array.from({ length: 2 }, (_, index) => index + 1).map((step) => {
              const isOpen = currentStep === step;
              const getStepInfo = (stepNumber: number) => {
                switch (stepNumber) {
                  case 1:
                    return {
                      th: "ประเภทเรื่องร้องเรียน",
                      en: "Complaint Type",
                      required: true,
                    };
                  case 2:
                    return {
                      th: "รายละเอียดและการยืนยัน",
                      en: "Details & Confirmation",
                      required: true,
                    };
                  default:
                    return { th: "", en: "", required: false };
                }
              };

              const stepInfo = getStepInfo(step);
              const stepSummary = step === 1;

              return (
                <div
                  key={step}
                  ref={(node) => {
                    sectionRefs.current[step - 1] = node;
                  }}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                    isOpen
                      ? "border-primary/30 shadow-elegant"
                      : "border-border shadow-sm hover:border-primary/20",
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => openStep(step)}
                    className={cn(
                      "h-auto rounded-none font-normal whitespace-normal",
                      "group flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-200",
                      isOpen
                        ? "border-b border-border bg-slate-50/50 dark:bg-[var(--surface-muted)] hover:bg-slate-50/50 dark:hover:bg-[var(--surface-muted)]"
                        : "hover:bg-slate-50 dark:hover:bg-[var(--surface-muted)]/50",
                    )}
                    aria-expanded={isOpen}
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      {/* Step Number Indicator */}
                      <span
                        className={cn(
                          "mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold transition-all duration-300",
                          isOpen
                            ? "bg-accent text-primary-foreground shadow-md scale-105"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                        )}
                      >
                        {step}
                      </span>

                      {/* Titles & Summary */}
                      <div className="min-w-0 pt-0.5">
                        <div className="flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
                          {stepInfo.th}
                          {stepInfo.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </div>

                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {stepInfo.en}
                        </div>

                        {!isOpen && stepSummary && (
                          <div className="mt-2.5 flex items-center">
                            <div className="border-l-2 border-primary/40 pl-2.5 text-sm font-medium text-foreground/80 line-clamp-1">
                              {stepSummary}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isOpen && (
                      <span className="mt-1 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                        แตะเพื่อแก้ไข
                      </span>
                    )}
                  </Button>

                  {/* Content Body */}
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                    style={{ willChange: "max-height, opacity, transform" }}
                  >
                    <div className="overflow-hidden">
                      <div className="p-3 md:p-6">
                        {/* Step 1: ประเภทเรื่องร้องเรียน (ยังเหมือนเดิม) */}
                        {step === 1 && (
                          <Section
                            icon={<Tag className="h-4 w-4" />}
                            step="1"
                            title="ประเภทเรื่องร้องเรียน"
                            required
                            hideHeader
                          >
                            <div className="grid gap-5">
                              <div>
                                <Label className="text-xs font-medium font-bold text-foreground/80">
                                  เลือกหมวดหมู่การแจ้งเรื่อง (Select Reporting Category)
                                </Label>
                                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                                  {complaintTypes.map((category) => {
                                    const active =
                                      form.category_id === category.id;
                                    return (
                                      <Button
                                        key={category.id}
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                          update("category_id", category.id);
                                          update("subtopic_id", "");
                                          update("subtopic_other", "");
                                          update("subcategory_other", "");
                                          update("product_type", "");
                                          update("product_type_other", "");
                                          update("lot_reference", "");
                                          update("contract_number", "");
                                          update("delivery_date", "");
                                          setErrors((prev) => ({
                                            ...prev,
                                            category_id: undefined,
                                            subtopic_id: undefined,
                                          }));
                                        }}
                                        className={cn(
                                          "gap-0 h-auto w-full flex-col items-start justify-start whitespace-normal font-normal",
                                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                                          active
                                            ? "border-primary bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                                            : "border-border bg-card text-foreground hover:bg-muted",
                                        )}
                                        aria-pressed={active}
                                      >
                                        <div className="font-medium text-base sm:text-sm">
                                          {category.name}
                                        </div>

                                        {category.nameEn && (
                                          <div className="mt-0 text-xs text-muted-foreground">
                                            {category.nameEn}
                                          </div>
                                        )}

                                        {category.description && (
                                          <div className="mt-0 text-xs opacity-80 leading-relaxed">
                                            {category.description}
                                          </div>
                                        )}
                                      </Button>
                                    );
                                  })}
                                </div>
                                <FieldError msg={errors.category_id} />
                              </div>

                              <div>
                                <Label className="text-xs font-medium font-bold text-foreground/80">
                                  เลือกประเด็นที่เกี่ยวข้อง (Select Related Issue)
                                </Label>
                                <div
                                  className={cn(
                                    "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3",
                                    !selectedCategory
                                      ? "opacity-60 pointer-events-none"
                                      : "",
                                  )}
                                >
                                  {subtopics.map((subtopic) => {
                                    const active =
                                      form.subtopic_id === subtopic.id;
                                    return (
                                      <Button
                                        key={subtopic.id}
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                          update("subtopic_id", subtopic.id);
                                          update("subtopic_other", "");
                                          update("subcategory_other", "");
                                        }}
                                        className={cn(
                                          "gap-0 h-auto w-full flex-col items-start justify-start whitespace-normal font-normal",
                                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                                          active
                                            ? "border-primary bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                                            : "border-border bg-card text-foreground hover:bg-muted",
                                        )}
                                        aria-pressed={active}
                                      >
                                        <div className="font-medium text-base sm:text-sm">
                                          {subtopic.name}
                                        </div>

                                        {subtopic.nameEn && (
                                          <div className="mt-0.5 text-xs text-muted-foreground">
                                            {subtopic.nameEn}
                                          </div>
                                        )}
                                      </Button>
                                    );
                                  })}
                                </div>
                                <FieldError msg={errors.subtopic_id} />
                              </div>

                              {form.subtopic_id.endsWith("_other") && (
                                <div>
                                  <FieldGroup
                                    label="กรุณาระบุรายละเอียด"
                                    required
                                    error={errors.subtopic_other}
                                  >
                                    <Input
                                      className="rounded-lg"
                                      value={form.subtopic_other}
                                      onChange={(e) =>
                                        update("subtopic_other", e.target.value)
                                      }
                                      placeholder="ระบุรายละเอียดเพิ่มเติม"
                                    />
                                  </FieldGroup>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex justify-end pt-4">
                              <Button
                                type="button"
                                disabled={Object.keys(stepErrors(1)).length > 0}
                                onClick={() => handleNextStep(1)}
                              >
                                ถัดไป
                              </Button>
                            </div>
                          </Section>
                        )}

                        {/* Step 2: ยุบรวมรายละเอียดที่เหลือทั้งหมด */}
                        {step === 2 && (
                          <Section
                            icon={<MessageSquareText className="h-4 w-4" />}
                            step="2"
                            title="รายละเอียด, ผู้ร้องเรียน และยืนยัน"
                            required
                            hideHeader
                          >
                            <div className="space-y-10">
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* คอลัมน์ซ้าย: วันที่และเวลาที่เกิดเหตุ */}
                                  <div className="flex flex-col h-full">
                                    <Label className="text-sm font-semibold text-foreground block mb-0">
                                      วันที่และเวลาที่เกิดเหตุ (Date and Time of
                                      Incident){" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>
                                    <div className="grid gap-4 md:grid-cols-2 mt-3">
                                      <div className="flex flex-col">
                                        <Input
                                          type="date"
                                          className={cn(
                                            "relative w-full h-[52px] rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary/20",
                                            // บังคับไอคอนปฏิทินของเบราว์เซอร์ให้ชิดขวา
                                            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                                            errors.occurred_date
                                              ? "border-red-500 bg-red-50 text-[#111827]"
                                              : "border-border text-foreground",
                                          )}
                                          value={form.occurred_date}
                                          onChange={(e) =>
                                            update(
                                              "occurred_date",
                                              e.target.value,
                                            )
                                          }
                                        />
                                        {/* เผื่อที่ว่างด้านล่างให้เท่ากับ Error ฝั่งขวา กล่องจะได้ไม่ขยับหนีกัน */}
                                        <div className="min-h-[24px] mt-1"></div>
                                      </div>

                                      <div className="flex flex-col">
                                        <Input
                                          type="time"
                                          className={cn(
                                            "relative w-full h-[52px] rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary/20",
                                            // บังคับไอคอนนาฬิกาของเบราว์เซอร์ให้ชิดขวา
                                            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                                            errors.occurred_time
                                              ? "border-red-500 bg-red-50 text-[#111827]"
                                              : "border-border text-foreground",
                                          )}
                                          value={form.occurred_time}
                                          onChange={(e) =>
                                            update(
                                              "occurred_time",
                                              e.target.value,
                                            )
                                          }
                                        />
                                        <div className="min-h-[24px] mt-1"></div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* คอลัมน์ขวา: สาขา (Branch Location) */}
                                  <div className="flex flex-col h-full">
                                    <Label className="text-sm font-semibold text-foreground block mb-0">
                                      สาขาที่เกิดเหตุ (Branch Location){" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>
                                    <div className="mt-3 flex flex-col">
                                      <Select
                                        value={form.location}
                                        onValueChange={(value) =>
                                          update("location", value)
                                        }
                                      >
                                        <SelectTrigger
                                          className={cn(
                                            "w-full h-[52px] rounded-lg bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                            errors.location
                                              ? "border-slate-300 bg-white text-[#111827]"
                                              : "border-border text-foreground",
                                          )}
                                        >
                                          <SelectValue placeholder="-- กรุณาเลือกสาขา (Select Branch) --" />
                                        </SelectTrigger>

                                        <SelectContent>
                                          {complaintLocations.map(
                                            (location) => (
                                              <SelectItem
                                                key={location.id}
                                                value={location.id}
                                              >
                                                {location.name}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>

                                      {/* จัดการพื้นที่ Error ให้มีความสูงคงที่ เพื่อไม่ให้ดัน Select ลอยขึ้น */}
                                      <div className="min-h-[24px] mt-1">
                                        <FieldError msg={errors.location} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

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
                                      value={
                                        form.has_witness ? "true" : "false"
                                      }
                                      onValueChange={(v) =>
                                        update("has_witness", v === "true")
                                      }
                                    >
                                      <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                          value="true"
                                          id="witness_yes"
                                        />
                                        <Label
                                          htmlFor="witness_yes"
                                          className="text-sm font-medium cursor-pointer"
                                        >
                                          มี{" "}
                                          <span className="text-muted-foreground font-normal ml-0.5">
                                            (Yes)
                                          </span>
                                        </Label>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                          value="false"
                                          id="witness_no"
                                        />
                                        <Label
                                          htmlFor="witness_no"
                                          className="text-sm font-medium cursor-pointer"
                                        >
                                          ไม่มี{" "}
                                          <span className="text-muted-foreground font-normal ml-0.5">
                                            (No)
                                          </span>
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
                                        รายชื่อพยาน{" "}
                                        <span className="text-xs text-muted-foreground ml-1">
                                          (Witness List)
                                        </span>
                                      </div>
                                      <div className="space-y-3 pb-1 px-1">
                                        {form.witnesses?.map(
                                          (witness, index) => (
                                            <div
                                              key={index}
                                              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                                            >
                                              <Input
                                                className="rounded-lg flex-1 bg-white"
                                                value={witness.name}
                                                onChange={(e) => {
                                                  const updated = [
                                                    ...form.witnesses!,
                                                  ];
                                                  updated[index] = {
                                                    ...updated[index],
                                                    name: e.target.value,
                                                  };
                                                  update("witnesses", updated);
                                                }}
                                                placeholder="ชื่อ-นามสกุล (Name)"
                                              />

                                              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                                                <Input
                                                  className="rounded-lg w-full bg-white"
                                                  value={witness.phone}
                                                  onChange={(e) => {
                                                    const updated = [
                                                      ...form.witnesses!,
                                                    ];
                                                    updated[index] = {
                                                      ...updated[index],
                                                      phone: e.target.value,
                                                    };
                                                    update(
                                                      "witnesses",
                                                      updated,
                                                    );
                                                  }}
                                                  placeholder="เบอร์โทรศัพท์ (Phone)"
                                                />

                                                {index === 0 ? (
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="shrink-0 w-10 sm:w-24"
                                                    onClick={() => {
                                                      update("witnesses", [
                                                        ...(form.witnesses ||
                                                          []),
                                                        { name: "", phone: "" },
                                                      ]);
                                                    }}
                                                  >
                                                    <Plus className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">
                                                      เพิ่ม
                                                    </span>
                                                  </Button>
                                                ) : (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="shrink-0 w-10 sm:w-24 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => {
                                                      update(
                                                        "witnesses",
                                                        form.witnesses!.filter(
                                                          (_, i) => i !== index,
                                                        ),
                                                      );
                                                    }}
                                                  >
                                                    <X className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">
                                                      ลบ
                                                    </span>
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-semibold text-foreground block mb-0.5">
                                    รายละเอียดเพิ่มเติม
                                  </Label>
                                  <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                                    <span>
                                      Additional Information{" "}
                                      <span className="ml-1 opacity-70">
                                        (ไม่บังคับ / Optional)
                                      </span>
                                    </span>
                                  </div>

                                  <Textarea
                                    className="min-h-[120px] resize-y rounded-xl bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    maxLength={1000}
                                    placeholder="สามารถระบุรายละเอียดเพิ่มเติม เช่น บุคคลที่เกี่ยวข้อง เหตุการณ์เพิ่มเติม หรือข้อมูลอื่น ๆ..."
                                    value={form.description}
                                    onChange={(e) =>
                                      update("description", e.target.value)
                                    }
                                  />
                                  <div className="mt-2 flex items-center justify-end">
                                    <span
                                      className={cn(
                                        "text-xs font-medium",
                                        form.description.length === 0
                                          ? "text-muted-foreground/60"
                                          : "text-primary/70",
                                      )}
                                    >
                                      {form.description.length} / 1000
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <hr className="border-border" />

                              {/* --- Section: แนบไฟล์ --- */}
                              <div className="space-y-4">
                                <h3 className="text-base font-semibold text-primary">
                                  แนบไฟล์ / Attach Files (ถ้ามี)
                                </h3>
                                <label
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                  }}
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
                                  <div className="mt-3 text-sm font-medium">
                                    ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก
                                  </div>
                                  <div className="mt-1 text-sm font-medium">
                                    Drag and drop files here, or click to select
                                  </div>

                                  <div className="mt-2 text-xs text-muted-foreground">
                                    รองรับ PDF, DOCX, PNG, JPG, MP4, MOV ·
                                    สูงสุด 5 ไฟล์
                                  </div>
                                  <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,video/mp4,video/quicktime" // เพิ่มบรรทัดนี้
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
                                          <span className="truncate">
                                            {file.name}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            ({Math.round(file.size / 1024)} KB)
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            update(
                                              "files",
                                              form.files.filter(
                                                (_, itemIndex) =>
                                                  itemIndex !== index,
                                              ),
                                            )
                                          }
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

                              <hr className="border-border" />

                              {/* --- Section: ข้อมูลผู้ร้องเรียน --- */}
                              <div className="space-y-4">
                                <h3 className="text-base font-semibold text-primary flex items-center gap-2">
                                  ข้อมูลผู้ร้องเรียน (Reporter Information)
                                </h3>
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
                                        หากเปิดใช้งาน
                                        ระบบจะข้ามการกรอกข้อมูลส่วนตัวทั้งหมดทันที
                                        <br />
                                      </div>
                                    </div>
                                  </div>
                                  <Switch
                                    className="mt-1"
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
                                      <FieldGroup
                                        label="ชื่อ-นามสกุล"
                                        required
                                        error={errors.reporter_name}
                                      >
                                        <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">
                                          Full Name
                                        </div>
                                        <Input
                                          className={cn(
                                            "rounded-lg bg-background",
                                            errors.reporter_name &&
                                              "border-slate-300 bg-white",
                                          )}
                                          value={form.reporter_name}
                                          onChange={(e) =>
                                            update(
                                              "reporter_name",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="ระบุชื่อ-สกุล"
                                        />
                                      </FieldGroup>

                                      <FieldGroup
                                        label="อีเมล"
                                        required
                                        error={errors.reporter_email}
                                      >
                                        <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">
                                          Email Address
                                        </div>
                                        <Input
                                          type="email"
                                          className={cn(
                                            "rounded-lg bg-background",
                                            errors.reporter_email &&
                                              "border-slate-300 bg-white",
                                          )}
                                          value={form.reporter_email}
                                          onChange={(e) =>
                                            update(
                                              "reporter_email",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="ระบุอีเมล"
                                          autoComplete="email"
                                        />
                                      </FieldGroup>

                                      <FieldGroup
                                        label="เบอร์โทรศัพท์"
                                        full
                                        error={errors.reporter_phone}
                                      >
                                        <div className="-mt-1 mb-1.5 text-xs text-muted-foreground">
                                          Phone Number
                                        </div>
                                        <Input
                                          className={cn(
                                            "rounded-lg bg-background",
                                            errors.reporter_phone &&
                                              "border-destructive/50 bg-destructive/5",
                                          )}
                                          value={form.reporter_phone}
                                          onChange={(e) =>
                                            update(
                                              "reporter_phone",
                                              e.target.value,
                                            )
                                          }
                                          placeholder="ระบุเบอร์โทรศํัพท์"
                                        />
                                      </FieldGroup>
                                    </>
                                  )}
                                </div>
                              </div>

                              <hr className="border-border" />

                              {/* --- Section: การยืนยัน (Submit) --- */}
                              <div className="space-y-4">
                                <h3 className="text-base font-semibold text-primary">
                                  การยืนยัน (Confirmation)
                                </h3>
                                {/* --- ส่วนสรุป --- */}
                                <div className="mb-6 rounded-xl border border-border bg-[#f8f9fa] p-6 text-sm shadow-sm">
                                  <div className="space-y-3 text-foreground">
                                    <div>
                                      <span className="font-bold text-[#1e3989]">
                                        ประเภทเรื่องร้องเรียน :{" "}
                                      </span>
                                      <span>
                                        {summaryCategory}
                                        {summarySubtopic
                                          ? ` > ${summarySubtopic}`
                                          : ""}
                                        {summarySubtopicDetail
                                          ? ` (${summarySubtopicDetail})`
                                          : ""}
                                      </span>
                                    </div>

                                    <div>
                                      <span className="font-bold text-[#1e3989]">
                                        สาขาที่เกิดเหตุ :{" "}
                                      </span>
                                      <span>{summaryLocation}</span>
                                    </div>

                                    <div>
                                      <span className="font-bold text-[#1e3989]">
                                        วันที่และเวลาที่เกิดเหตุ :{" "}
                                      </span>
                                      <span>
                                        วันที่{" "}
                                        {form.occurred_date
                                          ? form.occurred_date
                                          : "-"}{" "}
                                        เวลา{" "}
                                        {form.occurred_time
                                          ? form.occurred_time
                                          : "-"}{" "}
                                        น.
                                      </span>
                                    </div>

                                    <div>
                                      <span className="font-bold text-[#1e3989]">
                                        พยาน :{" "}
                                      </span>
                                      {/* แก้ไขให้เช็คจาก boolean และจำนวนรายการใน array */}
                                      <span>
                                        {form.has_witness
                                          ? `มี (${form.witnesses?.length || 0} คน)`
                                          : "ไม่มี"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <label
                                  className={cn(
                                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                                    errors.consent_truth
                                      ? "border-slate-300 bg-slate-50"
                                      : "border-border bg-slate-50 dark:bg-[var(--surface-muted)] hover:border-primary/40",
                                  )}
                                >
                                  <Checkbox
                                    className="mt-1"
                                    checked={form.consent_truth}
                                    onCheckedChange={(v) =>
                                      update("consent_truth", v === true)
                                    }
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm text-foreground/90 leading-relaxed">
                                      ข้าพเจ้ายืนยันว่า{" "}
                                      <span className="font-semibold text-foreground">
                                        ข้อมูลที่ให้เป็นความจริง
                                      </span>{" "}
                                      และส่งด้วยเจตนาสุจริต
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                      I confirm that the information provided is
                                      true and submitted in good faith.
                                    </div>
                                  </div>
                                </label>
                                <FieldError msg={errors.consent_truth} />
                              </div>

                              {/* --- Submit Button --- */}
                              <div className="mt-6 flex justify-end">
                                <Button
                                  type="submit"
                                  size="lg"
                                  disabled={
                                    submitting ||
                                    !form.consent_truth ||
                                    Object.keys(stepErrors(2)).length > 0
                                  }
                                >
                                  <Send className="mr-1.5 h-4 w-4" />{" "}
                                  {submitting
                                    ? "กำลังส่ง…"
                                    : "ส่งเรื่องร้องเรียน"}
                                </Button>
                              </div>
                            </div>
                          </Section>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </form>
        </MainLayout>
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
    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
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
