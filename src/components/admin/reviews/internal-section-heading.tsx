import { Lock } from "lucide-react";

export function InternalSectionHeading({
    title,
    count,
}: {
    title: string;
    count?: number;
}) {
    return (
        <div className="mb-1 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#8E8E93]" strokeWidth={2.25} />
                <h2 className="text-[15px] font-bold text-[#1C1C1E]">{title}</h2>
            </div>
            {typeof count === "number" && (
                <span className="text-[11.5px] text-[#8E8E93]">
                    {count.toLocaleString("fa-IR")} مورد
                </span>
            )}
        </div>
    );
}