import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ProductFormHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 pt-4">
            <Link
                href="/admin/products"
                aria-label="بازگشت به محصولات"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08]"
            >
                <ChevronRight className="h-4.5 w-4.5 text-[#1C1C1E]" strokeWidth={2.25} />
            </Link>
            <h1 className="text-[17px] font-bold text-[#1C1C1E]">{title}</h1>
        </div>
    );
}