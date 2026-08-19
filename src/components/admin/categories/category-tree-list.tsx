import type { CategoryDTO } from "@/types/category";
import { buildCategoryTree } from "./build-category-tree";
import { CategoryRow } from "./category-row";

export function CategoryTreeList({
    items,
    onEdit,
    onDelete,
}: {
    items: CategoryDTO[];
    onEdit: (category: CategoryDTO) => void;
    onDelete: (category: CategoryDTO) => void;
}) {
    if (items.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">دسته‌بندی‌ای پیدا نشد</p>
            </div>
        );
    }

    const tree = buildCategoryTree(items);

    return (
        <div className="space-y-2.5">
            {tree.map(({ parent, children }) => {
                const rows = [parent, ...children];
                return (
                    <div
                        key={parent.id}
                        className="overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                        {rows.map((cat, index) => (
                            <CategoryRow
                                key={cat.id}
                                category={cat}
                                isChild={cat.id !== parent.id}
                                isLast={index === rows.length - 1}
                                onEdit={() => onEdit(cat)}
                                onDelete={() => onDelete(cat)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}