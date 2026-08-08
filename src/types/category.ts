/**
 * Category DTOs.
 */

/** A category with no children info — used inside lists/dropdowns. */
export type CategoryDTO = {
  id: string;
  title: string;
  imageUrl: string | null;
  parentId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/** A top-level category with its children nested — used for the public
 *  category tree (e.g. a filter sidebar / menu) and the admin list. */
export type CategoryTreeDTO = CategoryDTO & {
  children: CategoryDTO[];
};
