"use client";

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
            <DateField label="از تاریخ" value={startDate} onChange={onStartDateChange} />
            <DateField label="تا تاریخ" value={endDate} onChange={onEndDateChange} />
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
    return (
        <label className="flex flex-col gap-1 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
            <span className="text-[11px] font-medium text-[#8E8E93]">{label}</span>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent text-[13.5px] font-medium text-[#1C1C1E] outline-none [color-scheme:light]"
            />
        </label>
    );
}