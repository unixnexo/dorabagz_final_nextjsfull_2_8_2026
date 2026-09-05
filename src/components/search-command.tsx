// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
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
// import { searchProductsQuickAction } from "@/server/product/actions";
// import type { ProductListItemDTO } from "@/types/product";
// import { Loader2 } from "lucide-react";

// type SearchCommandProps = {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// };

// const DEBOUNCE_MS = 300;

// export function SearchCommand({
//     open,
//     onOpenChange,
// }: SearchCommandProps) {
//     const router = useRouter();
//     const [query, setQuery] = React.useState("");
//     const [results, setResults] = React.useState<ProductListItemDTO[]>([]);
//     const [loading, setLoading] = React.useState(false);

//     // Reset everything each time the dialog closes, so re-opening it never
//     // shows a stale query/results from a previous search.
//     React.useEffect(() => {
//         if (!open) {
//             setQuery("");
//             setResults([]);
//             setLoading(false);
//         }
//     }, [open]);

//     React.useEffect(() => {
//         const trimmed = query.trim();
//         if (!trimmed) {
//             setResults([]);
//             setLoading(false);
//             return;
//         }

//         setLoading(true);
//         const timer = setTimeout(async () => {
//             const result = await searchProductsQuickAction(trimmed);
//             if (result.success) setResults(result.data);
//             setLoading(false);
//         }, DEBOUNCE_MS);

//         return () => clearTimeout(timer);
//     }, [query]);

//     const goToSearchResults = () => {
//         const trimmed = query.trim();
//         if (!trimmed) return;
//         onOpenChange(false);
//         router.push(`/?search=${encodeURIComponent(trimmed)}`);
//     };

//     const goToProduct = (slug: string) => {
//         onOpenChange(false);
//         router.push(`/products/${slug}`);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent
//                 dir="rtl"
//                 className="top-[12%] w-[calc(100%-32px)] max-w-[468px] translate-y-0 overflow-hidden rounded-[28px] border-0 bg-white p-0 shadow-xl"
//             >
//                 <Command
//                     className="rounded-[28px]"
//                     shouldFilter={false}
//                     onKeyDown={(e) => {
//                         // Enter with no item highlighted (cmdk still calls
//                         // onSelect for the highlighted item first — this
//                         // only fires the "go to /?search=" path when
//                         // there's genuinely nothing to select, e.g. still
//                         // loading or zero results).
//                         if (e.key === "Enter" && (loading || results.length === 0)) {
//                             e.preventDefault();
//                             goToSearchResults();
//                         }
//                     }}
//                 >
//                     <CommandInput
//                         value={query}
//                         onValueChange={setQuery}
//                         placeholder="جستجوی محصول..."
//                         className="h-14 text-right"
//                     />

//                     <CommandList className="max-h-[70dvh] px-2 pb-3">
//                         {loading && (
//                             <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
//                                 <Loader2 className="size-4 animate-spin" />
//                                 در حال جستجو...
//                             </div>
//                         )}

//                         {!loading && query.trim() && results.length === 0 && (
//                             <CommandEmpty>محصولی پیدا نشد.</CommandEmpty>
//                         )}

//                         {!loading && results.length > 0 && (
//                             <CommandGroup heading="محصولات">
//                                 {results.map((product) => (
//                                     <CommandItem
//                                         key={product.id}
//                                         value={product.id}
//                                         onSelect={() => goToProduct(product.slug)}
//                                         className="flex items-center gap-3 py-2"
//                                     >
//                                         <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
//                                             {product.mainImageUrl && (
//                                                 // eslint-disable-next-line @next/next/no-img-element
//                                                 <img
//                                                     src={product.mainImageUrl}
//                                                     alt={product.title}
//                                                     className="h-full w-full object-cover"
//                                                 />
//                                             )}
//                                         </div>

//                                         <div className="min-w-0 flex-1 text-right">
//                                             <p className="truncate text-[14px] font-medium">
//                                                 {product.title}
//                                             </p>

