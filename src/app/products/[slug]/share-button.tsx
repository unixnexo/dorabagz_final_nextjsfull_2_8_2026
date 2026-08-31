"use client";

import { motion } from "framer-motion";
import { Share } from "lucide-react";
import toast from "react-hot-toast";

/**
 * iOS-style native share button — uses the Web Share API (navigator.share)
 * to open the platform's native share sheet. Supported on iOS Safari,
 * Android Chrome, and most mobile browsers; NOT supported on most desktop
 * browsers (notably desktop Firefox, older desktop Safari/Chrome).
 *
 * Fallback for unsupported browsers: copies the page URL to clipboard and
 * shows a toast, so the button always does *something* useful instead of
 * silently failing.
 */
export function ShareButton({ title, url }: { title: string; url: string }) {
    async function handleShare() {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // user cancelled the native share sheet — not an error, do nothing
            }
            return;
        }

        // fallback: no Web Share API support
        try {
            await navigator.clipboard.writeText(url);
            toast.success("لینک محصول کپی شد.");
        } catch {
            toast.error("اشتراک‌گذاری پشتیبانی نمی‌شود.");
        }
    }

    return (
        <motion.button
            type="button"
            onClick={handleShare}
            whileTap={{ scale: 0.85 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm"
            aria-label="اشتراک‌گذاری"
        >
            <Share className="h-4 w-4" />
        </motion.button>
    );
}