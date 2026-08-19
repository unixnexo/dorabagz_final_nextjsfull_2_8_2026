// "use client";

// export function CustomRangeInputs({
//     startDate,
//     endDate,
//     onStartDateChange,
//     onEndDateChange,
// }: {
//     startDate: string;
//     endDate: string;
//     onStartDateChange: (value: string) => void;
//     onEndDateChange: (value: string) => void;
// }) {
//     return (
//         <div className="mt-2.5 grid grid-cols-2 gap-2.5">
//             <DateField label="از تاریخ" value={startDate} onChange={onStartDateChange} />
//             <DateField label="تا تاریخ" value={endDate} onChange={onEndDateChange} />
//         </div>
//     );
// }

// function DateField({
//     label,
//     value,
//     onChange,
// }: {
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
// }) {
//     return (
//         <label className="flex flex-col gap-1 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
//             <span className="text-[11px] font-medium text-[#8E8E93]">{label}</span>
//             <input
//                 type="date"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="bg-transparent text-[13.5px] font-medium text-[#1C1C1E] outline-none [color-scheme:light]"
//             />
//         </label>
//     );
// }





"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const YEARS = Array.from({ length: 51 }, (_, i) => 1400 + i);

const MONTHS = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function CustomRangeInputs({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: {
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
}) {
    return (
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <DateField
                label="از تاریخ"
                value={startDate}
                onChange={onStartDateChange}
            />

            <DateField
                label="تا تاریخ"
                value={endDate}
                onChange={onEndDateChange}
            />
        </div>
    );
}

function DateField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    const [year = "", month = "", day = ""] = value.split("-");

    function updateDate(
        nextYear: string = year,
        nextMonth: string = month,
        nextDay: string = day
    ) {
        // Keep the partially selected date so the UI can display it.
        onChange(
            `${nextYear}-${nextMonth}-${nextDay}`
        );
    }

    return (
        <div className="flex flex-col gap-2 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
            <span className="text-[11px] font-medium text-[#8E8E93]">
                {label}
            </span>

            <div className="grid grid-cols-3 gap-1.5" dir="rtl">
                {/* Day */}
                <Select
                    value={day || undefined}
                    onValueChange={(value) =>
                        updateDate(year, month, value)
                    }
                >
                    <SelectTrigger className="h-8 border-0 bg-transparent px-1.5 text-[12px] shadow-none focus:ring-0">
                        <SelectValue placeholder="روز" />
                    </SelectTrigger>

                    <SelectContent>
                        {DAYS.map((day) => (
                            <SelectItem key={day} value={String(day)}>
                                {day.toLocaleString("fa-IR")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Month */}
                <Select
                    value={month || undefined}
                    onValueChange={(value) =>
                        updateDate(year, value, day)
                    }
                >
                    <SelectTrigger className="h-8 border-0 bg-transparent px-1.5 text-[12px] shadow-none focus:ring-0">
                        <SelectValue
                            placeholder="ماه"
                        />
                    </SelectTrigger>

                    <SelectContent>
                        {MONTHS.map((month, index) => (
                            <SelectItem
                                key={month}
                                value={String(index + 1)}
                            >
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Year */}
                <Select
                    value={year || undefined}
                    onValueChange={(value) =>
                        updateDate(value, month, day)
                    }
                >
                    <SelectTrigger className="h-8 border-0 bg-transparent px-1.5 text-[12px] shadow-none focus:ring-0">
                        <SelectValue placeholder="سال" />
                    </SelectTrigger>

                    <SelectContent>
                        {YEARS.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}