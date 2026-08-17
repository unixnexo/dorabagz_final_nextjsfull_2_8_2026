"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            aria-label="بازگشت"
            className="fixed left-4 top-4 z-50 flex size-11 items-center justify-center rounded-full border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-90 active:bg-white/80"
        >
            <span className="pointer-events-none absolute inset-[1px] rounded-full border border-white/50" />
            <ArrowLeft className="size-[18px]" strokeWidth={2} />
        </button>
    );
}