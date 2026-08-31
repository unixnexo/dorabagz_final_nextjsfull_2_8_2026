"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Wraps the intercepted product page in an Apple-Store-style overlay:
 *  - mounts already "open" (Next.js only renders this tree once the route
 *    has matched, so there's no separate open/close-on-mount step)
 *  - the whole card animates in with layout continuity via the
 *    `product-image-{slug}` layoutId shared with ProductCard on "/" —
 *    Framer Motion morphs the image's position/size automatically since
 *    both elements exist in the same tree at the moment of navigation
 *  - back button (or backdrop tap) plays a reverse scale-down, and only
 *    calls router.back() once that animation finishes — so the user
 *    never sees an abrupt cut before the shrink completes
 *
 * NOTE: this only intercepts client-side <Link> navigation that originates
 * from "/" (same segment level as the @modal slot). Direct visits and
 * refreshes render the real /products/[slug]/page.tsx instead.
 */
export function OverlayShell({ slug, children }: { slug: string; children: React.ReactNode }) {
    const router = useRouter();
    const [isClosing, setIsClosing] = useState(false);

    // lock background scroll while the overlay is open
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    function handleClose() {
        setIsClosing(true);
    }

    return (
        <AnimatePresence
            onExitComplete={() => {
                router.back();
            }}
        >
            {!isClosing && (
                <motion.div
                    key={`overlay-${slug}`}
                    className="fixed inset-0 z-50 overflow-y-auto bg-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* backdrop tap-to-close (harmless once content fills the screen,
             but useful on wider viewports / as a general affordance) */}
                    <motion.div className="absolute inset-0 -z-10 bg-black/40" onClick={handleClose} />

                    <motion.div
                        layoutId={`product-card-${slug}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative min-h-screen bg-background"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-xl"
                            aria-label="بستن"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}