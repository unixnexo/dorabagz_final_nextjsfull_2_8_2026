import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminFabLink({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A7D5C] shadow-[0_8px_20px_-8px_rgba(10,125,92,0.6)] active:scale-95 transition-transform"
        >
            <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </Link>
    );
}