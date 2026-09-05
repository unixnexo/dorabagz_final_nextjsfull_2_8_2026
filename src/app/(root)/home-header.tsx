// "use client";

// import { Bell, UserRound, SlidersHorizontal, CircleHelp, Headset } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { useNumberInput } from "@/lib/use-number-input";

// export function HomeHeader({ isAdmin = false }: { isAdmin?: boolean }) {
//     const [sort, setSort] = useState("newest");
//     const minPrice = useNumberInput();
//     const maxPrice = useNumberInput();

//     return (
//         <header
//             className="fixed inset-x-0 top-0 z-20 mx-auto flex h-[88px] max-w-[500px] items-center justify-between bg-white px-2 pb-5 pt-4"
//         >
//             {/* Left side */}
//             <div className="flex items-center gap-3">
//                 <Button
//                     asChild
//                     variant="ghost"
//                     size="icon"
//                     className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
//                 >
//                     <Link href="/dashboard/profile">
//                         <UserRound className="!size-6 text-black/70" />
//                     </Link>
//                 </Button>

//                 {isAdmin && (
//                     <Button
//                         asChild
//                         variant="ghost"
//                         size="icon"
//                         className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
//                     >
//                         <Link href="/admin">
//                             <Headset className="!size-6 text-black/70" />
//                         </Link>
//                     </Button>
//                 )}

//                 <Button
//                     asChild
//                     variant="ghost"
//                     size="icon"
//                     className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
//                 >
//                     <Link href="/notifications">
//                         <Bell className="!size-6 text-black/70" />
//                     </Link>
//                 </Button>
//             </div>

//             {/* Right side actions */}
//             <div className="flex items-center gap-3">
//                 {/* Filter */}
//                 <Drawer>
//                     <DrawerTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
//                         >
//                             <SlidersHorizontal className="!size-6 text-black/70" />
//                         </Button>
//                     </DrawerTrigger>

//                     <DrawerContent
//                         className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
//                     >
//                         <DrawerHeader className="px-1 pb-5 pt-3">
//                             <DrawerTitle className="text-right text-[20px] font-bold">
//                                 فیلتر محصولات
//                             </DrawerTitle>
//                         </DrawerHeader>

//                         <div className="max-h-[60vh] space-y-7 overflow-auto px-2 pb-4">
//                             {/* Sort */}
//                             <section>
//                                 <h3 className="mb-3 text-[15px] font-semibold">
//                                     مرتب سازی بر اساس
//                                 </h3>

//                                 <div className="overflow-hidden rounded-3xl bg-white">
//                                     {[
//                                         {
//                                             value: "expensive",
//                                             label: "گران ترین",
//                                         },
//                                         {
//                                             value: "cheap",
//                                             label: "ارزان ترین",
//                                         },
//                                         {
//                                             value: "newest",
//                                             label: "جدید ترین",
//                                         },
//                                         {
//                                             value: "oldest",
//                                             label: "قدیمی ترین",
//                                         },
//                                     ].map((item, index) => (
//                                         <button
//                                             key={item.value}
//                                             type="button"
//                                             onClick={() => setSort(item.value)}
//                                             className={`flex h-[52px] w-full items-center justify-between px-4 text-[14px] transition-colors ${index !== 0
//                                                 ? "border-t border-black/[0.06]"
//                                                 : ""
//                                                 }`}
//                                         >
//                                             <span>{item.label}</span>

//                                             <span
//                                                 className={`flex size-5 items-center justify-center rounded-full border ${sort === item.value
//                                                     ? "border-black"
//                                                     : "border-black/20"
//                                                     }`}
//                                             >
//                                                 {sort === item.value && (
//                                                     <span className="size-2.5 rounded-full bg-black" />
//                                                 )}
//                                             </span>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </section>

//                             {/* Price */}
//                             <section>
//                                 <h3 className="mb-3 text-[15px] font-semibold">
//                                     محدوده قیمت
//                                 </h3>

