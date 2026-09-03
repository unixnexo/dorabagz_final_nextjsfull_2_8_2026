// "use client";

// import Link from "next/link";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getCartAction, updateCartItemQuantityAction, removeCartItemAction, clearCartAction } from "@/server/cart/actions";
// import { hydrateGuestCartAction } from "@/server/cart/guest-actions";
// import { useGuestCartStore } from "@/store/guest-cart-store";
// import type { CartItemDTO } from "@/types/cart";

// export function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
//   if (isLoggedIn) return <LoggedInCart />;
//   return <GuestCart />;
// }

// // ---------------------------------------------------------------------------
// // Logged-in: cart lives in the DB.
// // ---------------------------------------------------------------------------
// function LoggedInCart() {
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["cart"],
//     queryFn: async () => {
//       const result = await getCartAction();
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   async function handleQuantityChange(variantId: string, quantity: number) {
//     await updateCartItemQuantityAction({ variantId, quantity });
//     queryClient.invalidateQueries({ queryKey: ["cart"] });
//   }

//   async function handleRemove(variantId: string) {
//     await removeCartItemAction(variantId);
//     queryClient.invalidateQueries({ queryKey: ["cart"] });
//   }

//   async function handleClear() {
//     if (!confirm("سبد خرید خالی شود؟")) return;
//     await clearCartAction();
//     queryClient.invalidateQueries({ queryKey: ["cart"] });
//   }

//   if (isLoading) return <p>در حال بارگذاری...</p>;
//   if (isError) return <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>;
//   if (!data || data.items.length === 0) return <p>سبد خرید شما خالی است.</p>;

//   return (
//     <CartLines
//       items={data.items}
//       totalPrice={data.totalPrice}
//       onQuantityChange={handleQuantityChange}
//       onRemove={handleRemove}
//       onClear={handleClear}
//     />
//   );
// }

// // ---------------------------------------------------------------------------
// // Guest: cart lives in Zustand/localStorage, hydrated via a server action
// // that fetches display data (title/price/image) for each variantId.
// // ---------------------------------------------------------------------------
// function GuestCart() {
//   const guestItems = useGuestCartStore((s) => s.items);
//   const updateQuantity = useGuestCartStore((s) => s.updateQuantity);
//   const removeItem = useGuestCartStore((s) => s.removeItem);
//   const clear = useGuestCartStore((s) => s.clear);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["guest-cart", guestItems],
//     queryFn: async () => {
//       const result = await hydrateGuestCartAction(guestItems);
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   if (guestItems.length === 0) return <p>سبد خرید شما خالی است.</p>;
//   if (isLoading) return <p>در حال بارگذاری...</p>;
//   if (isError || !data) return <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>;

//   const totalPrice = data.reduce((sum, i) => sum + i.price * i.quantity, 0);

//   return (
//     <>
//       <p style={{ fontSize: 13, color: "#666" }}>
//         وارد نشده‌اید — این سبد خرید در مرورگر شما ذخیره می‌شود و پس از ورود به حساب، به صورت خودکار ذخیره خواهد شد.
//       </p>
//       <CartLines
//         items={data}
//         totalPrice={totalPrice}
//         onQuantityChange={(variantId, quantity) => updateQuantity(variantId, quantity)}
//         onRemove={(variantId) => removeItem(variantId)}
//         onClear={() => {
//           if (confirm("سبد خرید خالی شود؟")) clear();
//         }}
//       />
//     </>
//   );
// }

// // ---------------------------------------------------------------------------
// // Shared rendering for both flows.
// // ---------------------------------------------------------------------------
// function CartLines({
//   items,
//   totalPrice,
//   onQuantityChange,
//   onRemove,
//   onClear,
// }: {
//   items: CartItemDTO[];
//   totalPrice: number;
//   onQuantityChange: (variantId: string, quantity: number) => void;
//   onRemove: (variantId: string) => void;
//   onClear: () => void;
// }) {
//   return (
//     <div>
//       <button onClick={onClear} style={{ margin: "16px 0" }}>
//         خالی کردن سبد خرید
//       </button>

//       <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>محصول</th>
//             <th>گزینه‌ها</th>
//             <th>قیمت واحد</th>
//             <th>تعداد</th>
//             <th>جمع</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item) => (
//             <tr key={item.variantId}>
//               <td>
//                 <Link href={`/products/${item.productSlug}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   {item.mainImageUrl && (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={item.mainImageUrl} alt="" style={{ width: 50, height: 50, objectFit: "cover" }} />
//                   )}
//                   {item.productTitle}
//                 </Link>
//               </td>
//               <td>
//                 {Object.entries(item.optionValues)
//                   .map(([k, v]) => `${k}: ${v}`)
//                   .join(" / ") || "-"}
//               </td>
//               <td>{item.price.toLocaleString("fa-IR")} تومن</td>
//               <td>
//                 <input
//                   type="number"
//                   min={1}
//                   max={item.stock}
//                   value={item.quantity}
//                   onChange={(e) =>
//                     onQuantityChange(item.variantId, Math.max(1, Math.min(item.stock, Number(e.target.value))))
//                   }
//                   style={{ width: 60 }}
//                 />
//                 {item.stock < item.quantity && <p style={{ color: "red", fontSize: 12 }}>موجودی کافی نیست</p>}
//               </td>
//               <td>{(item.price * item.quantity).toLocaleString("fa-IR")} تومن</td>
//               <td>
//                 <button onClick={() => onRemove(item.variantId)}>حذف</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h2 style={{ marginTop: 16 }}>جمع کل: {totalPrice.toLocaleString("fa-IR")} تومن</h2>

//       {/* /checkout is a future module */}
//       <Link href="/checkout">
//         <button>ادامه فرآیند خرید</button>
//       </Link>
//     </div>
//   );
// }














"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCartAction,
    updateCartItemQuantityAction,
    removeCartItemAction,
    clearCartAction,
} from "@/server/cart/actions";
import { hydrateGuestCartAction } from "@/server/cart/guest-actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import { CartShell } from "./cart-shell";

