// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Drawer,
//     DrawerContent,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerDescription,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { ArrowLeft, Phone } from "lucide-react";
// import Image from "next/image";

// export default function LoginDrawer() {
//     const [open, setOpen] = useState(false);
//     const [phone, setPhone] = useState("");

//     const submit = () => {
//         console.log(phone);
//     };

//     return (
//         <Drawer open={open} onOpenChange={setOpen}>
//             {/* Bottom Login Section */}
//             <div className="mt-auto w-full px-5 pb-7">
//                 {/* Brand */}
//                 <div className="mb-5 flex items-center gap-3">
//                     <Image
//                         src="/site/logo.jpg"
//                         alt="درا بگز"
//                         width={100}
//                         height={100}
//                         priority
//                         className="size-24 shrink-0 rounded-2xl object-cover"
//                     />

//                     <div className="min-w-0 text-right">
//                         <h2 className="font-bold text-[#171717]">
//                             به درا بگز خوش اومدی
//                         </h2>

//                         <p className="mt-1 text-sm leading-5 text-black/45">
//                             برای خرید اول وارد شو
//                         </p>
//                     </div>
//                 </div>

//                 {/* Open Drawer */}
//                 <Button
//                     onClick={() => setOpen(true)}
//                     className="h-14 w-full rounded-full bg-[#282E30] text-[14px] font-semibold text-white transition active:scale-[0.98]"
//                 >
//                     ورود / ثبت‌نام
//                     <ArrowLeft className="size-[18px]" />
//                 </Button>
//             </div>

//             {/* Login Drawer */}
//             <DrawerContent
//                 dir="rtl"
//                 className="mx-auto w-full max-w-[500px] rounded-t-[28px] border-0 bg-[#f1f2f3] px-5 pb-8"
//             >
//                 <DrawerHeader className="px-0 pt-3 text-right">
//                     <DrawerTitle className="text-[20px] font-bold text-[#171717]">
//                         وارد حساب کاربری شو
//                     </DrawerTitle>

//                     <DrawerDescription className="mt-1 text-[13px] leading-6 text-black/45">
//                         شماره موبایلت رو وارد کن تا ادامه بدیم
//                     </DrawerDescription>
//                 </DrawerHeader>

//                 <div className="mt-5 space-y-3">
//                     {/* Phone Input */}
//                     <div className="relative">
//                         <Phone className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-black/35" />

//                         <Input
//                             dir="ltr"
//                             type="tel"
//                             inputMode="numeric"
//                             autoComplete="tel"
//                             placeholder="0912 345 6789"
//                             value={phone}
//                             onChange={(e) => setPhone(e.target.value)}
//                             className="h-14 rounded-2xl border-0 bg-white pr-11 text-[15px] shadow-sm ring-1 ring-black/[0.05] placeholder:text-black/25 focus-visible:ring-2 focus-visible:ring-black/10"
//                         />
//                     </div>

//                     {/* Submit */}
//                     <Button
//                         onClick={submit}
//                         disabled={!phone.trim()}
//                         className="h-14 w-full rounded-2xl bg-[#282E30] text-[14px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
//                     >
//                         ادامه
//                         <ArrowLeft className="size-[18px]" />
//                     </Button>
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     );
// }





"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";

type Step = "phone" | "otp";

export default function LoginDrawer() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("phone");

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [direction, setDirection] = useState(1);

    const submitPhone = () => {
        if (phone.length !== 11) return;

        setDirection(1);
        setStep("otp");

        // Send verification code here
        console.log("Send code to:", phone);
    };

    const goBackToPhone = () => {
        setDirection(-1);
        setOtp("");
        setStep("phone");
    };

    const submitOtp = () => {
        if (otp.length !== 6) return;

        // Verify OTP here
        console.log("Verify:", {
            phone,
            otp,
        });
    };

    const resendCode = () => {
        // Resend verification code here
        console.log("Resend code to:", phone);
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
                                        : `کد تایید ارسال شده به ${phone} رو وارد کن`}
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
                                {/* <div className="relative">
                                    <Input
                                        dir="ltr"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        placeholder="0912 345 6789"
                                        value={phone}
                                        maxLength={11}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                );

                                            setPhone(value);
                                        }}
                                        className="pl-11"
                                    />

                                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                </div> */}

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
                                            maxLength={11}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
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
                                    disabled={phone.length !== 11}
                                    className="mt-3 h-14 w-full"
                                >
                                    ارسال کد تایید
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
                                    disabled={otp.length !== 6}
                                    className="mt-5 h-14 w-full"
                                >
                                    تایید و ورود
                                    <ArrowLeft className="size-[18px]" />
                                </Button>

                                <div className="mt-4 flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={resendCode}
                                        className="px-2"
                                    >
                                        ارسال مجدد کد
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

