// import { listProductsAction } from "@/server/product/actions";
// import { getCategoryTreeAction } from "@/server/category/actions";
// import { getCurrentUser } from "@/server/user/get-current-user";
// import { getCartAction } from "@/server/cart/actions";
// import HomeContent from "./homecontent";
// import { Metadata } from "next";
// import type { PaginatedResult } from "@/types/user";
// import type { ProductListItemDTO } from "@/types/product";
// import NotificationPermissionDialog from "@/components/notification-permission-dialog";

// export const metadata: Metadata = {
//     title: {
//         absolute: "درا بگز | فروشگاه اینترنتی",
//     },
//     description:
//         "درا بگز؛ فروشگاه اینترنتی کیف با مجموعه‌ای از کیف‌ها و محصولات متنوع. مشاهده محصولات، دسته‌بندی‌ها و خرید آنلاین.",
//     alternates: {
//         canonical: "/",
//     },
//     openGraph: {
//         type: "website",
//         locale: "fa_IR",
//         url: "https://dorabagz.ir/",
//         siteName: "درا بگز",
//         title: "درا بگز | فروشگاه اینترنتی کیف و لباس",
//         description:
//             "خرید آنلاین کیف و لباس از درا بگز؛ مشاهده محصولات و دسته‌بندی‌های مختلف.",
//         images: [
//             {
//                 url: "/og-default.webp",
//                 width: 1200,
//                 height: 630,
//                 alt: "درا بگز | فروشگاه اینترنتی کیف و لباس",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "درا بگز | فروشگاه اینترنتی کیف و لباس",
//         description:
//             "خرید آنلاین کیف و لباس از درا بگز؛ مشاهده محصولات و دسته‌بندی‌های مختلف.",
//         images: ["/og-default.webp"],
//     },
//     robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//             index: true,
//             follow: true,
//             "max-image-preview": "large",
//             "max-snippet": -1,
//         },
//     },
// };

// const EMPTY_RESULT: PaginatedResult<ProductListItemDTO> = {
//     items: [],
//     page: 1,
//     pageSize: 20,
//     totalItems: 0,
//     totalPages: 1,
// };

// export default async function HomePage({
//     searchParams,
// }: {
//     searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//     const params = await searchParams;
//     const page = params.page ? Number(params.page) : 1;

//     const [productsResult, categoriesResult, user] = await Promise.all([
//         listProductsAction({
//             page,
//             search: params.search,
//             categoryId: params.categoryId,
//             minPrice: params.minPrice,
//             maxPrice: params.maxPrice,
//             // URL values are always strings ("1"/"0") or absent — turn
//             // them into real booleans here so productListQuerySchema's
//             // z.coerce.boolean() (which would treat "0" as truthy) never
//             // sees the raw string.
//             inStock: params.inStock === "1",
//             hasDiscount: params.hasDiscount === "1",
//             sort: params.sort,
//         }),
//         getCategoryTreeAction(),
//         getCurrentUser(),
//     ]);

//     const products = productsResult.success ? productsResult.data : EMPTY_RESULT;
//     const categories = categoriesResult.success ? categoriesResult.data : [];

//     // Only fetch the cart for logged-in users — guests' count comes from
//     // localStorage client-side, no server call needed for them.
//     const cartResult = user ? await getCartAction() : null;
//     const initialCartCount = cartResult?.success ? cartResult.data.totalItems : undefined;

//     return (
//         <>
//             <HomeContent
//                 products={products}
//                 categories={categories}
//                 isAdmin={user?.role === "ADMIN"}
//                 isLoggedIn={!!user}
//                 initialCartCount={initialCartCount}
//             />

//             <NotificationPermissionDialog />
//         </>
//     )
// };









import { listProductsAction } from "@/server/product/actions";
import { getCategoryTreeAction } from "@/server/category/actions";
import { getCurrentUser } from "@/server/user/get-current-user";
import { getCartAction } from "@/server/cart/actions";
import { getUnreadNotificationCountAction } from "@/server/notification/actions";
import HomeContent from "./homecontent";
import { Metadata } from "next";
import type { PaginatedResult } from "@/types/user";
import type { ProductListItemDTO } from "@/types/product";
import NotificationPermissionDialog from "@/components/notification-permission-dialog";

export const metadata: Metadata = {
    title: {
        absolute: "درا بگز | فروشگاه اینترنتی",
    },
    description:
        "درا بگز؛ فروشگاه اینترنتی کیف با مجموعه‌ای از کیف‌ها و محصولات متنوع. مشاهده محصولات، دسته‌بندی‌ها و خرید آنلاین.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "fa_IR",
        url: "https://dorabagz.ir/",
        siteName: "درا بگز",
        title: "درا بگز | فروشگاه اینترنتی کیف و لباس",
        description:
            "خرید آنلاین کیف و لباس از درا بگز؛ مشاهده محصولات و دسته‌بندی‌های مختلف.",
        images: [
            {
                url: "/og-default.webp",
                width: 1200,
                height: 630,
                alt: "درا بگز | فروشگاه اینترنتی کیف و لباس",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "درا بگز | فروشگاه اینترنتی کیف و لباس",
        description:
            "خرید آنلاین کیف و لباس از درا بگز؛ مشاهده محصولات و دسته‌بندی‌های مختلف.",
        images: ["/og-default.webp"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const EMPTY_RESULT: PaginatedResult<ProductListItemDTO> = {
    items: [],
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
};

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const page = params.page ? Number(params.page) : 1;

    const [productsResult, categoriesResult, user] = await Promise.all([
        listProductsAction({
            page,
            search: params.search,
            categoryId: params.categoryId,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            // URL values are always strings ("1"/"0") or absent — turn
            // them into real booleans here so productListQuerySchema's
            // z.coerce.boolean() (which would treat "0" as truthy) never
            // sees the raw string.
            inStock: params.inStock === "1",
            hasDiscount: params.hasDiscount === "1",
            sort: params.sort,
        }),
        getCategoryTreeAction(),
        getCurrentUser(),
    ]);

    const products = productsResult.success ? productsResult.data : EMPTY_RESULT;
    const categories = categoriesResult.success ? categoriesResult.data : [];

    // Only fetch the cart for logged-in users — guests' count comes from
    // localStorage client-side, no server call needed for them.
    const cartResult = user ? await getCartAction() : null;
    const initialCartCount = cartResult?.success ? cartResult.data.totalItems : undefined;

    const unreadResult = user ? await getUnreadNotificationCountAction() : null;
    const initialUnreadCount = unreadResult?.success ? unreadResult.data : undefined;

    return (
        <>
            <HomeContent
                products={products}
                categories={categories}
                isAdmin={user?.role === "ADMIN"}
                isLoggedIn={!!user}
                initialCartCount={initialCartCount}
                initialUnreadCount={initialUnreadCount}
            />

            <NotificationPermissionDialog />
        </>
    )
};

