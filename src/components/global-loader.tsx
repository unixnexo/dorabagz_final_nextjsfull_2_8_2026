"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function GlobalLoader() {
    return (
        <main
            dir="rtl"
            className="fixed inset-0 z-[9999] bg-[#f1f2f3]"
        >
            <div className="mx-auto flex min-h-dvh w-full max-w-[500px] flex-col items-center justify-center px-6">
                <div className="size-[190px]">
                    <DotLottieReact
                        src="/lottie/Nonchalant_Baymax.lottie"
                        loop
                        autoplay
                    />
                </div>

                <div className="mt-2 text-center">
                    <h1 className="text-[17px] font-semibold text-[#171717]">
                        یه لحظه صبر کن...
                    </h1>

                    <p className="mt-1.5 text-[13px] text-black/45">
                        داریم همه‌ چیز رو آماده می‌کنیم
                    </p>
                </div>

                <div className="mt-6 h-1.5 w-24 overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-[#282E30]" />
                </div>
            </div>
        </main>
    );
}




