import type { OrderStatus } from "@/types/order";

export const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "در انتظار پرداخت",
    CONFIRMED: "پرداخت شده",
    COMPLETED: "تکمیل شده",
    CANCELLED: "لغو شده",
};

// Tailwind-safe static classes (bg + text) per status, iOS system colors.
export const STATUS_STYLES: Record<OrderStatus, string> = {
    PENDING: "bg-[#FF9500]/12 text-[#B25E00]",
    CONFIRMED: "bg-[#0A84FF]/12 text-[#0064CC]",
    COMPLETED: "bg-brand-primary/12 text-brand-primary",
    CANCELLED: "bg-[#FF3B30]/12 text-[#FF3B30]",
};

export const COURIER_LABELS: Record<string, string> = {
    SNAPP_BOX: "اسنپ‌باکس",
    TIPAX: "تیپاکس",
};

export const COURIER_LABELS_DETAILED: Record<string, string> = {
    SNAPP_BOX: "اسنپ‌باکس (پس‌کرایه)",
    TIPAX: "تیپاکس (پس‌کرایه)",
};