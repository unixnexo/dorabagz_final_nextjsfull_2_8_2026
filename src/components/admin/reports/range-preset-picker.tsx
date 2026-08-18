"use client";

import type { ReportRangePreset } from "@/types/report";
import { cn } from "@/lib/utils";

const PRESET_LABELS: Record<ReportRangePreset, string> = {
    TODAY: "امروز",
    THIS_WEEK: "هفته",
    THIS_MONTH: "ماه",
    THIS_YEAR: "سال",
    CUSTOM: "دلخواه",
};

const PRESET_ORDER: ReportRangePreset[] = [
    "TODAY",
    "THIS_WEEK",
    "THIS_MONTH",
    "THIS_YEAR",
    "CUSTOM",
];

export function RangePresetPicker({
    value,
    onChange,
}: {
    value: ReportRangePreset;
    onChange: (preset: ReportRangePreset) => void;
}) {
    return (
        <div className="flex gap-1 rounded-full bg-black/[0.05] p-1">
            {PRESET_ORDER.map((preset) => {
                const isActive = value === preset;
                return (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => onChange(preset)}
                        className={cn(
                            "flex-1 rounded-full py-2 text-[12.5px] font-medium transition-all",
                            isActive
                                ? "bg-white text-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                                : "text-[#8E8E93] active:text-[#1C1C1E]"
                        )}
                    >
                        {PRESET_LABELS[preset]}
                    </button>
                );
            })}
        </div>
    );
}