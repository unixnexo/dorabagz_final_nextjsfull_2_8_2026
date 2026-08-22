export function FormField({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block px-1 text-[12.5px] font-medium text-[#8E8E93]">
                {label}
            </label>
            {children}
            {hint && (
                <p className="mt-1 px-1 text-[11px] text-[#C7C7CC]">{hint}</p>
            )}
        </div>
    );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={
                "w-full rounded-2xl bg-black/[0.04] px-3.5 py-2.5 text-[13px] text-[#1C1C1E] outline-none placeholder:text-[#C7C7CC] tabular-nums " +
                (props.className ?? "")
            }
        />
    );
}
