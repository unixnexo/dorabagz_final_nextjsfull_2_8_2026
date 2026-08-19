import type { CategoryDTO } from "@/types/category";

export type CategoryTreeNode = {
    parent: CategoryDTO;
    children: CategoryDTO[];
};

// Groups a flat category list into parent nodes with their children nested.
// Categories whose parentId points to nothing in the list (orphaned/filtered
// out by search) are treated as top-level so nothing silently disappears.
export function buildCategoryTree(items: CategoryDTO[]): CategoryTreeNode[] {
    const byId = new Map(items.map((c) => [c.id, c]));
    const parents = items.filter(
        (c) => !c.parentId || !byId.has(c.parentId)
    );

    return parents.map((parent) => ({
        parent,
        children: items.filter((c) => c.parentId === parent.id),
    }));
}