"use client";

import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

const iranSans = localFont({
    src: "../fonts/iransans.woff2",
    display: "swap",
});

export default function NotFound() {
    const router = useRouter();

    return (
        <main
            dir="rtl"
            className={`${iranSans.className} fixed inset-0 flex min-h-dvh items-center justify-center px-5`}
        >
            <div className="relative w-full max-w-[500px] text-center">
                {/* Disney */}
                <div className="mx-auto size-[190px] absolute bottom-[134px] left-1/2 transform -translate-x-1/2">
                    <img
                        src="/site/big_ Disney.gif"
                        alt="Disney"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Text */}
                <div>
                    <h1 className="text-[21px] font-bold tracking-tight text-[#171717]">
                        این صفحه پیدا نشد
                    </h1>

                    <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-7 text-black/50">
                        انگار چیزی که دنبالش می‌گردی اینجا نیست.
                        شاید آدرس اشتباه وارد شده یا این صفحه دیگه وجود نداره.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-7 grid grid-cols-2 gap-3">
                    {/* <button
                        onClick={() => router.push("/")}
                        className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#282E30] text-[14px] font-semibold text-white transition active:scale-[0.98]"
                    >
                        <Home className="size-[18px]" />
                        صفحه اصلی
                    </button> */}

                    <a
                        href="/"
                        className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#282E30] text-[14px] font-semibold text-white transition active:scale-[0.98]"
                    >
                        <Home className="size-[18px]" />
                        صفحه اصلی
                    </a>

                    <button
                        onClick={() => router.back()}
                        className="flex h-14 items-center justify-center gap-2 rounded-full bg-white text-[14px] font-semibold text-[#282E30] shadow-sm ring-1 ring-black/[0.06] transition active:scale-[0.98]"
                    >
                        صفحه قبل
                        <ArrowLeft className="size-[18px]" />
                    </button>
                </div>
            </div>
        </main>
    );
}