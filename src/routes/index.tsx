import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Search, ArrowRight, FileWarning } from "lucide-react";
import { PageContainer } from "@/components/CMS/PageContainer";
import { MainLayout } from "@/components/CMS/CMSLayout";
import { useI18n } from "@/i18n/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) — ระบบรับเรื่องร้องเรียน" },
      {
        name: "description",
        content:
          "แพลตฟอร์มสำหรับแจ้งและติดตามเรื่องร้องเรียนอย่างปลอดภัย โปร่งใส และเป็นความลับ",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  return (
    <PageContainer>
      {/* HERO — compact */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-14 md:pb-12">
        <MainLayout>
          <div className="mx-auto max-w-2xl text-center animate-[fadeInUp_0.6s_ease-out_both]">
            <div className="text-xs font-medium uppercase tracking-wide text-[#6B7280] md:text-[13px]">
              {t("header.brand")}
            </div>
            <h1 className="mt-2 font-display text-[22px] font-bold leading-tight text-[#111827] sm:text-[26px] md:text-[32px]">
              ระบบรับเรื่องร้องเรียน
            </h1>
            <div className="mx-auto mt-2 h-[3px] w-10 bg-[var(--gold)]" />
            <p className="mx-auto mt-2 max-w-xl text-[14px] leading-snug text-[#6B7280] md:text-[15px]">
              แจ้งและติดตามเรื่องร้องเรียนอย่างปลอดภัย โปร่งใส และเป็นความลับ
            </p>
          </div>
        </MainLayout>
      </section>

      {/* MAIN ACTIONS */}
      <section className="relative pt-2 md:pt-4 pb-10 md:pb-12">
        {" "}
        <MainLayout>
          <div className="flex flex-col md:flex-row justify-center gap-3">
            {/* Card 1 — Submit */}
            <Link
              to="/SubmitComplaintRoute"
              className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-border bg-white p-5 text-left shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 animate-[fadeInUp_0.7s_ease-out_0.1s_both] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="absolute inset-x-0 top-0 h-[3px] bg-accent transition-colors duration-300 group-hover:bg-primary" />{" "}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft text-primary transition-transform duration-300 group-hover:scale-105  group-hover:bg-primary group-hover:text-white ">
                <FileWarning className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-[17px] font-bold text-[#111827] md:text-[18px]">
                แจ้งเรื่องร้องเรียน
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B7280] md:text-[14px]">
                แจ้งเรื่องได้ทั้งแบบเปิดเผยตัวตนหรือไม่ระบุตัวตน
              </p>
              <div className="mt-5 inline-flex items-center gap-2 self-start rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
                แจ้งเรื่องร้องเรียน
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Card 2 — Track */}
            <Link
              to="/TrackComplaintRoute"
              className="group relative flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-border bg-white p-5 text-left shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 animate-[fadeInUp_0.7s_ease-out_0.2s_both] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="absolute inset-x-0 top-0 h-[3px] bg-accent transition-colors duration-300 group-hover:bg-primary" />
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
                <Search className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-[17px] font-bold text-[#111827] md:text-[18px]">
                ติดตามเรื่องร้องเรียน
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B7280] md:text-[14px]">
                ตรวจสอบสถานะเรื่องร้องเรียนด้วยรหัสอ้างอิง
              </p>
              <div className="mt-5 inline-flex items-center gap-2 self-start rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
                ติดตามสถานะ
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Trust note */}
          <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-center text-[12px] text-[#6B7280] md:text-[13px]">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>
              ข้อมูลของท่านจะถูกเก็บเป็นความลับตาม
              <span className="text-accent">นโยบายของบริษัท</span>
            </span>
          </div>
        </MainLayout>
      </section>
    </PageContainer>
  );
}
