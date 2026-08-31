"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
    onAddToCart,
    disabled,
    outOfStock,
}: {
    onAddToCart: () => Promise<boolean>;
    disabled?: boolean;
    outOfStock?: boolean;
}) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">(
        "idle",
    );
    const [burstKey, setBurstKey] = useState(0);

    useEffect(() => {
        if (status !== "success") return;

        const timeout = setTimeout(() => {
            setStatus("idle");
        }, 2200);

        return () => clearTimeout(timeout);
    }, [status]);

    async function handleClick() {
        if (status !== "idle" || disabled || outOfStock) return;

        setStatus("loading");

        try {
            const succeeded = await onAddToCart();

            if (succeeded) {
                setBurstKey((key) => key + 1);
                setStatus("success");
            } else {
                setStatus("idle");
            }
        } catch {
            setStatus("idle");
        }
    }

    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isActive = isLoading || isSuccess;

    return (
        <div className="relative w-full">
            {/* =====================================================
                LARGE AMBIENT GLOW
            ====================================================== */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        key={`ambient-${status}-${burstKey}`}
                        initial={{
                            opacity: 0,
                            scale: 0.92,
                        }}
                        animate={{
                            opacity: isSuccess
                                ? [0.15, 0.5, 0.3]
                                : [0.2, 0.35, 0.2],
                            scale: isSuccess
                                ? [0.96, 1.08, 1.02]
                                : [0.97, 1.03, 1],
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        transition={{
                            duration: isSuccess ? 1.5 : 0.8,
                            ease: "easeOut",
                        }}
                        className="
                            pointer-events-none
                            absolute
                            -inset-4
                            rounded-full
                            bg-gradient-to-r
                            from-black/60
                            via-blue-600/40
                            to-blue-400/50
                            blur-2xl
                        "
                    />
                )}
            </AnimatePresence>

            {/* =====================================================
                BUTTON MOVEMENT / SUCCESS IMPACT
            ====================================================== */}
            <motion.div
                animate={
                    isSuccess
                        ? {
                              scale: [1, 1.015, 1.05, 1.015, 1],
                              y: [0, -1, -4, 1, 0],
                          }
                        : isLoading
                          ? {
                                scale: [1, 1.012, 1],
                            }
                          : {
                                scale: 1,
                            }
                }
                transition={
                    isSuccess
                        ? {
                              duration: 1.35,
                              times: [0, 0.18, 0.4, 0.72, 1],
                              ease: [0.16, 1, 0.3, 1],
                          }
                        : {
                              duration: 0.45,
                              ease: "easeOut",
                          }
                }
                className="relative z-10 w-full"
            >
                <Button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || outOfStock}
                    className={`
                        relative
                        h-14
                        w-full
                        overflow-hidden
                        rounded-full

                        ${
                            isActive
                                ? `
                                    !border-0
                                    !bg-transparent
                                    !text-white
                                    !opacity-100
                                    shadow-xl
                                    shadow-blue-600/25
                                    disabled:!opacity-100
                                    disabled:pointer-events-auto
                                `
                                : ""
                        }

                        ${
                            isSuccess
                                ? `
                                    shadow-2xl
                                    shadow-blue-500/35
                                `
                                : ""
                        }
                    `}
                >
                    {/* =================================================
                        SUCCESS / LOADING BACKGROUND
                        ONLY APPEARS AFTER CLICK
                    ================================================== */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                key={`background-${burstKey}`}
                                initial={{
                                    opacity: 0,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    z-0
                                    overflow-hidden
                                    rounded-full
                                    bg-gradient-to-r
                                    from-black
                                    via-slate-900
                                    to-blue-600
                                "
                            >
                                {/* =========================================
                                    SLOW PREMIUM LIGHT SWEEP
                                ========================================== */}
                                <motion.div
                                    className="
                                        absolute
                                        inset-y-[-100%]
                                        left-[-45%]
                                        w-[30%]
                                        rotate-[18deg]
                                        bg-gradient-to-r
                                        from-transparent
                                        via-white/45
                                        to-transparent
                                        blur-md
                                    "
                                    animate={{
                                        left: ["-45%", "145%"],
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatDelay: 0.4,
                                    }}
                                />

                                {/* =========================================
                                    SECOND SOFTER SWEEP
                                ========================================== */}
                                <motion.div
                                    className="
                                        absolute
                                        inset-y-0
                                        left-0
                                        w-full
                                        bg-gradient-to-r
                                        from-transparent
                                        via-blue-400/10
                                        to-transparent
                                    "
                                    animate={{
                                        opacity: [0.2, 0.65, 0.2],
                                    }}
                                    transition={{
                                        duration: 1.7,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />

                                {/* =========================================
                                    TOP HIGHLIGHT
                                ========================================== */}
                                <motion.div
                                    className="
                                        absolute
                                        inset-x-0
                                        top-0
                                        h-[50%]
                                        bg-gradient-to-b
                                        from-white/15
                                        to-transparent
                                    "
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />

                                {/* =========================================
                                    BLUE CORE GLOW
                                ========================================== */}
                                <motion.div
                                    className="
                                        absolute
                                        -right-10
                                        top-1/2
                                        size-20
                                        -translate-y-1/2
                                        rounded-full
                                        bg-blue-400/30
                                        blur-2xl
                                    "
                                    animate={{
                                        x: [-10, 10, -10],
                                        opacity: [0.3, 0.55, 0.3],
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                    }}
                                />

                                {/* =========================================
                                    BOTTOM DEPTH
                                ========================================== */}
                                <div
                                    className="
                                        absolute
                                        inset-x-0
                                        bottom-0
                                        h-[45%]
                                        bg-gradient-to-t
                                        from-black/30
                                        to-transparent
                                    "
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* =====================================================
                        SUCCESS WHITE FLASH

                        z-10 = behind content
                    ====================================================== */}
                    <AnimatePresence>
                        {isSuccess && (
                            <>
                                <motion.div
                                    key={`flash-${burstKey}`}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.3,
                                    }}
                                    animate={{
                                        opacity: [0, 0.35, 0],
                                        scale: [0.3, 1.15, 2],
                                    }}
                                    transition={{
                                        duration: 1.15,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        z-10
                                        rounded-full
                                        bg-white
                                        blur-2xl
                                    "
                                />

                                <motion.div
                                    key={`ring-${burstKey}`}
                                    initial={{
                                        opacity: 0.8,
                                        scale: 0.72,
                                    }}
                                    animate={{
                                        opacity: 0,
                                        scale: 1.7,
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        z-10
                                        rounded-full
                                        border-2
                                        border-white/60
                                    "
                                />
                            </>
                        )}
                    </AnimatePresence>

                    {/* =====================================================
                        CONTENT

                        z-[50] GUARANTEES THE TEXT IS ALWAYS ABOVE
                        EVERY BACKGROUND / SHINE / FLASH.
                    ====================================================== */}
                    <div className="relative z-[50] flex h-full w-full items-center justify-center">
                        <AnimatePresence mode="wait" initial={false}>
                            {outOfStock ? (
                                <motion.span
                                    key="out"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    className="
                                        text-base
                                        font-semibold
                                    "
                                >
                                    ناموجود
                                </motion.span>
                            ) : isSuccess ? (
                                <motion.span
                                    key="success"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.35,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: [0.35, 1.25, 0.94, 1.06, 1],
                                    }}
                                    transition={{
                                        duration: 1.05,
                                        times: [0, 0.25, 0.5, 0.76, 1],
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        text-base
                                        font-bold
                                        !text-white
                                    "
                                >
                                    <motion.span
                                        initial={{
                                            scale: 0,
                                            rotate: -180,
                                        }}
                                        animate={{
                                            scale: [0, 1.5, 0.9, 1.08, 1],
                                            rotate: [-180, 18, -6, 2, 0],
                                        }}
                                        transition={{
                                            duration: 1,
                                            times: [0, 0.25, 0.5, 0.76, 1],
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        <Check
                                            className="h-5 w-5"
                                            strokeWidth={3.5}
                                        />
                                    </motion.span>

                                    <motion.span
                                        initial={{
                                            opacity: 0,
                                            x: -14,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.15,
                                            ease: "easeOut",
                                        }}
                                    >
                                        اضافه شد
                                    </motion.span>
                                </motion.span>
                            ) : isLoading ? (
                                <motion.span
                                    key="loading"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.75,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: [0.75, 1.08, 1],
                                    }}
                                    transition={{
                                        duration: 0.55,
                                        ease: "easeOut",
                                    }}
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        text-base
                                        font-semibold
                                        !text-white
                                    "
                                >
                                    <motion.span
                                        animate={{
                                            rotate: 360,
                                            scale: [1, 1.12, 1],
                                        }}
                                        transition={{
                                            rotate: {
                                                repeat: Infinity,
                                                duration: 0.8,
                                                ease: "linear",
                                            },
                                            scale: {
                                                repeat: Infinity,
                                                duration: 0.8,
                                                ease: "easeInOut",
                                            },
                                        }}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </motion.span>

                                    <span>در حال افزودن...</span>
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="idle"
                                    initial={{
                                        opacity: 0,
                                        y: 5,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className="
                                        text-base
                                        font-semibold
                                    "
                                >
                                    افزودن به سبد خرید
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </Button>
            </motion.div>

            {/* =========================================================
                SUCCESS PARTICLES
            ========================================================== */}
            <AnimatePresence>
                {isSuccess && (
                    <div
                        key={`particles-${burstKey}`}
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-[60]
                            flex
                            items-center
                            justify-center
                        "
                    >
                        {PARTICLES.map((particle, index) => (
                            <motion.span
                                key={index}
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    x: 0,
                                    y: 0,
                                }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    scale: [0, 1.5, 0.8, 0],
                                    x: particle.x,
                                    y: particle.y,
                                    rotate: particle.rotate,
                                }}
                                transition={{
                                    duration: 1.35,
                                    delay: particle.delay,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="absolute"
                            >
                                <Plus
                                    className="h-3 w-3 text-blue-400"
                                    strokeWidth={3}
                                />
                            </motion.span>
                        ))}

                        {DOTS.map((dot, index) => (
                            <motion.span
                                key={`dot-${index}`}
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                    x: dot.x,
                                    y: dot.y,
                                }}
                                transition={{
                                    duration: 1.15,
                                    delay: dot.delay,
                                    ease: "easeOut",
                                }}
                                className="
                                    absolute
                                    size-1.5
                                    rounded-full
                                    bg-blue-400
                                "
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const PARTICLES = [
    { x: 80, y: -20, rotate: 25, delay: 0 },
    { x: 65, y: -38, rotate: -20, delay: 0.05 },
    { x: 45, y: -18, rotate: 45, delay: 0.1 },

    { x: -80, y: -20, rotate: -25, delay: 0.03 },
    { x: -65, y: -38, rotate: 20, delay: 0.07 },
    { x: -45, y: -18, rotate: -45, delay: 0.11 },

    { x: 85, y: 20, rotate: -25, delay: 0.05 },
    { x: 65, y: 35, rotate: 20, delay: 0.09 },

    { x: -85, y: 20, rotate: 25, delay: 0.06 },
    { x: -65, y: 35, rotate: -20, delay: 0.1 },

    { x: 0, y: -42, rotate: 0, delay: 0.04 },
    { x: 0, y: 42, rotate: 0, delay: 0.08 },
];

const DOTS = [
    { x: 95, y: -10, delay: 0.05 },
    { x: 82, y: 30, delay: 0.1 },
    { x: -95, y: -10, delay: 0.07 },
    { x: -82, y: 30, delay: 0.12 },
    { x: 30, y: -45, delay: 0.06 },
    { x: -30, y: -45, delay: 0.09 },
];