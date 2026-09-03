// "use client";

// import Link from "next/link";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   listFavoritesAction,
//   removeFavoriteAction,
//   clearFavoritesAction,
// } from "@/server/favorite/actions";

// export function FavoritesList() {
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["favorites"],
//     queryFn: async () => {
//       const result = await listFavoritesAction();
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   async function handleRemove(favoriteId: string) {
//     await removeFavoriteAction(favoriteId);
//     queryClient.invalidateQueries({ queryKey: ["favorites"] });
//   }

//   async function handleClearAll() {
//     if (!confirm("همه علاقه‌مندی‌ها حذف شوند؟")) return;
//     await clearFavoritesAction();
//     queryClient.invalidateQueries({ queryKey: ["favorites"] });
//   }

//   if (isLoading) return <p>در حال بارگذاری...</p>;
//   if (isError) return <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>;
//   if (!data || data.length === 0) return <p>هیچ محصولی به علاقه‌مندی‌ها اضافه نشده است.</p>;

//   return (
//     <div>
//       <button onClick={handleClearAll} style={{ marginBottom: 16 }}>
//         حذف همه
//       </button>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
//         {data.map((fav) => (
//           <div key={fav.id} style={{ border: "1px solid #ddd", padding: 12 }}>
//             <Link href={`/products/${fav.productSlug}`}>
//               {fav.mainImageUrl && (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   src={fav.mainImageUrl}
//                   alt={fav.productTitle}
//                   style={{ width: "100%", height: 140, objectFit: "cover" }}
//                 />
//               )}
//               <p>{fav.productTitle}</p>
//               {fav.hasDiscount ? (
//                 <p>
//                   <span style={{ textDecoration: "line-through", color: "#999", marginLeft: 6 }}>
//                     {fav.minPrice === fav.maxPrice
//                       ? fav.minPrice.toLocaleString("fa-IR")
//                       : `${fav.minPrice.toLocaleString("fa-IR")}-${fav.maxPrice.toLocaleString("fa-IR")}`}
//                   </span>
//                   <span style={{ color: "#c0392b", fontWeight: "bold" }}>
//                     {fav.minDiscountedPrice === fav.maxDiscountedPrice
//                       ? `${fav.minDiscountedPrice.toLocaleString("fa-IR")} تومن`
//                       : `${fav.minDiscountedPrice.toLocaleString("fa-IR")} - ${fav.maxDiscountedPrice.toLocaleString("fa-IR")} تومن`}
//                   </span>
//                 </p>
//               ) : (
//                 <p>
//                   {fav.minPrice === fav.maxPrice
//                     ? `${fav.minPrice.toLocaleString("fa-IR")} تومن`
//                     : `${fav.minPrice.toLocaleString("fa-IR")} - ${fav.maxPrice.toLocaleString("fa-IR")} تومن`}
//                 </p>
//               )}
//               <p>{fav.totalStock > 0 ? `موجودی: ${fav.totalStock}` : "ناموجود"}</p>
//             </Link>
//             <button onClick={() => handleRemove(fav.id)}>حذف</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }











"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import {
  listFavoritesAction,
  removeFavoriteAction,
  clearFavoritesAction,
} from "@/server/favorite/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductCard } from "@/components/product-card";
import BackButton from "@/components/BackButton";
import { SearchCommand } from "@/components/search-command";
import { BottomNav } from "@/components/bottom-nav";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesList() {
  const [searchOpen, setSearchOpen] = useState(false);
  const queryClient = useQueryClient();
  const [pendingRemoval, setPendingRemoval] = useState<Set<string>>(new Set());
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const result = await listFavoritesAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleRemove(favoriteId: string) {
    // Animate out first, then invalidate once the exit transition finishes.
    setPendingRemoval((prev) => new Set(prev).add(favoriteId));
  }

  async function handleExitComplete(favoriteId: string) {
    await removeFavoriteAction(favoriteId);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    setPendingRemoval((prev) => {
      const next = new Set(prev);
      next.delete(favoriteId);
      return next;
    });
  }

  // async function handleClearAll() {
  //   if (!confirm("همه علاقه‌مندی‌ها حذف شوند؟")) return;
  //   await clearFavoritesAction();
  //   queryClient.invalidateQueries({ queryKey: ["favorites"] });
  // }

  async function handleClearAll() {
    await clearFavoritesAction();
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    setClearDialogOpen(false);
  }

  const visibleData = data ?? [];

  return (
    <div className="min-h-dvh bg-[#f1f2f3] text-[#171717]">
      <div className="mx-auto min-h-screen w-full max-w-[500px] px-4 pb-28 pt-[88px]">
        {/* Top bar */}
        <div className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[88px] max-w-[500px] items-start justify-between bg-[#f1f2f3] px-4 pt-4">
          <div className="text-right">
            <h1 className="text-[21px] font-bold tracking-tight">علاقه‌مندی‌ها</h1>
            <p className="mt-0.5 text-[13px] text-black/45">محصولاتی که دوست داری</p>
          </div>

          <BackButton fixed={false} />
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[25px]">
                <Skeleton className="aspect-[0.88] w-full rounded-[25px] bg-black/[0.08]" />
                <div className="px-1 pt-2.5 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded-md bg-black/[0.08]" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-black/[0.08]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex min-h-[55vh] items-center justify-center">
            <p className="text-[13px] text-red-500">خطا در دریافت اطلاعات</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] text-black/40">
                {visibleData.length} محصول
              </span>

              {visibleData.length > 0 && (
                // <button
                //   type="button"
                //   onClick={handleClearAll}
                //   className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-red-500 active:scale-95"
                // >
                //   حذف همه
                // </button>

                <button
                  type="button"
                  onClick={() => setClearDialogOpen(true)}
                  className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-red-500 active:scale-95"
                >
                  حذف همه
                </button>

              )}
            </div>

            <section className="pt-1">
              {visibleData.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence>
                    {visibleData.map((fav) => {
                      const isRemoving = pendingRemoval.has(fav.id);
                      return (
                        <motion.div
                          key={fav.id}
                          layout
                          initial={{ opacity: 1, scale: 1 }}
                          animate={
                            isRemoving
                              ? { opacity: 0, scale: 0.75, y: 10 }
                              : { opacity: 1, scale: 1, y: 0 }
                          }
                          exit={{ opacity: 0, scale: 0.75, y: 10 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          onAnimationComplete={() => {
                            if (isRemoving) handleExitComplete(fav.id);
                          }}
                        >
                          <ProductCard
                            product={{
                              id: fav.id,
                              title: fav.productTitle,
                              image: fav.mainImageUrl,
                              slug: fav.productSlug,
                              minPrice: fav.minPrice,
                              maxPrice: fav.maxPrice,
                              hasDiscount: fav.hasDiscount,
                              minDiscountedPrice: fav.minDiscountedPrice,
                              maxDiscountedPrice: fav.maxDiscountedPrice,
                              totalStock: fav.totalStock,
                            }}
                            isFavorite={!isRemoving}
                            onToggleFavorite={(next) => {
                              if (!next) handleRemove(fav.id);
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex min-h-[55vh] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[22px] bg-white">
                      <span className="text-2xl">♡</span>
                    </div>
                    <h2 className="text-[16px] font-semibold">هنوز محصولی اضافه نکردی</h2>
                    <p className="mt-1 text-[13px] text-black/45">
                      محصولات مورد علاقه‌ات اینجا نمایش داده می‌شوند
                    </p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف همه علاقه‌مندی‌ها؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات همه محصولات موجود در لیست علاقه‌مندی‌های شما را حذف می‌کند و قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              حذف همه
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <BottomNav
        searchOpen={searchOpen}
        onSearchClick={() => setSearchOpen(true)}
      />

    </div>
  );
}

