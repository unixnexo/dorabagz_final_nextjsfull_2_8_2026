"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function FAQHeader() {
    return (
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

            <Link href="/contact">
                <motion.button
                    whileTap={{ scale: 0.94 }}
                    className="mt-3.5 flex h-9 items-center gap-1 rounded-full bg-brand-primary px-4 text-[11px] font-medium text-white shadow-sm transition-transform"
                >
                    تماس با پشتیبانی
                    <ArrowLeft size={12} />
                </motion.button>
            </Link>
        </motion.section>
    );
}