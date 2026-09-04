// "use client";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//     getCartAction,
//     updateCartItemQuantityAction,
//     removeCartItemAction,
//     clearCartAction,
// } from "@/server/cart/actions";
// import { hydrateGuestCartAction } from "@/server/cart/guest-actions";
// import { useGuestCartStore } from "@/store/guest-cart-store";
// import { CartShell } from "./cart-shell";

// export function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
//     if (isLoggedIn) return <LoggedInCart />;
//     return <GuestCart />;
// }

// // ---------------------------------------------------------------------------
// // Logged-in: cart lives in the DB.
// // ---------------------------------------------------------------------------
// function LoggedInCart() {
//     const queryClient = useQueryClient();

//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["cart"],
//         queryFn: async () => {
//             const result = await getCartAction();
//             if (!result.success) throw new Error(result.error);
//             return result.data;
//         },
//     });

//     async function handleQuantityChange(variantId: string, quantity: number) {
//         await updateCartItemQuantityAction({ variantId, quantity });
//         queryClient.invalidateQueries({ queryKey: ["cart"] });
//     }

//     async function handleRemove(variantId: string) {
//         await removeCartItemAction(variantId);
//         queryClient.invalidateQueries({ queryKey: ["cart"] });
//     }

//     async function handleClear() {
//         await clearCartAction();
//         queryClient.invalidateQueries({ queryKey: ["cart"] });
//     }

//     if (isError) {
//         return <p className="p-6 text-center text-[13px] text-red-500">خطا در دریافت اطلاعات</p>;
//     }

//     return (
//         <CartShell
//             items={data?.items ?? []}
//             totalPrice={data?.totalPrice ?? 0}
//             isLoggedIn
//             isGuest={false}
//             isLoading={isLoading}
//             onQuantityChange={(variantId, quantity) =>
//                 handleQuantityChange(variantId, Math.max(1, quantity))
//             }
//             onRemove={handleRemove}
//             onClear={handleClear}
//         />
//     );
// }

// // ---------------------------------------------------------------------------
// // Guest: cart lives in Zustand/localStorage, hydrated via a server action
// // that fetches display data (title/price/image) for each variantId.
// // ---------------------------------------------------------------------------
// function GuestCart() {
//     const guestItems = useGuestCartStore((s) => s.items);
//     const updateQuantity = useGuestCartStore((s) => s.updateQuantity);
//     const removeItem = useGuestCartStore((s) => s.removeItem);
//     const clear = useGuestCartStore((s) => s.clear);

//     const { data, isLoading, isError } = useQuery({
//         queryKey: ["guest-cart", guestItems],
//         queryFn: async () => {
//             const result = await hydrateGuestCartAction(guestItems);
//             if (!result.success) throw new Error(result.error);
//             return result.data;
//         },
//     });

//     if (isError) {
//         return <p className="p-6 text-center text-[13px] text-red-500">خطا در دریافت اطلاعات</p>;
//     }

//     const items = data ?? [];
//     const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

//     return (
//         <CartShell
//             items={items}
//             totalPrice={totalPrice}
//             isLoggedIn={false}
//             isGuest
//             isLoading={isLoading && guestItems.length > 0}
//             onQuantityChange={(variantId, quantity) => updateQuantity(variantId, Math.max(1, quantity))}
//             onRemove={(variantId) => removeItem(variantId)}
//             onClear={clear}
//         />
//     );
// }










"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCartAction,
    updateCartItemQuantityAction,
    removeCartItemAction,
    clearCartAction,
} from "@/server/cart/actions";
import { hydrateGuestCartAction } from "@/server/cart/guest-actions";
import { useGuestCartStore } from "@/store/guest-cart-store";
import { useCartCountStore } from "@/store/cart-count-store";
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
    const setCartCount = useCartCountStore((s) => s.setCount);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const result = await getCartAction();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
    });

    // Trigger point #2: on /cart mount (and again after every mutation,
    // since those invalidate + refetch this same query) — keeps the
    // bottom-nav badge exactly in sync with what's shown on this page,
    // without a second server round-trip.
    useEffect(() => {
        if (data) setCartCount(data.totalItems);
    }, [data, setCartCount]);

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

