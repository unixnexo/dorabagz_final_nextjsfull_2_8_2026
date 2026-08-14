"use client";

import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Home,
    RefreshCw,
    Headset,
    Copy,
    Check,
    ArrowLeft,
} from "lucide-react";

const iranSans = localFont({
    src: "../fonts/iransans.woff2",
    display: "swap",
});

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [errorId, setErrorId] = useState("");

    useEffect(() => {
        const id =
            error.digest ||
            Math.random().toString(36).substring(2, 10).toUpperCase();

        setErrorId(id);

        console.error("Global Error:", error);
    }, [error]);

    const copyErrorId = async () => {
        if (!errorId) return;

        await navigator.clipboard.writeText(errorId);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <main
            dir="rtl"
            className={`${iranSans.className} fixed inset-0 flex min-h-dvh items-center justify-center bg-[#f1f2f3] px-5`}
        >
            <div className="w-full max-w-[500px] text-center">
                {/* Baymax */}
                <div className="mx-auto mb-3 size-[190px]">
                    <img
                        src="/site/Baymax_GIF_2.gif"
                        alt="Baymax"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Text */}
                <div>
                    <h1 className="text-[21px] font-bold tracking-tight text-[#171717]">
                        یه چیزی درست پیش نرفت
                    </h1>

                    <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-7 text-black/50">
                        ظاهراً یه مشکلی پیش اومده و صفحه نتونست درست بارگذاری بشه.
                        نگران نباش، معمولاً با یه بار تلاش دوباره حل میشه.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#282E30] text-[14px] font-semibold text-white transition active:scale-[0.98]"
                    >
                        <RefreshCw className="size-[18px]" />
                        تلاش دوباره
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push("/")}
                            className="flex h-14 items-center justify-center gap-2 rounded-full bg-white text-[14px] font-semibold text-[#282E30] shadow-sm ring-1 ring-black/[0.06] transition active:scale-[0.98]"
                        >
                            <Home className="size-[18px]" />
                            صفحه اصلی
                        </button>

                        <button
                            onClick={() => router.back()}
                            className="flex h-14 items-center justify-center gap-2 rounded-full bg-white text-[14px] font-semibold text-[#282E30] shadow-sm ring-1 ring-black/[0.06] transition active:scale-[0.98]"
                        >
                            صفحه قبل
                            <ArrowLeft className="size-[18px]" />
                        </button>
                    </div>
                </div>

                {/* Error reference */}
                {errorId && (
                    <div className="mt-7 rounded-2xl bg-black/[0.035] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 text-right">
                                <p className="text-[11px] text-black/40">
                                    اگر خواستی با پشتیبانی تماس بگیری
                                </p>

                                <p className="mt-1 truncate font-mono text-[12px] font-medium text-black/55">
                                    کد خطا: {errorId}
                                </p>
                            </div>

                            <button
                                onClick={copyErrorId}
                                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black/50 shadow-sm ring-1 ring-black/[0.05] transition active:scale-95"
                                aria-label="کپی کد خطا"
                            >
                                {copied ? (
                                    <Check className="size-4 text-green-600" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Support */}
                <button
                    onClick={() => {
                        window.location.href =
                            "mailto:support@example.com?subject=گزارش خطا&body=کد خطا: " +
                            errorId;
                    }}
                    className="mx-auto mt-5 flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium text-black/50 transition hover:text-black/70 active:scale-[0.98]"
                >
                    <Headset className="size-[17px]" />
                    نیاز به کمک داری؟ با پشتیبانی در تماس باش
                </button>
            </div>
        </main>
    );
}