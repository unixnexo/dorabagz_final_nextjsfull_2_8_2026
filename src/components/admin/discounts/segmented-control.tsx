export function SegmentedControl<T extends string>({
    value,
    onChange,
    options,
}: {
    value: T;
    onChange: (value: T) => void;
    options: { value: T; label: string }[];
}) {
    return (
        <div className="flex gap-1 rounded-2xl bg-black/[0.05] p-1">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={
                        "flex-1 rounded-xl py-2 text-[12.5px] font-medium transition-colors " +
                        (value === opt.value
                            ? "bg-white text-[#1C1C1E] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                            : "text-[#8E8E93]")
                    }
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
