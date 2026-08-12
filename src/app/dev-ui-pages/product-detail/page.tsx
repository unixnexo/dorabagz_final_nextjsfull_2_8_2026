// product detail page


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <Image
          src="/site/1.jpg"
          alt="محصول"
          fill
          priority
          className="object-cover"
        />

        {/* Fade out bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-background/70 to-background" />

        {/* Back button */}
        <div className="absolute left-4 top-4 z-10">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
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
        <div className="flex gap-3 flex-row">
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
        <div className="space-y-3">

          <p className="text-sm leading-7 text-muted-foreground">
            این کفش اسپرت با طراحی مدرن و راحتی بالا برای استفاده روزمره
            و فعالیت‌های سبک ورزشی مناسب است. رویه تنفس‌پذیر، زیره مقاوم
            و وزن سبک آن باعث می‌شود در طول روز احساس راحتی داشته باشید.
            انتخابی ایده‌آل برای استایل کژوال و استفاده طولانی‌مدت.
          </p>
        </div>

        {/* Submit */}
        <Button className="w-full">
          افزودن به سبد خرید
        </Button>
      </div>
    </div>
  );
}

