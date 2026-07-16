import React, { useState } from "react";
import { Search, RotateCcw, Filter, Download, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AdvancedFilterValues = Record<string, string | undefined>;

export type FilterFieldConfig = {
  key: string;
  label: string;
  type: "text" | "select" | "daterange";
  placeholder?: string;
  options?: { value: string; label: string; code?: string }[];
};

export interface AdvancedFilterProps {
  fields: FilterFieldConfig[];
  onApply: (values: AdvancedFilterValues) => void;
  onReset?: () => void;
  onExport?: (values: AdvancedFilterValues) => void;
  resultCount?: number;
  totalCount?: number;
  isLoading?: boolean;
}

export function AdvancedFilter({
  fields,
  onApply,
  onReset,
  onExport,
  resultCount,
  totalCount,
  isLoading,
}: AdvancedFilterProps) {
  const [values, setValues] = useState<AdvancedFilterValues>({});

  const handleTextChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val === "all" ? "" : val }));
  };

  const handleReset = () => {
    setValues({});
    onApply({});
    if (onReset) onReset();
  };

  const handleApply = () => {
    onApply(values);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(values);
    }
  };

  return (
    <Card className="border-[var(--border)] bg-white shadow-soft mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-2 text-[#1B2B4B]">
            <Filter className="h-5 w-5 text-[#C9A84C]" />
            <h3 className="font-semibold text-lg">ตัวกรองขั้นสูง</h3>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
              className="text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> ล้างตัวกรอง
            </Button>
            <Button
              onClick={handleApply}
              disabled={isLoading}
              size="sm"
              className="bg-[#1B2B4B] text-white hover:bg-[#1B2B4B]/90 shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" /> ค้นหา
            </Button>
            {onExport && (
              <Button
                onClick={handleExport}
                disabled={isLoading}
                size="sm"
                className="bg-[#C9A84C] text-white hover:bg-[#C9A84C]/90 shadow-sm"
              >
                <Download className="mr-2 h-4 w-4" /> ส่งออก (Export)
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                {field.label}
              </Label>

              {field.type === "text" && (
                <Input
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={(e) => handleTextChange(field.key, e.target.value)}
                  className="bg-white border-slate-200 h-9"
                />
              )}

              {field.type === "select" && (
                <Select
                  value={values[field.key] || "all"}
                  onValueChange={(val) => handleSelectChange(field.key, val)}
                >
                  <SelectTrigger className="bg-white border-slate-200 h-9">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "daterange" && (
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-slate-200 h-9 px-3",
                          !values[`${field.key}_from`] && "text-muted-foreground"
                        )}
                      >
                        {values[`${field.key}_from`] ? (
                          format(parseISO(values[`${field.key}_from`] as string), "dd/MM/yyyy")
                        ) : (
                          <span className="text-sm">dd/mm/yyyy</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[`${field.key}_from`] ? parseISO(values[`${field.key}_from`] as string) : undefined}
                        onSelect={(date) =>
                          handleTextChange(
                            `${field.key}_from`,
                            date ? format(date, "yyyy-MM-dd") : ""
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-slate-400 text-sm">ถึง</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-slate-200 h-9 px-3",
                          !values[`${field.key}_to`] && "text-muted-foreground"
                        )}
                      >
                        {values[`${field.key}_to`] ? (
                          format(parseISO(values[`${field.key}_to`] as string), "dd/MM/yyyy")
                        ) : (
                          <span className="text-sm">dd/mm/yyyy</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[`${field.key}_to`] ? parseISO(values[`${field.key}_to`] as string) : undefined}
                        onSelect={(date) =>
                          handleTextChange(
                            `${field.key}_to`,
                            date ? format(date, "yyyy-MM-dd") : ""
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          ))}
        </div>

        {(resultCount !== undefined || totalCount !== undefined) && (
          <div className="mt-6 pt-4 border-t flex justify-end">
            <span className="text-sm text-slate-500 font-medium">
              แสดง {resultCount ?? 0} จาก {totalCount ?? 0} รายการ
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
