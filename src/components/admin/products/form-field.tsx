import type { ReactNode } from "react";

export function FormField({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between px-1">
                <span className="text-[12.5px] font-medium text-[#8E8E93]">
                    {label}
                </span>
                {hint && (
                    <span className="text-[11px] text-[#C7C7CC]">{hint}</span>
                )}
            </div>
            {children}
        </div>
    );
}