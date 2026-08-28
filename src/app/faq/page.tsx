import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import { FAQAccordion } from "./faq-accordion";
import { FAQHeader } from "./faq-header";

export const metadata: Metadata = {
    title: "سوالات متداول",
    description:
        "پاسخ سوالات متداول درباره خرید از درا بگز، نحوه ثبت سفارش، ارسال، پرداخت، پیگیری سفارش و پشتیبانی.",
    alternates: {
        canonical: "/faq",
    },
    openGraph: {
        title: "سوالات متداول | درا بگز",
        description:
            "پاسخ سوالات متداول درباره خرید، ارسال، پرداخت، سفارش و پشتیبانی درا بگز.",
        url: "/faq",
        type: "website",
        locale: "fa_IR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-[#f5f5f5] px-4 py-5 pb-32 text-[#171717]">
            <div className="relative mx-auto w-full max-w-[500px]">
                <BackButton />

                <FAQHeader />

                <FAQAccordion />
            </div>
        </main>
    );
}