export function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
    if (isLoggedIn) return <LoggedInCart />;
    return <GuestCart />;
}

// ---------------------------------------------------------------------------
// Logged-in: cart lives in the DB.
// ---------------------------------------------------------------------------
function LoggedInCart() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const result = await getCartAction();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });

    async function handleQuantityChange(variantId: string, quantity: number) {
        await updateCartItemQuantityAction({ variantId, quantity });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
    }

    async function handleRemove(variantId: string) {
        await removeCartItemAction(variantId);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
    }

    async function handleClear() {
        await clearCartAction();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
    }

    if (isError) {
        return <p className="p-6 text-center text-[13px] text-red-500">خطا در دریافت اطلاعات</p>;
    }

    return (
        <CartShell
            items={data?.items ?? []}
            totalPrice={data?.totalPrice ?? 0}
            isLoggedIn
            isGuest={false}
            isLoading={isLoading}
            onQuantityChange={(variantId, quantity) =>
                handleQuantityChange(variantId, Math.max(1, quantity))
            }
            onRemove={handleRemove}
            onClear={handleClear}
        />
    );
}

// ---------------------------------------------------------------------------
// Guest: cart lives in Zustand/localStorage, hydrated via a server action
// that fetches display data (title/price/image) for each variantId.
// ---------------------------------------------------------------------------
function GuestCart() {
    const guestItems = useGuestCartStore((s) => s.items);
    const updateQuantity = useGuestCartStore((s) => s.updateQuantity);
    const removeItem = useGuestCartStore((s) => s.removeItem);
    const clear = useGuestCartStore((s) => s.clear);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["guest-cart", guestItems],
        queryFn: async () => {
            const result = await hydrateGuestCartAction(guestItems);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });

    if (isError) {
        return <p className="p-6 text-center text-[13px] text-red-500">خطا در دریافت اطلاعات</p>;
    }

    const items = data ?? [];
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartShell
            items={items}
            totalPrice={totalPrice}
            isLoggedIn={false}
            isGuest
            isLoading={isLoading && guestItems.length > 0}
            onQuantityChange={(variantId, quantity) => updateQuantity(variantId, Math.max(1, quantity))}
            onRemove={(variantId) => removeItem(variantId)}
            onClear={clear}
        />
    );
}