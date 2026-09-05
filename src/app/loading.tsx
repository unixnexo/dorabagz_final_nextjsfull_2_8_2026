"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <motion.main
            dir="rtl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-[2px]"
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative size-10"
            >
                <div className="absolute inset-0 rounded-full border-[3px] border-black/[0.08]" />

                <motion.div
                    className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#282E30]"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 0.8,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </motion.main>
    );
}
