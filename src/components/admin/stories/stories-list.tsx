import type { AdminStoryDTO } from "@/types/story";
import { StoryCard } from "./story-card";

export function StoriesList({
    stories,
    isLoading,
    isError,
    onEdit,
    onDelete,
}: {
    stories: AdminStoryDTO[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onEdit: (story: AdminStoryDTO) => void;
    onDelete: (story: AdminStoryDTO) => void;
}) {
    if (isError) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    خطا در دریافت اطلاعات
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2.5">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-[80px] animate-pulse rounded-3xl bg-white/70" />
                ))}
            </div>
        );
    }

    if (!stories || stories.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">هنوز استوری‌ای ثبت نشده</p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {stories.map((story) => (
                <StoryCard
                    key={story.id}
                    story={story}
                    onEdit={() => onEdit(story)}
                    onDelete={() => onDelete(story)}
                />
            ))}
        </div>
    );
}