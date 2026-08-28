// "use client";

// import {
//     Copy,
//     Check,
//     Phone,
//     // Instagram,
//     Send,
//     // Github,
//     Mail,
//     Headphones,
//     Store,
// } from "lucide-react";
// import { useState } from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import BackButton from "@/components/BackButton";

// type ContactItemProps = {
//     icon: React.ReactNode;
//     label: string;
//     value: string;
//     href?: string;
//     copyValue?: string;
// };

// function ContactItem({
//     icon,
//     label,
//     value,
//     href,
//     copyValue,
// }: ContactItemProps) {
//     const [copied, setCopied] = useState(false);

//     const handleCopy = async () => {
//         if (!copyValue) return;

//         await navigator.clipboard.writeText(copyValue);
//         setCopied(true);

//         setTimeout(() => {
//             setCopied(false);
//         }, 1500);
//     };

//     const content = (
//         <div className="flex items-center gap-4">
//             <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
//                 {icon}
//             </div>

//             <div className="min-w-0 flex-1 text-right">
//                 <p className="text-xs font-medium text-muted-foreground">
//                     {label}
//                 </p>

//                 <p
//                     dir="ltr"
//                     className="mt-1 truncate text-sm font-medium text-foreground"
//                 >
//                     {value}
//                 </p>
//             </div>

//             {copyValue && (
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     className="size-9 shrink-0 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
//                     onClick={handleCopy}
//                     type="button"
//                     aria-label="کپی"
//                 >
//                     {copied ? (
//                         <Check className="size-4" />
//                     ) : (
//                         <Copy className="size-4" />
//                     )}
//                 </Button>
//             )}
//         </div>
//     );

//     if (href) {
//         return (
//             <a
//                 href={href}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="block rounded-2xl p-2 transition-colors hover:bg-muted/60"
//             >
//                 {content}
//             </a>
//         );
//     }

//     return <div className="rounded-2xl p-2">{content}</div>;
// }

// function ContactSection({
//     icon,
//     title,
//     description,
//     children,
// }: {
//     icon: React.ReactNode;
//     title: string;
//     description: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <Card className="overflow-hidden rounded-[28px] border-border/60 bg-card shadow-sm">
//             <CardContent className="p-5 sm:p-6">
//                 <div className="mb-5 flex items-start gap-4">
//                     <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
//                         {icon}
//                     </div>

//                     <div>
//                         <h2 className="text-lg font-semibold tracking-tight">
//                             {title}
//                         </h2>

//                         <p className="mt-1 text-sm leading-6 text-muted-foreground">
//                             {description}
//                         </p>
//                     </div>
//                 </div>

//                 <Separator className="mb-3" />

//                 <div className="space-y-1">{children}</div>
//             </CardContent>
//         </Card>
//     );
// }

// export default function ContactPage() {
//     return (
//         <main
//             dir="rtl"
//             className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 sm:py-12"
//         >
//             <BackButton />
//             <div className="mx-auto w-full max-w-2xl">
//                 {/* Header */}
//                 <header className="mb-8 text-center">
//                     <div className="mx-auto mb-5 flex size-20 items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-border/50">
//                         <Image
//                             src="/site/logo.jpg"
//                             alt="لوگوی فروشگاه"
//                             width={80}
//                             height={80}
//                             className="size-full object-cover"
//                             priority
//                         />
//                     </div>

//                     <p className="mb-3 text-sm font-medium text-muted-foreground">
//                         ارتباط با ما
//                     </p>

//                     <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//                         در کنارتان هستیم
//                     </h1>

//                     <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
//                         برای ارتباط با مدیریت فروشگاه، پیگیری سفارش‌ها یا دریافت
//                         پشتیبانی فنی می‌توانید از راه‌های ارتباطی زیر با ما در تماس
//                         باشید.
//                     </p>
//                 </header>

//                 <div className="space-y-4">
//                     {/* Shop / Owner */}
//                     <ContactSection
//                         icon={<Store className="size-5" />}
//                         title="ارتباط با فروشگاه"
//                         description="برای سفارش، خرید و ارتباط مستقیم با مدیریت فروشگاه"
//                     >
//                         <ContactItem
//                             icon={<Phone className="size-5" />}
//                             label="شماره تماس"
//                             value="0917 454 1027"
//                             copyValue="09174541027"
//                             href="tel:+989174541027"
//                         />

//                         <ContactItem
//                             icon={<Phone className="size-5" />}
//                             label="اینستاگرام"
//                             value="@dora.bagz"
//                             href="https://instagram.com/dora.bagz"
//                         />

//                         <ContactItem
//                             icon={<Send className="size-5" />}
//                             label="تلگرام"
//                             value="@dorabagz"
//                             href="https://t.me/dorabagz"
//                         />
//                     </ContactSection>

//                     {/* Support */}
//                     <ContactSection
//                         icon={<Headphones className="size-5" />}
//                         title="پشتیبانی و توسعه وب‌سایت"
//                         description="مشکلات فنی، گزارش خطا یا اگر برای کسب‌وکار خود وب‌سایت می‌خواهید"
//                     >
//                         <ContactItem
//                             icon={<Phone className="size-5" />}
//                             label="شماره تماس"
//                             value="0938 834 2027"
//                             copyValue="09388342027"
//                             href="tel:+989388342027"
//                         />

//                         <ContactItem
//                             icon={<Send className="size-5" />}
//                             label="تلگرام"
//                             value="@unixnexo"
//                             href="https://t.me/unixnexo"
//                         />

//                         <ContactItem
//                             icon={<Phone className="size-5" />}
//                             label="گیت‌هاب"
//                             value="github.com/unixnexo"
//                             href="https://github.com/unixnexo"
//                         />

//                     </ContactSection>
//                 </div>

//                 {/* Footer */}
//                 <p className="mt-8 text-center text-xs text-muted-foreground">
//                     معمولاً در سریع‌ترین زمان ممکن پاسخگوی شما هستیم.
//                 </p>
//             </div>
//         </main>
//     );
// }









import type { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
    title: "تماس با پشتیبانی",
    description:
        "راه‌های ارتباط با پشتیبانی درا بگز برای پیگیری سفارش، خرید، سوالات و دریافت پشتیبانی.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "تماس با پشتیبانی | درا بگز",
        description:
            "راه‌های ارتباط با پشتیبانی درا بگز برای پیگیری سفارش، خرید و دریافت پاسخ سوالات شما.",
        url: "/contact",
        type: "website",
        locale: "fa_IR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactPage() {
    return (
        <main
            dir="rtl"
            className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 sm:py-12"
        >
            <ContactContent />
        </main>
    );
}
