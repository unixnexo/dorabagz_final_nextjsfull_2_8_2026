"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";


type BackButtonProps = {
    fixed?: boolean;
    href?: string;
    size?: "default" | "big";
    bgClass?: string;
};

export default function BackButton({
    fixed = true,
    href,
    size = "default",
    bgClass = "bg-brand-secondary",
}: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label="بازگشت"
            className={cn(
                "z-50 flex items-center justify-center rounded-2xl text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-90 active:bg-white/80",
                bgClass,
                size === "big" ? "size-14" : "size-11",
                fixed && "fixed left-4 top-4"
            )}
        >
            {/* <span className="pointer-events-none absolute inset-[1px] rounded-2xl border border-brand-secondary/50" /> */}
            <ArrowLeft
                className={size === "big" ? "size-[20px]" : "size-[18px]"}
                strokeWidth={2}
            />
        </button>
    );
}
