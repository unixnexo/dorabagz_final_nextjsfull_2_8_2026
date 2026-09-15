export type DiscountStatus = "active" | "scheduled" | "expired" | "disabled";

export function getDiscountStatus(group: {
    isActive: boolean;
    startAt: string | null;
    endAt: string | null;
}): DiscountStatus {
    if (!group.isActive) return "disabled";
    const now = Date.now();
    if (group.startAt && new Date(group.startAt).getTime() > now) return "scheduled";
    if (group.endAt && new Date(group.endAt).getTime() < now) return "expired";
    return "active";
}

export const STATUS_LABEL: Record<DiscountStatus, string> = {
    active: "فعال",
    scheduled: "زمان‌بندی شده",
    expired: "منقضی شده",
    disabled: "غیرفعال",
};

export const STATUS_COLOR: Record<DiscountStatus, { bg: string; text: string }> = {
    active: { bg: "bg-brand-primary/10", text: "text-brand-primary" },
    scheduled: { bg: "bg-[#FF9F0A]/10", text: "text-[#FF9F0A]" },
    expired: { bg: "bg-black/[0.05]", text: "text-[#8E8E93]" },
    disabled: { bg: "bg-black/[0.05]", text: "text-[#8E8E93]" },
};
