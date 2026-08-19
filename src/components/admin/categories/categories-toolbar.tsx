import { CategorySearchField } from "./category-search-field";
import { AddCategoryButton } from "./add-category-button";

export function CategoriesToolbar({
    search,
    onSearchChange,
    onAddClick,
}: {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
}) {
    return (
        <div className="flex items-center gap-2.5 pt-4">
            <div className="flex-1">
                <CategorySearchField value={search} onChange={onSearchChange} />
            </div>
            <AddCategoryButton onClick={onAddClick} />
        </div>
    );
}