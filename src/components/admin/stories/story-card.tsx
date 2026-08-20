import { Eye, Play, Pencil, Trash2 } from "lucide-react";
import type { AdminStoryDTO } from "@/types/story";

export function StoryCard({
    story,
    onEdit,
    onDelete,
}: {
    story: AdminStoryDTO;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const expiresLabel = story.isExpired
        ? "منقضی شده"
        : new Date(story.expiresAt).toLocaleString("fa-IR", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/[0.05]">
                {story.mediaType === "IMAGE" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.mediaUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                    <>
                        <video src={story.mediaUrl} className="h-full w-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-4 w-4 fill-white text-white" strokeWidth={0} />
                        </div>
                    </>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] text-[#1C1C1E]">
                        {story.description || "بدون توضیحات"}
                    </p>
                    {story.isExpired && (
                        <span className="shrink-0 rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-semibold text-[#8E8E93]">
                            منقضی
                        </span>
                    )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-[10.5px] text-[#8E8E93]">
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" strokeWidth={2.25} />
                        {story.seenCount.toLocaleString("fa-IR")}
                    </span>
                    <span>·</span>
                    <span>{expiresLabel}</span>
                    {story.linkedProductIds.length > 0 && (
                        <>
                            <span>·</span>
                            <span>
                                {story.linkedProductIds.length.toLocaleString("fa-IR")} محصول مرتبط
                            </span>
                        </>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onEdit}
                aria-label="ویرایش"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05] active:bg-black/[0.08]"
            >
                <Pencil className="h-3.5 w-3.5 text-[#1C1C1E]" strokeWidth={2.25} />
            </button>

            <button
                type="button"
                onClick={onDelete}
                aria-label="حذف"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10 active:bg-[#FF3B30]/15"
            >
                <Trash2 className="h-3.5 w-3.5 text-[#FF3B30]" strokeWidth={2.25} />
            </button>
        </div>
    );
}