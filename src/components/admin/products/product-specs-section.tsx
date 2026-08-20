import type { ProductSpecificationDTO } from "@/types/product";

export function ProductSpecsSection({
    specifications,
}: {
    specifications: ProductSpecificationDTO[];
}) {
    if (specifications.length === 0) return null;

    const sorted = [...specifications].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="mb-3 text-[12.5px] font-semibold text-[#1C1C1E]">مشخصات فنی</p>
            <div className="divide-y divide-black/[0.05]">
                {sorted.map((spec) => (
                    <div key={spec.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                        <span className="text-[12.5px] text-[#8E8E93]">{spec.key}</span>
                        <span className="text-[12.5px] font-medium text-[#1C1C1E]">{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}