//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div className="relative">
//                                         <Input
//                                             type="text"
//                                             inputMode="numeric"
//                                             value={minPrice.value}
//                                             onChange={(e) =>
//                                                 minPrice.onChange(e.target.value)
//                                             }
//                                             placeholder="حداقل"
//                                             className="pe-12"
//                                         />

//                                         <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
//                                             تومن
//                                         </span>
//                                     </div>

//                                     <div className="relative">
//                                         <Input
//                                             type="text"
//                                             inputMode="numeric"
//                                             value={maxPrice.value}
//                                             onChange={(e) =>
//                                                 maxPrice.onChange(e.target.value)
//                                             }
//                                             placeholder="حداکثر"
//                                             className="pe-12"
//                                         />

//                                         <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
//                                             تومن
//                                         </span>
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* In stock */}
//                             <section className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3.5">
//                                 <Label
//                                     htmlFor="in-stock"
//                                     className="cursor-pointer text-[14px] font-medium"
//                                 >
//                                     فقط کالاهای موجود
//                                 </Label>

//                                 <Switch id="in-stock" />
//                             </section>

//                             {/* Discount */}
//                             <section className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3.5">
//                                 <Label
//                                     htmlFor="discounted"
//                                     className="cursor-pointer text-[14px] font-medium"
//                                 >
//                                     تخفیف دار ها
//                                 </Label>

//                                 <Switch id="discounted" />
//                             </section>
//                         </div>

//                         <DrawerFooter className="px-0 pb-6 pt-2">
//                             <Button>
//                                 اعمال فیلتر
//                             </Button>

//                             <DrawerClose asChild>
//                                 <Button variant="outline">
//                                     حذف فیلتر
//                                 </Button>
//                             </DrawerClose>
//                         </DrawerFooter>
//                     </DrawerContent>
//                 </Drawer>

//                 {/* Help */}
//                 <Drawer>
//                     <DrawerTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
//                         >
//                             <CircleHelp className="!size-6 text-black/70" />
//                         </Button>
//                     </DrawerTrigger>

//                     <DrawerContent
//                         className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
//                     >
//                         <DrawerHeader className="px-1 pb-5 pt-3">
//                             <DrawerTitle className="text-right text-[20px] font-bold mt-6">
//                                 راهنما و پشتیبانی
//                             </DrawerTitle>
//                         </DrawerHeader>

//                         <div className="space-y-2 pb-4">
//                             {/* FAQ */}
//                             <Link
//                                 href="/faq"
//                                 className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
//                             >
//                                 <div>
//                                     <p className="text-[15px] font-semibold">
//                                         سوالات متداول
//                                     </p>
//                                     <p className="mt-1 text-[12px] text-muted-foreground">
//                                         پاسخ سوالات رایج
//                                     </p>
//                                 </div>

//                                 <CircleHelp className="size-5 text-black/40" />
//                             </Link>

//                             {/* Contact */}
//                             <Link
//                                 href="/contact"
//                                 className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
//                             >
//                                 <div>
//                                     <p className="text-[15px] font-semibold">
//                                         تماس با ما
//                                     </p>
//                                     <p className="mt-1 text-[12px] text-muted-foreground">
//                                         ارتباط با پشتیبانی
//                                     </p>
//                                 </div>

//                                 <CircleHelp className="size-5 text-black/40" />
//                             </Link>
//                         </div>
//                     </DrawerContent>
//                 </Drawer>
//             </div>

//         </header>
//     );
// }













"use client";

import { Bell, UserRound, SlidersHorizontal, CircleHelp, Headset } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNumberInput } from "@/lib/use-number-input";
import { useProductFilters, type SortOption } from "@/lib/use-product-filters";
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";

// export function HomeHeader({ isAdmin = false }: { isAdmin?: boolean }) {
//     const { filters, applyFilters } = useProductFilters();

