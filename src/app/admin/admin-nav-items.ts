import type { LucideIcon } from "lucide-react";
import {
    BarChart3,
    Users,
    BookOpen,
    Star,
    Package,
    ShoppingBag,
    Percent,
    Ticket,
    LayoutGrid,
    Telescope,
} from "lucide-react";

export type AdminNavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

// Single source of truth for the admin nav sheet.
// Add a page here and it shows up in the sheet automatically.
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
    { href: "/admin", label: "نمای کلی", icon: Telescope },
    { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3 },
    { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
    { href: "/admin/products", label: "محصولات", icon: Package },
    { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: LayoutGrid },
    { href: "/admin/users", label: "کاربران", icon: Users },
    { href: "/admin/reviews", label: "نظرات", icon: Star },
    { href: "/admin/stories", label: "استوری‌ها", icon: BookOpen },
    { href: "/admin/discounts", label: "تخفیف‌ها", icon: Percent },
    { href: "/admin/coupons", label: "کد‌های تخفیف", icon: Ticket },
];

// Looks up the page title for the current route, falling back to a default.
// export function getAdminPageTitle(pathname: string): string {
//     const match = ADMIN_NAV_ITEMS.find((item) => pathname.startsWith(item.href));
//     return match?.label ?? "پنل مدیریت";
// }


export function getAdminPageTitle(pathname: string): string {
    const match = ADMIN_NAV_ITEMS.find((item) =>
        item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
    );

    return match?.label ?? "پنل مدیریت";
}