//                                             <div className="mt-0.5 flex items-center gap-1.5">
//                                                 {product.hasDiscount ? (
//                                                     <>
//                                                         <span className="text-[13px] font-bold text-[#c0392b]">
//                                                             {product.minDiscountedPrice.toLocaleString("en-US")}
//                                                         </span>
//                                                         <span className="text-[11px] text-muted-foreground line-through">
//                                                             {product.minPrice.toLocaleString("en-US")}
//                                                         </span>
//                                                     </>
//                                                 ) : (
//                                                     <span className="text-[13px] font-bold">
//                                                         {product.minPrice.toLocaleString("en-US")}
//                                                     </span>
//                                                 )}
//                                                 <span className="text-[11px] text-muted-foreground">
//                                                     تومن
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         )}

//                         {!query.trim() && (
//                             <p className="py-8 text-center text-sm text-muted-foreground">
//                                 برای جستجو تایپ کنید...
//                             </p>
//                         )}
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
import { Loader2, Search } from "lucide-react";

type SearchCommandProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DEBOUNCE_MS = 300;

const DEFAULT_SEARCHES = [
    "کیف نایکی",
    "کیف آدیداس",
    "کوله پشتی",
];

export function SearchCommand({
    open,
    onOpenChange,
}: SearchCommandProps) {
    const router = useRouter();

    const [query, setQuery] = React.useState("");
    const [debouncedQuery, setDebouncedQuery] = React.useState("");

    const [results, setResults] = React.useState<ProductListItemDTO[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Reset when dialog closes
    React.useEffect(() => {
        if (!open) {
            setQuery("");
            setDebouncedQuery("");
            setResults([]);
            setLoading(false);
        }
    }, [open]);

    // Debounce the input
    // React.useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setDebouncedQuery(query.trim());
    //     }, DEBOUNCE_MS);

    //     return () => clearTimeout(timer);
    // }, [query]);

    React.useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            setDebouncedQuery("");
            setLoading(false);
            return;
        }

        // Immediately show loading while waiting for debounce
        setLoading(true);

        const timer = setTimeout(() => {
            setDebouncedQuery(trimmed);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [query]);

    // Search after debounce
    React.useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const search = async () => {
            setLoading(true);

            try {
                const result =
                    await searchProductsQuickAction(debouncedQuery);

                if (cancelled) return;

                if (result.success) {
                    setResults(result.data);
                } else {
                    setResults([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        search();

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    const goToSearchResults = (searchQuery?: string) => {
        const value = (searchQuery ?? query).trim();

        if (!value) return;

        onOpenChange(false);

        router.push(
            `/?search=${encodeURIComponent(value)}`
        );
    };

    const goToProduct = (slug: string) => {
        onOpenChange(false);
        router.push(`/products/${slug}`);
    };

    const handleDefaultSearch = (value: string) => {
        setQuery(value);
        goToSearchResults(value);
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
                        if (
                            e.key === "Enter" &&
                            (loading || results.length === 0)
                        ) {
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
                        {/* User hasn't typed anything */}
                        {!query.trim() && (
                            <CommandGroup heading="جستجوهای پیشنهادی">
                                {DEFAULT_SEARCHES.map((item) => (
                                    <CommandItem
                                        key={item}
                                        value={item}
                                        onSelect={() => handleDefaultSearch(item)}
                                        className="flex cursor-pointer items-center gap-2.5 rounded-xl py-3"
                                    >
                                        <Search className="size-4 shrink-0 text-muted-foreground" />

                                        <span className="text-[14px]">
                                            {item}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* User started typing but debounce/search hasn't finished */}
                        {query.trim() && loading && (
                            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                <span>در حال جستجو...</span>
                            </div>
                        )}

                        {/* Search finished with no results */}
                        {!loading &&
                            debouncedQuery &&
                            results.length === 0 && (
                                <CommandEmpty>
                                    محصولی پیدا نشد.
                                </CommandEmpty>
                            )}

                        {/* Search results */}
                        {!loading && results.length > 0 && (
                            <CommandGroup heading="محصولات">
                                {results.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id}
                                        onSelect={() => goToProduct(product.slug)}
                                        className="flex cursor-pointer items-center gap-3 py-2"
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
                                                            {product.minDiscountedPrice.toLocaleString(
                                                                "en-US"
                                                            )}
                                                        </span>

                                                        <span className="text-[11px] text-muted-foreground line-through">
                                                            {product.minPrice.toLocaleString(
                                                                "en-US"
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-[13px] font-bold">
                                                        {product.minPrice.toLocaleString(
                                                            "en-US"
                                                        )}
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
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