export function HomeHeader({
    isAdmin = false,
    isLoggedIn = false,
    initialUnreadCount,
}: {
    isAdmin?: boolean;
    isLoggedIn?: boolean;
    initialUnreadCount?: number;
}) {
    const { count: unreadCount } = useUnreadNotificationsCount(isLoggedIn, initialUnreadCount);
    const { filters, applyFilters } = useProductFilters();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sort, setSort] = useState<SortOption>(filters.sort);
    const [inStock, setInStock] = useState(filters.inStock);
    const [discounted, setDiscounted] = useState(filters.hasDiscount);
    const minPrice = useNumberInput(filters.minPrice ? String(filters.minPrice) : "");
    const maxPrice = useNumberInput(filters.maxPrice ? String(filters.maxPrice) : "");

    // Whenever the drawer is (re)opened, sync local draft state back to
    // whatever's actually in the URL right now — otherwise stale local
    // state (e.g. from before a "حذف فیلتر" elsewhere) would linger.
    useEffect(() => {
        if (!drawerOpen) return;
        setSort(filters.sort);
        setInStock(filters.inStock);
        setDiscounted(filters.hasDiscount);
        minPrice.onChange(filters.minPrice ? String(filters.minPrice) : "");
        maxPrice.onChange(filters.maxPrice ? String(filters.maxPrice) : "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    const handleApply = () => {
        const min = minPrice.rawValue ? Number(minPrice.rawValue) : undefined;
        const max = maxPrice.rawValue ? Number(maxPrice.rawValue) : undefined;

        applyFilters({
            sort,
            inStock,
            hasDiscount: discounted,
            minPrice: min,
            maxPrice: max,
        });
        setDrawerOpen(false);
    };

    const handleClear = () => {
        setSort("newest");
        setInStock(false);
        setDiscounted(false);
        minPrice.onChange("");
        maxPrice.onChange("");
        applyFilters({
            sort: "newest",
            inStock: false,
            hasDiscount: false,
            minPrice: undefined,
            maxPrice: undefined,
            // keep search/categoryId as-is — "حذف فیلتر" here only clears
            // the drawer's own fields, not an active search term
            search: filters.search,
            categoryId: filters.categoryId,
        });
        setDrawerOpen(false);
    };

    return (
        <header
            className="fixed inset-x-0 top-0 z-20 mx-auto flex h-[88px] max-w-[500px] items-center justify-between bg-white px-2 pb-5 pt-4"
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                >
                    <Link href="/dashboard/profile">
                        <UserRound className="!size-6 text-black/70" />
                    </Link>
                </Button>

                {isAdmin && (
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                    >
                        <Link href="/admin">
                            <Headset className="!size-6 text-black/70" />
                        </Link>
                    </Button>
                )}

                {/* <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                >
                    <Link href="/notifications">
                        <Bell className="!size-6 text-black/70" />
                    </Link>
                </Button> */}

                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="relative size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                >
                    <Link href="/notifications">
                        <Bell className="!size-6 text-black/70" />

                        {unreadCount > 0 && (
                            <span className="absolute right-2.5 top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-300 px-1 text-[10px] font-bold leading-none text-neutral-800">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </Link>
                </Button>

            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
                {/* Filter */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                        >
                            <SlidersHorizontal className="!size-6 text-black/70" />
                            {(filters.inStock ||
                                filters.hasDiscount ||
                                filters.minPrice !== undefined ||
                                filters.maxPrice !== undefined ||
                                filters.sort !== "newest") && (
                                    <span className="absolute right-3 top-3 size-2 rounded-full bg-[#c0392b]" />
                                )}
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent
                        className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
                    >
                        <DrawerHeader className="px-1 pb-5 pt-3">
                            <DrawerTitle className="text-right text-[20px] font-bold">
                                فیلتر محصولات
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="max-h-[60vh] space-y-7 overflow-auto px-2 pb-4">
                            {/* Sort */}
                            <section>
                                <h3 className="mb-3 text-[15px] font-semibold">
                                    مرتب سازی بر اساس
                                </h3>

                                <div className="overflow-hidden rounded-3xl bg-white">
                                    {[
                                        { value: "expensive", label: "گران ترین" },
                                        { value: "cheap", label: "ارزان ترین" },
                                        { value: "newest", label: "جدید ترین" },
                                        { value: "oldest", label: "قدیمی ترین" },
                                    ].map((item, index) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setSort(item.value as SortOption)}
                                            className={`flex h-[52px] w-full items-center justify-between px-4 text-[14px] transition-colors ${index !== 0
                                                ? "border-t border-black/[0.06]"
                                                : ""
                                                }`}
                                        >
                                            <span>{item.label}</span>

                                            <span
                                                className={`flex size-5 items-center justify-center rounded-full border ${sort === item.value
                                                    ? "border-black"
                                                    : "border-black/20"
                                                    }`}
                                            >
                                                {sort === item.value && (
                                                    <span className="size-2.5 rounded-full bg-black" />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Price */}
                            <section>
                                <h3 className="mb-3 text-[15px] font-semibold">
                                    محدوده قیمت
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            value={minPrice.value}
                                            onChange={(e) =>
                                                minPrice.onChange(e.target.value)
                                            }
                                            placeholder="حداقل"
                                            className="pe-12"
                                        />

                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            تومن
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            value={maxPrice.value}
                                            onChange={(e) =>
                                                maxPrice.onChange(e.target.value)
                                            }
                                            placeholder="حداکثر"
                                            className="pe-12"
                                        />

                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                            تومن
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* In stock */}
                            <section className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3.5">
                                <Label
                                    htmlFor="in-stock"
                                    className="cursor-pointer text-[14px] font-medium"
                                >
                                    فقط کالاهای موجود
                                </Label>

                                <Switch
                                    id="in-stock"
                                    checked={inStock}
                                    onCheckedChange={setInStock}
                                />
                            </section>

                            {/* Discount */}
                            <section className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3.5">
                                <Label
                                    htmlFor="discounted"
                                    className="cursor-pointer text-[14px] font-medium"
                                >
                                    تخفیف دار ها
                                </Label>

                                <Switch
                                    id="discounted"
                                    checked={discounted}
                                    onCheckedChange={setDiscounted}
                                />
                            </section>
                        </div>

                        <DrawerFooter className="px-0 pb-6 pt-2">
                            <Button onClick={handleApply}>اعمال فیلتر</Button>

                            <Button variant="outline" onClick={handleClear}>
                                حذف فیلتر
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/* Help */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-14 rounded-3xl bg-muted hover:bg-[#eeeeee]"
                        >
                            <CircleHelp className="!size-6 text-black/70" />
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent
                        className="mx-auto max-w-[500px] rounded-t-[32px] border-0 bg-muted px-4"
                    >
                        <DrawerHeader className="px-1 pb-5 pt-3">
                            <DrawerTitle className="text-right text-[20px] font-bold mt-6">
                                راهنما و پشتیبانی
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="space-y-2 pb-4">
                            <Link
                                href="/faq"
                                className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                            >
                                <div>
                                    <p className="text-[15px] font-semibold">
                                        سوالات متداول
                                    </p>
                                    <p className="mt-1 text-[12px] text-muted-foreground">
                                        پاسخ سوالات رایج
                                    </p>
                                </div>

                                <CircleHelp className="size-5 text-black/40" />
                            </Link>

                            <Link
                                href="/contact"
                                className="flex h-[64px] items-center justify-between rounded-[20px] bg-white px-4 transition-transform active:scale-[0.98]"
                            >
                                <div>
                                    <p className="text-[15px] font-semibold">
                                        تماس با ما
                                    </p>
                                    <p className="mt-1 text-[12px] text-muted-foreground">
                                        ارتباط با پشتیبانی
                                    </p>
                                </div>

                                <CircleHelp className="size-5 text-black/40" />
                            </Link>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </header>
    );
}
