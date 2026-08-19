// "use client";

// import { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   listCategoriesAction,
//   createCategoryAction,
//   updateCategoryAction,
//   deleteCategoryAction,
// } from "@/server/category/actions";
// import { uploadProductMedia } from "@/lib/upload-client";
// import type { CategoryDTO } from "@/types/category";

// export function CategoriesManager() {
//   const [search, setSearch] = useState("");
//   const [editing, setEditing] = useState<CategoryDTO | null>(null);
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-categories", search],
//     queryFn: async () => {
//       const result = await listCategoriesAction({ page: 1, pageSize: 100, search: search || undefined });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   // Only top-level categories can be picked as a parent (2-level max rule).
//   const topLevelOptions = data?.items.filter((c) => !c.parentId) ?? [];

//   async function handleDelete(id: string) {
//     if (!confirm("حذف این دسته؟")) return;
//     const result = await deleteCategoryAction(id);
//     if (!result.success) {
//       alert(result.error);
//       return;
//     }
//     queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="جستجو..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ width: "100%", padding: 8, marginBottom: 16 }}
//       />

//       <CategoryForm
//         key={editing?.id ?? "new"}
//         editing={editing}
//         parentOptions={topLevelOptions}
//         onDone={() => {
//           setEditing(null);
//           queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
//         }}
//         onCancel={() => setEditing(null)}
//       />

//       <hr style={{ margin: "24px 0" }} />

//       {isLoading && <p>در حال بارگذاری...</p>}

//       {data && (
//         <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>عنوان</th>
//               <th>والد</th>
//               <th>عملیات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.items.map((cat) => (
//               <tr key={cat.id}>
//                 <td>{cat.parentId ? `— ${cat.title}` : cat.title}</td>
//                 <td>{cat.parentId ? data.items.find((c) => c.id === cat.parentId)?.title ?? "-" : "-"}</td>
//                 <td style={{ display: "flex", gap: 4 }}>
//                   <button onClick={() => setEditing(cat)}>ویرایش</button>
//                   <button onClick={() => handleDelete(cat.id)}>حذف</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// function CategoryForm({
//   editing,
//   parentOptions,
//   onDone,
//   onCancel,
// }: {
//   editing: CategoryDTO | null;
//   parentOptions: CategoryDTO[];
//   onDone: () => void;
//   onCancel: () => void;
// }) {
//   const [title, setTitle] = useState(editing?.title ?? "");
//   const [parentId, setParentId] = useState(editing?.parentId ?? "");
//   const [imageUrl, setImageUrl] = useState(editing?.imageUrl ?? "");
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setIsUploading(true);
//     const result = await uploadProductMedia(file);
//     setIsUploading(false);
//     if ("error" in result) {
//       setError(result.error);
//       return;
//     }
//     setImageUrl(result.url);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);

//     const payload = { title, imageUrl: imageUrl || null, parentId: parentId || null };
//     const result = editing
//       ? await updateCategoryAction({ id: editing.id, ...payload })
//       : await createCategoryAction(payload);

//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     onDone();
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>{editing ? "ویرایش دسته" : "دسته جدید"}</h2>

//       <label htmlFor="title">عنوان</label>
//       <input
//         id="title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="parent">دسته والد (اختیاری)</label>
//       <select
//         id="parent"
//         value={parentId}
//         onChange={(e) => setParentId(e.target.value)}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       >
//         <option value="">بدون والد (سطح اول)</option>
//         {parentOptions
//           .filter((p) => p.id !== editing?.id)
//           .map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.title}
//             </option>
//           ))}
//       </select>

//       <label htmlFor="image">تصویر (اختیاری)</label>
//       <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
//       {isUploading && <p>در حال آپلود...</p>}
//       {imageUrl && (
//         // eslint-disable-next-line @next/next/no-img-element
//         <img src={imageUrl} alt="" style={{ width: 80, height: 80, objectFit: "cover", display: "block", marginTop: 8 }} />
//       )}

//       <div style={{ marginTop: 16 }}>
//         <button type="submit">{editing ? "ذخیره تغییرات" : "ایجاد دسته"}</button>
//         {editing && (
//           <button type="button" onClick={onCancel} style={{ marginRight: 8 }}>
//             انصراف
//           </button>
//         )}
//       </div>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// }





"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listCategoriesAction,
  deleteCategoryAction,
} from "@/server/category/actions";
import type { CategoryDTO } from "@/types/category";

import { CategoriesToolbar } from "@/components/admin/categories/categories-toolbar";
import { CategoryTreeList } from "@/components/admin/categories/category-tree-list";
import { CategoryListSkeleton } from "@/components/admin/categories/category-list-skeleton";
import { CategoryFormSheet } from "@/components/admin/categories/category-form-sheet";
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog";

export function CategoriesManager() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories", search],
    queryFn: async () => {
      const result = await listCategoriesAction({
        page: 1,
        pageSize: 100,
        search: search || undefined,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  // Only top-level categories can be picked as a parent (2-level max rule).
  const topLevelOptions = data?.items.filter((c) => !c.parentId) ?? [];

  function openCreateForm() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEditForm(category: CategoryDTO) {
    setEditing(category);
    setFormOpen(true);
  }

  function handleFormSaved() {
    setFormOpen(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    const result = await deleteCategoryAction(deleteTarget.id);
    setIsDeleting(false);

    if (!result.success) {
      setDeleteError(result.error);
      return;
    }
    setDeleteTarget(null);
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  return (
    <div className="pb-4">
      <CategoriesToolbar
        search={search}
        onSearchChange={setSearch}
        onAddClick={openCreateForm}
      />

      <div className="mt-4">
        {isLoading ? (
          <CategoryListSkeleton />
        ) : (
          <CategoryTreeList
            items={data?.items ?? []}
            onEdit={openEditForm}
            onDelete={(category) => {
              setDeleteError(null);
              setDeleteTarget(category);
            }}
          />
        )}
      </div>

      <CategoryFormSheet
        open={formOpen}
        editing={editing}
        parentOptions={topLevelOptions}
        onOpenChange={setFormOpen}
        onSaved={handleFormSaved}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}

