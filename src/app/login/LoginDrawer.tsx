"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { requestOtpAction, verifyOtpAction } from "@/server/auth/actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import { getCartAction, mergeGuestCartAction } from "@/server/cart/actions";
import { useCartCountStore } from "@/store/cart-count-store";

type Step = "phone" | "otp";

export default function LoginDrawer() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("phone");

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(120);

    const [direction, setDirection] = useState(1);

    const toPhoneNumber = (value: string) => `0${value}`;

    const submitPhone = async () => {
        if (phone.length !== 10) return;

        setIsSubmitting(true);
        const result = await requestOtpAction({
            phoneNumber: toPhoneNumber(phone),
        });
        setIsSubmitting(false);

        // if (!result.success) {
        //     toast.error(result.error);
        //     return;
        // }

        // setDirection(1);
        // setStep("otp");
        // toast.success("کد تایید ارسال شد");

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setResendSeconds(120);
        setDirection(1);
        setStep("otp");
        toast.success("کد تایید ارسال شد");
    };

    useEffect(() => {
        if (resendSeconds <= 0) return;

        const timer = setInterval(() => {
            setResendSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendSeconds]);

    const goBackToPhone = () => {
        setDirection(-1);
        setOtp("");
        setStep("phone");
    };

    // const submitOtp = async () => {
    //     if (otp.length !== 6) return;

    //     setIsSubmitting(true);
    //     const result = await verifyOtpAction({ phoneNumber: toPhoneNumber(phone), code: otp });
    //     setIsSubmitting(false);

    //     if (!result.success) {
    //         toast.error(result.error);
    //         return;
    //     }

    //     // Merge guest cart AFTER login succeeds — separate action, not a
    //     // second argument to verifyOtpAction.
    //     const guestItems = useGuestCartStore.getState().items;
    //     if (guestItems.length > 0) {
    //         await mergeGuestCartAction({ items: guestItems });
    //     }

    //     useGuestCartStore.getState().clear();
    //     setOpen(false);
    //     router.push("/");
    //     router.refresh();
    // };

        const submitOtp = async () => {
        if (otp.length !== 6) return;

        setIsSubmitting(true);
        const result = await verifyOtpAction({ phoneNumber: toPhoneNumber(phone), code: otp });
        setIsSubmitting(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        // Merge guest cart AFTER login succeeds — separate action, not a
        // second argument to verifyOtpAction.
        const guestItems = useGuestCartStore.getState().items;
        if (guestItems.length > 0) {
            await mergeGuestCartAction({ items: guestItems });
        }

        useGuestCartStore.getState().clear();

        // Seed the cart-count badge with the real DB total right after
        // login (covers both a merged guest cart and a pre-existing DB
        // cart from a previous session) — this is trigger point #1,
        // "call getCartAction once when the user logs in and gets
        // redirected to the main root".
        const cartResult = await getCartAction();
        if (cartResult.success) {
            useCartCountStore.getState().setCount(cartResult.data.totalItems);
        }

        setOpen(false);
        router.push("/");
        router.refresh();
    };

    const resendCode = async () => {
        if (resendSeconds > 0) return;

        const result = await requestOtpAction({
            phoneNumber: toPhoneNumber(phone),
        });

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setResendSeconds(120);
        toast.success("کد مجدد ارسال شد");
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            // Reset when drawer closes
            setTimeout(() => {
                setStep("phone");
                setOtp("");
            }, 250);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 40 : -40,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -40 : 40,
            opacity: 0,
        }),
    };

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            {/* Bottom Login Section */}
            <div className="mt-auto w-full px-5 pb-7">
                <div className="mb-5 flex items-center gap-3">
                    <Image
                        src="/site/logo.jpg"
                        alt="درا بگز"
                        width={100}
                        height={100}
                        priority
                        className="size-24 shrink-0 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 text-right">
                        <h2 className="font-bold text-[#171717]">
                            به درا بگز خوش اومدی
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-black/45">
                            برای خرید اول وارد شو
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    className="h-14 w-full"
                >
                    ورود / ثبت‌نام
                    <ArrowLeft className="size-[18px]" />
                </Button>
            </div>

            {/* Drawer */}
            <DrawerContent
                dir="rtl"
                className="mx-auto w-full max-w-[500px]"
            >
                <div className="overflow-hidden px-5 pb-8">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={step}
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -8,
                            }}
                            transition={{
                                duration: 0.22,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <DrawerHeader className="px-0 pt-8 text-right">
                                <DrawerTitle className="text-[20px] font-bold">
                                    {step === "phone"
                                        ? "وارد حساب کاربری شو"
                                        : "کد تایید رو وارد کن"}
                                </DrawerTitle>

                                <DrawerDescription className="mt-1 text-[13px] leading-6">
                                    {step === "phone"
                                        ? "شماره موبایلت رو وارد کن تا ادامه بدیم"
                                        : `کد تایید ارسال شده به ${toPhoneNumber(phone)} رو وارد کن`}
                                </DrawerDescription>
                            </DrawerHeader>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence
                        mode="wait"
                        custom={direction}
                        initial={false}
                    >
                        {step === "phone" ? (
                            <motion.div
                                key="phone"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.28,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="mt-5"
                            >
                                <div className="relative">
                                    <div className="flex h-14 items-center overflow-hidden rounded-full bg-black/[0.045]">
                                        {/* Phone number */}
                                        <Input
                                            dir="ltr"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            placeholder="912 345 6789"
                                            value={phone}
                                            maxLength={10}
                                            // onChange={(e) => {
                                            //     const value = e.target.value.replace(/\D/g, "");
                                            //     setPhone(value);
                                            // }}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, "");

                                                if (value.startsWith("09")) {
                                                    value = value.slice(1);
                                                }

                                                setPhone(value);
                                            }}
                                            className="h-full border-0 bg-transparent px-4 text-[17px] tracking-wide shadow-none placeholder:text-black/25 focus-visible:ring-0"
                                        />

                                        {/* Country code */}
                                        <div
                                            dir="ltr"
                                            className="flex h-full shrink-0 items-center gap-1 border-r border-black/[0.08] px-4 text-[15px] text-black/45"
                                        >
                                            <span>🇮🇷</span>
                                            <span>+98</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={submitPhone}
                                    disabled={phone.length !== 10 || isSubmitting}
                                    className="mt-3 h-14 w-full"
                                >
                                    {isSubmitting ? "در حال ارسال..." : "ارسال کد تایید"}
                                    <ArrowLeft className="size-[18px]" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.28,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="mt-5"
                            >
                                <div
                                    dir="ltr"
                                    className="flex justify-center"
                                >
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={setOtp}
                                        inputMode="numeric"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <Button
                                    onClick={submitOtp}
                                    disabled={otp.length !== 6 || isSubmitting}
                                    className="mt-5 h-14 w-full"
                                >
                                    {isSubmitting ? "در حال بررسی..." : "تایید و ورود"}
                                    <ArrowLeft className="size-[18px]" />
                                </Button>

                                <div className="mt-4 flex items-center justify-between">
                                    {/* <Button
                                        variant="ghost"
                                        onClick={resendCode}
                                        className="px-2"
                                    >
                                        ارسال مجدد کد
                                    </Button> */}

                                    <Button
                                        variant="ghost"
                                        onClick={resendCode}
                                        disabled={resendSeconds > 0 || isSubmitting}
                                        className="px-2"
                                    >
                                        {resendSeconds > 0
                                            ? `ارسال مجدد کد (${Math.floor(resendSeconds / 60)}:${String(resendSeconds % 60).padStart(2, "0")})`
                                            : "ارسال مجدد کد"}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={goBackToPhone}
                                        className="px-2"
                                    >
                                        تغییر شماره
                                        <ArrowLeft className="size-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DrawerContent>
        </Drawer>
    );
}