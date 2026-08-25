"use client";

import { motion } from "framer-motion";

import BackButton from "@/components/BackButton";
import { FAQAccordion } from "./faq-accordion";
import { SearchCommand } from "@/components/search-command";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {

    const [searchOpen, setSearchOpen] = useState(false);
    
    return (
        <main
            className="min-h-screen bg-[#f5f5f5] px-4 py-5 text-[#171717] pb-32"
        >
            <div className="relative mx-auto w-full max-w-[500px]">
                {/* Back */}
                <BackButton />

                {/* Header */}
                <motion.section
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                    }}
                    className="flex flex-col items-center pt-1"
                >
                    <h1 className="text-[30px] font-semibold tracking-[-0.03em]">
                        سوالات متداول
                    </h1>

                    <p className="mt-2 text-center text-[13px] text-black/55">
                        سوالی دارید؟ جوابش را اینجا پیدا کنید.
                    </p>

                    <motion.button
                        whileTap={{ scale: 0.94 }}
                        className="flex items-center gap-1 mt-3.5 h-9 rounded-full bg-black px-4 text-[11px] font-medium text-white shadow-sm transition-transform"
                    >
                        تماس با پشتیبانی
                        <ArrowLeft size={12} />
                    </motion.button>
                </motion.section>

                {/* FAQ */}
                <FAQAccordion />
            </div>

            {/* <SearchCommand
                open={searchOpen}
                onOpenChange={setSearchOpen}
            />

            <BottomNav
                searchOpen={searchOpen}
                onSearchClick={() => setSearchOpen(true)}
            /> */}
        </main>
    );
}