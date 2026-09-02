// "use client";

// import * as React from "react";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";
// import {
//     Dialog,
//     DialogContent,
// } from "@/components/ui/dialog";

// type SearchCommandProps = {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// };

// export function SearchCommand({
//     open,
//     onOpenChange,
// }: SearchCommandProps) {
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent
//                 dir="rtl"
//                 className="top-[12%] w-[calc(100%-32px)] max-w-[468px] translate-y-0 overflow-hidden rounded-[28px] border-0 bg-white p-0 shadow-xl"
//             >
//                 <Command className="rounded-[28px]">
//                     <CommandInput
//                         placeholder="جستجوی محصول..."
//                         className="h-14 text-right"
//                     />

//                     <CommandList className="max-h-[70dvh] px-2 pb-3">
//                         <CommandEmpty>
//                             محصولی پیدا نشد.
//                         </CommandEmpty>

//                         <CommandGroup heading="محصولات">
//                             {/* 
//                                 بعداً محصولات خودت را اینجا می‌گذاری.

//                                 مثال:

//                                 <CommandItem>
//                                     تیشرت لوگو دار
//                                 </CommandItem>
//                             */}

//                             <CommandItem value="تیشرت لوگو دار">
//                                 تیشرت لوگو دار
//                             </CommandItem>

//                             <CommandItem value="شلوارک جین">
//                                 شلوارک جین
//                             </CommandItem>

//                             <CommandItem value="هودی ساده">
//                                 هودی ساده
//                             </CommandItem>
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </DialogContent>
//         </Dialog>
//     );
// }








"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { searchProductsQuickAction } from "@/server/product/actions";
import type { ProductListItemDTO } from "@/types/product";
import { Loader2 } from "lucide-react";

type SearchCommandProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DEBOUNCE_MS = 300;

export function SearchCommand({
    open,
    onOpenChange,
}: SearchCommandProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<ProductListItemDTO[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Reset everything each time the dialog closes, so re-opening it never
    // shows a stale query/results from a previous search.
    React.useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
            setLoading(false);
        }
    }, [open]);

    React.useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            const result = await searchProductsQuickAction(trimmed);
            if (result.success) setResults(result.data);
            setLoading(false);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [query]);

    const goToSearchResults = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        onOpenChange(false);
        router.push(`/?search=${encodeURIComponent(trimmed)}`);
    };

    const goToProduct = (slug: string) => {
        onOpenChange(false);
        router.push(`/products/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                dir="rtl"
                className="top-[12%] w-[calc(100%-32px)] max-w-[468px] translate-y-0 overflow-hidden rounded-[28px] border-0 bg-white p-0 shadow-xl"
            >
                <Command
                    className="rounded-[28px]"
                    shouldFilter={false}
                    onKeyDown={(e) => {
                        // Enter with no item highlighted (cmdk still calls
                        // onSelect for the highlighted item first — this
                        // only fires the "go to /?search=" path when
                        // there's genuinely nothing to select, e.g. still
                        // loading or zero results).
                        if (e.key === "Enter" && (loading || results.length === 0)) {
                            e.preventDefault();
                            goToSearchResults();
                        }
                    }}
                >
                    <CommandInput
                        value={query}
                        onValueChange={setQuery}
                        placeholder="جستجوی محصول..."
                        className="h-14 text-right"
                    />

                    <CommandList className="max-h-[70dvh] px-2 pb-3">
                        {loading && (
                            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                در حال جستجو...
                            </div>
                        )}

                        {!loading && query.trim() && results.length === 0 && (
                            <CommandEmpty>محصولی پیدا نشد.</CommandEmpty>
                        )}

                        {!loading && results.length > 0 && (
                            <CommandGroup heading="محصولات">
                                {results.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id}
                                        onSelect={() => goToProduct(product.slug)}
                                        className="flex items-center gap-3 py-2"
                                    >
                                        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                                            {product.mainImageUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.mainImageUrl}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1 text-right">
                                            <p className="truncate text-[14px] font-medium">
                                                {product.title}
                                            </p>

                                            <div className="mt-0.5 flex items-center gap-1.5">
                                                {product.hasDiscount ? (
                                                    <>
                                                        <span className="text-[13px] font-bold text-[#c0392b]">
                                                            {product.minDiscountedPrice.toLocaleString("en-US")}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground line-through">
                                                            {product.minPrice.toLocaleString("en-US")}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-[13px] font-bold">
                                                        {product.minPrice.toLocaleString("en-US")}
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-muted-foreground">
                                                    تومن
                                                </span>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {!query.trim() && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                برای جستجو تایپ کنید...
                            </p>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

