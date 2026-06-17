import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t-4 border-[var(--gold)] bg-[var(--surface-deep)] text-primary-foreground/80">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary-foreground/10 ring-1 ring-[var(--gold)]/40">
              <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-bold text-primary-foreground">
                {t("header.brand")}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
                {t("header.subtitle")}
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            {t("footer.about")}
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            {t("footer.channels")}
          </h4>
          <div className="mt-4 h-px w-10 bg-[var(--gold)]/60" />
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                to="/SubmitComplaintRoute"
                className="hover:text-primary-foreground"
              >
                {t("footer.onlineForm")}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> compliance@company.co.th
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> {t("header.hotline")}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5" /> {t("footer.address")}
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            {t("footer.quickLinks")}
          </h4>
          <div className="mt-4 h-px w-10 bg-[var(--gold)]/60" />
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-primary-foreground">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link
                to="/SubmitComplaintRoute"
                className="hover:text-primary-foreground"
              >
                {t("nav.submit")}
              </Link>
            </li>
            <li>
              <Link
                to="/TrackComplaintRoute"
                className="hover:text-primary-foreground"
              >
                {t("nav.track")}
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-primary-foreground">
                {t("nav.signIn")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            {t("footer.governance")}
          </h4>
          <div className="mt-4 h-px w-10 bg-[var(--gold)]/60" />
          <ul className="mt-4 space-y-3 text-sm">
            <li>{t("footer.policy1")}</li>
            <li>{t("footer.policy2")}</li>
            <li>{t("footer.policy3")}</li>
            <li>{t("footer.policy4")}</li>
          </ul>
        </div>
      </div>
      {/* Company info strip */}
      <div className="border-t border-primary-foreground/10 bg-primary-foreground/[0.03]">
        <div className="container mx-auto px-4 py-6 text-[12px] leading-relaxed text-primary-foreground/75">
          <div className="font-display text-sm font-bold text-[var(--gold)]">
            {t("footer.companyName")}
          </div>
          <div className="mt-1">{t("footer.companyAddress")}</div>
          <div>{t("footer.companyPhone")}</div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto flex flex-col items-start justify-between gap-3 px-4 py-5 text-[11px] text-primary-foreground/60 md:flex-row md:items-center">
          <div>{t("footer.copyright", { year: new Date().getFullYear() })}</div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-primary-foreground">
              {t("footer.privacy")}
            </Link>
            <span className="text-primary-foreground/30">|</span>
            <Link to="/" className="hover:text-primary-foreground">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
