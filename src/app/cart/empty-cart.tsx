"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[22px] bg-white">
                    <span className="text-[27px]">🛍</span>
                </div>

                <h2 className="text-[17px] font-semibold">سبد خرید خالی است</h2>

                <p className="mt-1 text-[13px] leading-6 text-black/45">
                    محصولاتی که انتخاب می‌کنی
                    <br />
                    اینجا نمایش داده می‌شوند
                </p>

                <Button asChild className="mt-5 h-11 rounded-full px-6">
                    <Link href="/">مشاهده محصولات</Link>
                </Button>
            </div>
        </div>
    );
}