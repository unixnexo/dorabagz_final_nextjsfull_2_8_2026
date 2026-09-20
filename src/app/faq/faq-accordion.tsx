"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        id: "item-1",
        question: "چطور می‌توانم از فروشگاه خرید کنم؟",
        answer:
            "محصول مورد نظر خود را انتخاب کنید، رنگ و سایز را مشخص کنید و سپس آن را به سبد خرید اضافه کنید. بعد از تکمیل اطلاعات، سفارش خود را ثبت و پرداخت کنید.",
    },
    {
        id: "item-2",
        question: "آیا امکان لغو سفارش وجود دارد؟",
        answer:
            "بله. تا زمانی که سفارش شما وارد مرحله ارسال نشده باشد، می‌توانید برای لغو آن با پشتیبانی تماس بگیرید.",
    },
    {
        id: "item-3",
        question: "سفارش من چه زمانی به دستم می‌رسد؟",
        answer:
            "سفارش‌ها معمولاً بین ۲ تا ۵ روز کاری به دست شما می‌رسند. زمان دقیق ارسال هنگام ثبت سفارش نمایش داده می‌شود.",
    },
    {
        id: "item-4",
        question: "آیا می‌توانم سایز یا رنگ محصول را انتخاب کنم؟",
        answer:
            "بله. محصولاتی که دارای تنوع باشند، گزینه‌های مربوط به سایز و رنگ را در صفحه محصول نمایش می‌دهند.",
    },
    {
        id: "item-5",
        question: "اگر سایز محصول مناسب نباشد، امکان تعویض وجود دارد؟",
        answer:
            "بله، در صورت رعایت شرایط تعویض، می‌توانید محصول را برای تعویض سایز ارسال کنید. شرایط کامل در بخش قوانین فروشگاه قرار دارد.",
    },
    {
        id: "item-6",
        question: "هزینه ارسال چقدر است؟",
        answer:
            "هزینه ارسال بر اساس روش ارسال و مقصد محاسبه می‌شود و قبل از پرداخت نهایی به شما نمایش داده خواهد شد.",
    },
    {
        id: "item-7",
        question: "آیا محصولات ضمانت اصالت دارند؟",
        answer:
            "تمام محصولاتی که در فروشگاه عرضه می‌شوند با مشخصات درج‌شده در صفحه محصول ارائه می‌شوند و اطلاعات مربوط به برند و اصالت در صورت وجود نمایش داده خواهد شد.",
    },
    {
        id: "item-8",
        question: "چطور می‌توانم وضعیت سفارش خود را ببینم؟",
        answer:
            "از بخش سفارش‌های من می‌توانید وضعیت سفارش، مراحل ارسال و اطلاعات مربوط به مرسوله خود را مشاهده کنید.",
    },
];

export function FAQAccordion() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
                delay: 0.08,
            }}
            className="mx-auto mt-8 w-full"
        >
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-1"
            >
                {faqs.map((faq, index) => (
                    <motion.div
                        key={faq.id}
                        initial={{
                            opacity: 0,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 30,
                            delay: 0.1 + index * 0.025,
                        }}
                    >
                        <AccordionItem
                            value={faq.id}
                            className="overflow-hidden rounded-[11px] border-0 bg-brand-secondary px-3.5 data-[state=open]:rounded-[11px]"
                        >
                            <AccordionTrigger
                                className="
                                    min-h-[54px]
                                    py-2.5
                                    text-right
                                    font-normal
                                    leading-5
                                    no-underline
                                    hover:no-underline
                                    [&>svg]:size-3
                                    [&>svg]:shrink-0
                                    [&>svg]:text-black/50
                                "
                            >
                                <span className="pl-2">
                                    {faq.question}
                                </span>
                            </AccordionTrigger>

                            <AccordionContent
                                className="
                                    pb-3
                                    pt-0
                                    leading-[1.9]
                                    text-black/60
                                "
                            >
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    </motion.div>
                ))}
            </Accordion>
        </motion.section>
    );
}