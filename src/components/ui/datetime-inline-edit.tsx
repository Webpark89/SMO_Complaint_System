import { useRef, useState } from "react";

interface DateTimeInlineEditProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateLabel?: string;
  timeLabel?: string;
  disabled?: boolean;
  showThaiDate?: boolean;
}

/**
 * Inline date and time editor component
 * - Click anywhere to enter edit mode
 * - Auto-focuses date input on click
 * - Instant updates on change
 * - Mobile-friendly native inputs
 * - No edit button required
 */
export function DateTimeInlineEdit({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateLabel = "วันที่",
  timeLabel = "เวลา",
  disabled = false,
  showThaiDate = true,
}: DateTimeInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleEditStart = () => {
    if (!disabled) {
      setIsEditing(true);
      setTimeout(() => dateInputRef.current?.focus(), 0);
    }
  };

  const handleEditEnd = () => {
    setIsEditing(false);
  };

  const formatThaiDate = (dateStr: string): string => {
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const displayDate = showThaiDate ? formatThaiDate(date) : date;

  return (
    <div className="space-y-3">
      {/* Edit Mode */}
      {isEditing && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dateLabel}
            </label>
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              onBlur={handleEditEnd}
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  e.preventDefault();
                  timeInputRef.current?.focus();
                } else if (e.key === "Escape") {
                  handleEditEnd();
                }
              }}
              className="mt-2 w-full rounded-lg border border-primary bg-white px-3 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {timeLabel}
            </label>
            <input
              ref={timeInputRef}
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              onBlur={handleEditEnd}
              onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey) {
                  e.preventDefault();
                  dateInputRef.current?.focus();
                } else if (e.key === "Escape") {
                  handleEditEnd();
                }
              }}
              className="mt-2 w-full rounded-lg border border-primary bg-white px-3 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {/* Display Mode */}
      {!isEditing && (
        <div
          onClick={handleEditStart}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              handleEditStart();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={`group grid gap-3 sm:grid-cols-2 ${!disabled && "cursor-pointer"}`}
        >
          {/* Date Display */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dateLabel}
            </label>
            <div
              className={`mt-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 ${
                !disabled &&
                "group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-sm"
              } ${disabled && "bg-muted/50 text-muted-foreground"}`}
            >
              {displayDate}
            </div>
          </div>

          {/* Time Display */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {timeLabel}
            </label>
            <div
              className={`mt-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 ${
                !disabled &&
                "group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-sm"
              } ${disabled && "bg-muted/50 text-muted-foreground"}`}
            >
              {time}
            </div>
          </div>
        </div>
      )}

      {/* Hint Text */}
      {!isEditing && !disabled && (
        <p className="text-xs text-muted-foreground/60">
          คลิกเพื่อแก้ไขวันที่และเวลา
        </p>
      )}
    </div>
  );
}

export default DateTimeInlineEdit;
