export function AdminSectionHeading({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-1 flex items-baseline justify-between px-1">
            <h2 className="text-[15px] font-bold text-[#1C1C1E]">{title}</h2>
            {subtitle && (
                <span className="text-[11.5px] text-[#8E8E93]">{subtitle}</span>
            )}
        </div>
    );
}