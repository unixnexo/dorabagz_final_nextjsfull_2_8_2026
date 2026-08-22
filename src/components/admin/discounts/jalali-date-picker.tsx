"use client";

import { useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    gregorianToJalali,
    jalaliToGregorian,
    jalaliMonthLength,
    PERSIAN_MONTH_NAMES,
} from "@/lib/jalali-discount";

const YEARS = Array.from({ length: 101 }, (_, i) => 1400 + i); // 1400 - 1500

const TRIGGER_CLASS =
    "border-0 rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] tabular-nums text-[#1C1C1E] shadow-none ring-0 focus:ring-0 focus-visible:ring-0";

export function JalaliDatePicker({
    value,
    onChange,
    onClear,
    label,
}: {
    /** ISO datetime string, or "" / null if unset. */
    value: string | null;
    onChange: (isoValue: string) => void;
    onClear: () => void;
    label: string;
}) {
    const current = value ? new Date(value) : null;

    const { jy, jm, jd, hour, minute } = useMemo(() => {
        if (!current) return { jy: null, jm: null, jd: null, hour: 23, minute: 59 };
        const { jy, jm, jd } = gregorianToJalali(
            current.getFullYear(),
            current.getMonth() + 1,
            current.getDate()
        );
        return { jy, jm, jd, hour: current.getHours(), minute: current.getMinutes() };
    }, [current]);

    const dayCount = jy && jm ? jalaliMonthLength(jy, jm) : 31;
    const days = Array.from({ length: dayCount }, (_, i) => i + 1);

    function commit(nextJy: number, nextJm: number, nextJd: number, nextHour: number, nextMinute: number) {
        const clampedJd = Math.min(nextJd, jalaliMonthLength(nextJy, nextJm));
        const { gy, gm, gd } = jalaliToGregorian(nextJy, nextJm, clampedJd);
        const d = new Date(gy, gm - 1, gd, nextHour, nextMinute);
        onChange(d.toISOString());
    }

    if (!value) {
        return (
            <div>
                <div className="mb-1.5 flex items-center justify-between px-1">
                    <label className="text-[12.5px] font-medium text-[#8E8E93]">{label}</label>
                </div>
                <button
                    type="button"
                    onClick={() => commit(1403, 1, 1, 23, 59)}
                    className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-right text-[13px] text-[#C7C7CC]"
                >
                    بدون تاریخ — برای تعیین تاریخ بزنید
                </button>
            </div>
        );
    }

    const y = jy ?? 1403;
    const m = jm ?? 1;
    const d = jd ?? 1;

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between px-1">
                <label className="text-[12.5px] font-medium text-[#8E8E93]">{label}</label>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[11px] font-medium text-[#FF3B30]"
                >
                    حذف تاریخ
                </button>
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    <Select value={String(y)} onValueChange={(v) => commit(Number(v), m, d, hour, minute)}>
                        <SelectTrigger className={TRIGGER_CLASS}>
                            <SelectValue placeholder="سال" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map((yy) => (
                                <SelectItem key={yy} value={String(yy)} className="tabular-nums">
                                    {yy}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={String(m)} onValueChange={(v) => commit(y, Number(v), d, hour, minute)}>
                        <SelectTrigger className={TRIGGER_CLASS}>
                            <SelectValue placeholder="ماه" />
                        </SelectTrigger>
                        <SelectContent>
                            {PERSIAN_MONTH_NAMES.map((name, i) => (
                                <SelectItem key={name} value={String(i + 1)}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={String(d)} onValueChange={(v) => commit(y, m, Number(v), hour, minute)}>
                        <SelectTrigger className={TRIGGER_CLASS}>
                            <SelectValue placeholder="روز" />
                        </SelectTrigger>
                        <SelectContent>
                            {days.map((dd) => (
                                <SelectItem key={dd} value={String(dd)} className="tabular-nums">
                                    {dd}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={23}
                        value={hour}
                        onChange={(e) => commit(y, m, d, Math.min(23, Math.max(0, Number(e.target.value) || 0)), minute)}
                        className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-center text-[13px] tabular-nums text-[#1C1C1E] outline-none"
                        placeholder="ساعت"
                    />
                    <span className="text-[13px] text-[#8E8E93]">:</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={59}
                        value={minute}
                        onChange={(e) => commit(y, m, d, hour, Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-center text-[13px] tabular-nums text-[#1C1C1E] outline-none"
                        placeholder="دقیقه"
                    />
                </div>
            </div>
        </div>
    );
}
