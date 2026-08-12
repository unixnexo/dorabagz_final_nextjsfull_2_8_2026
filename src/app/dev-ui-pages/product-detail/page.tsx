// // product detail page

"use client";

import { useState } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const images = [
  "/site/1.jpg",
  "/site/2.jpg",
  "/site/3.jpg",
  "/site/4.jpg",
];

export default function Page() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const openGallery = () => {
    setActiveImage(0);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div
        className="relative h-[420px] w-full overflow-hidden cursor-pointer"
        onClick={openGallery}
      >
        <Image
          src={images[0]}
          alt="محصول"
          fill
          priority
          className="object-cover transition-transform duration-500 active:scale-[0.98]"
        />

        {/* Fade out bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/70 to-background" />

        {/* Back button */}
        <div
          className="absolute left-4 top-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-xl shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Swipe hint */}
        <div className="pointer-events-none absolute bottom-0 -right-3 z-10">
          <div className="size-24 rounded-full">
            <DotLottieReact
              src="/lottie/Hand_Swipe.lottie"
              loop
              autoplay
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Image count */}
        {/* <div className="pointer-events-none absolute bottom-7 left-5 rounded-full bg-background/75 px-3 py-1.5 text-xs font-medium backdrop-blur-xl">
          ۱ / {images.length}
        </div> */}
      </div>

      {/* Content */}
      <div className="-mt-10 relative z-10 rounded-t-[28px] px-5 pt-6 pb-8 space-y-6">

        {/* Title & Price */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            کفش اسپرت مردانه مدل جدید
          </h1>

          <p className="text-2xl font-extrabold text-primary">
            ۲,۴۹۰,۰۰۰ تومان
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-row gap-3">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب رنگ" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>رنگ</SelectLabel>
                <SelectItem value="black">مشکی</SelectItem>
                <SelectItem value="white">سفید</SelectItem>
                <SelectItem value="blue">آبی</SelectItem>
                <SelectItem value="green">سبز</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب سایز" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>سایز</SelectLabel>
                <SelectItem value="40">۴۰</SelectItem>
                <SelectItem value="41">۴۱</SelectItem>
                <SelectItem value="42">۴۲</SelectItem>
                <SelectItem value="43">۴۳</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description" className="border-b">
            <AccordionTrigger className="text-base hover:no-underline">
              توضیحات محصول
            </AccordionTrigger>

            <AccordionContent>
              <p className="text-sm leading-7 text-muted-foreground">
                این کفش اسپرت با طراحی مدرن و راحتی بالا برای استفاده روزمره
                و فعالیت‌های سبک ورزشی مناسب است. رویه تنفس‌پذیر، زیره مقاوم
                و وزن سبک آن باعث می‌شود در طول روز احساس راحتی داشته باشید.
                انتخابی ایده‌آل برای استایل کژوال و استفاده طولانی‌مدت.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Specifications */}
          <AccordionItem value="specifications" className="border-b-0">
            <AccordionTrigger className="text-base hover:no-underline">
              مشخصات محصول
            </AccordionTrigger>

            <AccordionContent>
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm">
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-muted-foreground">جنس</span>
                  <span className="text-sm font-medium text-foreground">
                    چرم طبیعی نرم
                  </span>
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-muted-foreground">رنگ</span>
                  <span className="text-sm font-medium text-foreground">
                    مشکی مات
                  </span>
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-muted-foreground">نوع زیره</span>
                  <span className="text-sm font-medium text-foreground">
                    رابر ضد لغزش
                  </span>
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-muted-foreground">مناسب برای</span>
                  <span className="text-sm font-medium text-foreground">
                    استفاده روزمره
                  </span>
                </div>

                <div className="h-px bg-border/60" />

                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-muted-foreground">وزن</span>
                  <span className="text-sm font-medium text-foreground">
                    ۳۲۰ گرم
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit */}
        <Button className="w-full">
          افزودن به سبد خرید
        </Button>

      </div>

      {/* Gallery */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black" dir="rtl">
          {/* Close */}
          <button
            onClick={closeGallery}
            className="absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute right-1/2 top-5 z-50 translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
            {activeImage + 1} / {images.length}
          </div>

          {/* Main image */}
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={images[activeImage]}
              alt={`محصول ${activeImage + 1}`}
              fill
              className="object-contain"
              priority
            />

            {/* Previous */}
            <button
              onClick={previousImage}
              className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-6 right-1/2 flex translate-x-1/2 gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur-xl">
            {images.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={`relative h-12 w-12 overflow-hidden rounded-lg transition-all ${activeImage === index
                  ? "ring-2 ring-white"
                  : "opacity-60"
                  }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
