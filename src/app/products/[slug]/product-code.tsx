"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

/**
 * Tappable product code — copies to clipboard on tap. Feedback is a small
 * inline swap (code text -> checkmark + "کپی شد", tiny copy icon pulse),
 * NOT a toast, per request. Reverts back to showing the code after ~1.5s.
 */
export function ProductCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        if (copied) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard write failed (permissions/unsupported) — silently ignore,
            // no toast per request; button just doesn't confirm and can be
            // tapped again
        }
    }

    return (
        <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
        >
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1 text-primary"
                    >
                        <motion.span
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 600, damping: 15 }}
                        >
                            <Check className="h-3.5 w-3.5" />
                        </motion.span>
                        کپی شد
                    </motion.span>
                ) : (
                    <motion.span
                        key="code"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        کد محصول: {code}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}