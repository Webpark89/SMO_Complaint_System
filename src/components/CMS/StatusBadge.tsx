import { cn } from "@/lib/utils";
import { type ComplaintStatus } from "@/services/ComplaintService";
import { useI18n } from "@/i18n/i18n";
import type { DictKey } from "@/i18n/dict";

const STYLES: Record<ComplaintStatus, string> = {
  // Pending → gray, Investigating → gold, Closed/Completed → navy
  pending: "bg-muted text-muted-foreground border-border",
  in_progress:
    "bg-[var(--gold-soft)] text-[var(--gold-foreground)] border-[var(--gold)]/40",
  investigating:
    "bg-[var(--gold-soft)] text-[var(--gold-foreground)] border-[var(--gold)]/50",
  completed: "bg-primary/10 text-primary border-primary/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  closed: "bg-primary text-primary-foreground border-primary",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        STYLES[status],
        className,
      )}
    >
      {t(`status.${status}` as DictKey)}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    low: "bg-muted-foreground/40",
    medium: "bg-primary/60",
    high: "bg-[var(--gold)]",
    critical: "bg-destructive",
  };
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        map[priority] ?? "bg-muted",
      )}
    />
  );
}
