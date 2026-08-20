// "use client";

// import { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   adminListStoriesAction,
//   createStoryAction,
//   updateStoryAction,
//   deleteStoryAction,
// } from "@/server/story/admin-actions";
// import { adminListProductsAction } from "@/server/product/actions";
// import type { AdminStoryDTO, StoryMediaType } from "@/types/story";

// export function StoriesManager() {
//   const [editing, setEditing] = useState<AdminStoryDTO | "new" | null>(null);
//   const queryClient = useQueryClient();

//   const { data: stories, isLoading } = useQuery({
//     queryKey: ["admin-stories"],
//     queryFn: async () => {
//       const result = await adminListStoriesAction();
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   async function handleDelete(id: string) {
//     if (!confirm("این استوری حذف شود؟")) return;
//     await deleteStoryAction(id);
//     queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
//   }

//   return (
//     <div>
//       <button onClick={() => setEditing("new")} style={{ marginBottom: 16 }}>
//         + استوری جدید
//       </button>

//       {editing && (
//         <StoryForm
//           key={editing === "new" ? "new" : editing.id}
//           editing={editing === "new" ? null : editing}
//           onDone={() => {
//             setEditing(null);
//             queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
//           }}
//           onCancel={() => setEditing(null)}
//         />
//       )}

//       <hr style={{ margin: "24px 0" }} />

//       {isLoading && <p>در حال بارگذاری...</p>}

//       {stories && (
//         <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>پیش‌نمایش</th>
//               <th>توضیحات</th>
//               <th>تعداد بازدید</th>
//               <th>وضعیت</th>
//               <th>انقضا</th>
//               <th>عملیات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stories.map((s) => (
//               <tr key={s.id}>
//                 <td>
//                   {s.mediaType === "IMAGE" ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={s.mediaUrl} alt="" style={{ width: 50, height: 50, objectFit: "cover" }} />
//                   ) : (
//                     <video src={s.mediaUrl} style={{ width: 50, height: 50, objectFit: "cover" }} />
//                   )}
//                 </td>
//                 <td>{s.description ?? "-"}</td>
//                 <td>{s.seenCount}</td>
//                 <td>{s.isExpired ? "منقضی شده" : "فعال"}</td>
//                 <td>{new Date(s.expiresAt).toLocaleString("fa-IR")}</td>
//                 <td style={{ display: "flex", gap: 4 }}>
//                   <button onClick={() => setEditing(s)}>ویرایش</button>
//                   <button onClick={() => handleDelete(s.id)}>حذف</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// function StoryForm({
//   editing,
//   onDone,
//   onCancel,
// }: {
//   editing: AdminStoryDTO | null;
//   onDone: () => void;
//   onCancel: () => void;
// }) {
//   const [mediaType, setMediaType] = useState<StoryMediaType>(editing?.mediaType ?? "IMAGE");
//   const [mediaUrl, setMediaUrl] = useState(editing?.mediaUrl ?? "");
//   const [description, setDescription] = useState(editing?.description ?? "");
//   const [durationHours, setDurationHours] = useState(24);
//   const [linkedProductIds, setLinkedProductIds] = useState<string[]>(editing?.linkedProductIds ?? []);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data: products } = useQuery({
//     queryKey: ["admin-products-for-story"],
//     queryFn: async () => {
//       const result = await adminListProductsAction({ page: 1, pageSize: 200 });
//       return result.success ? result.data.items : [];
//     },
//   });

//   async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const isVideo = file.type.startsWith("video/");
//     setMediaType(isVideo ? "VIDEO" : "IMAGE");

//     setIsUploading(true);
//     setError(null);
//     const formData = new FormData();
//     formData.append("file", file);
//     const res = await fetch("/api/upload/story-media", { method: "POST", body: formData });
//     const data = await res.json();
//     setIsUploading(false);

//     if (!res.ok) {
//       setError(data.error ?? "خطا در آپلود فایل");
//       return;
//     }
//     setMediaUrl(data.url);
//   }

//   function toggleProduct(id: string) {
//     setLinkedProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);

//     if (!mediaUrl) {
//       setError("لطفاً یک فایل آپلود کنید.");
//       return;
//     }

//     setIsSubmitting(true);
//     const payload = { mediaType, mediaUrl, description: description || undefined, durationHours, linkedProductIds };
//     const result = editing
//       ? await updateStoryAction({ id: editing.id, ...payload })
//       : await createStoryAction(payload);
//     setIsSubmitting(false);

//     if (!result.success) {
//       setError(result.error);
//       return;
//     }
//     onDone();
//   }

//   return (
//     <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: 16 }}>
//       <h2>{editing ? "ویرایش استوری" : "استوری جدید"}</h2>

//       <label htmlFor="file">فایل (عکس یا ویدیو حداکثر ۳۰ ثانیه)</label>
//       <input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} />
//       {isUploading && <p>در حال آپلود...</p>}
//       {mediaUrl && (
//         <div style={{ marginTop: 8 }}>
//           {mediaType === "IMAGE" ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={mediaUrl} alt="" style={{ width: 100, height: 100, objectFit: "cover" }} />
//           ) : (
//             <video src={mediaUrl} style={{ width: 100, height: 100, objectFit: "cover" }} controls />
//           )}
//         </div>
//       )}

//       <label htmlFor="description">توضیحات (اختیاری)</label>
//       <textarea
//         id="description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         rows={2}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label htmlFor="duration">مدت نمایش (ساعت — پیش‌فرض ۲۴)</label>
//       <input
//         id="duration"
//         type="number"
//         min={1}
//         value={durationHours}
//         onChange={(e) => setDurationHours(Number(e.target.value))}
//         style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
//       />

//       <label>محصولات مرتبط (اختیاری)</label>
//       <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", padding: 8 }}>
//         {products?.map((p) => (
//           <label key={p.id} style={{ display: "block" }}>
//             <input
//               type="checkbox"
//               checked={linkedProductIds.includes(p.id)}
//               onChange={() => toggleProduct(p.id)}
//             />{" "}
//             {p.title}
//           </label>
//         ))}
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <button type="submit" disabled={isSubmitting || isUploading}>
//           {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد استوری"}
//         </button>
//         <button type="button" onClick={onCancel} style={{ marginRight: 8 }}>
//           انصراف
//         </button>
//       </div>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </form>
//   );
// }










"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  adminListStoriesAction,
  deleteStoryAction,
} from "@/server/story/admin-actions";
import type { AdminStoryDTO } from "@/types/story";
import { StoriesList } from "@/components/admin/stories/stories-list";
import { StoryFormSheet } from "@/components/admin/stories/story-form-sheet";
import { DeleteStoryDialog } from "@/components/admin/stories/delete-story-dialog";


export function StoriesManager() {
  const [editingStory, setEditingStory] = useState<AdminStoryDTO | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deletingStory, setDeletingStory] = useState<AdminStoryDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const result = await adminListStoriesAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  function openCreate() {
    setEditingStory(null);
    setIsSheetOpen(true);
  }

  function openEdit(story: AdminStoryDTO) {
    setEditingStory(story);
    setIsSheetOpen(true);
  }

  function handleFormDone() {
    setIsSheetOpen(false);
    setEditingStory(null);
    queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
  }

  async function handleConfirmDelete() {
    if (!deletingStory) return;
    setIsDeleting(true);
    const result = await deleteStoryAction(deletingStory.id);
    setIsDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("استوری حذف شد");
    setDeletingStory(null);
    queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
  }

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between gap-2.5">
        <p className="text-[12.5px] text-[#8E8E93]">
          {stories ? `${stories.length.toLocaleString("fa-IR")} استوری` : ""}
        </p>
        <button
          type="button"
          onClick={openCreate}
          aria-label="استوری جدید"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A7D5C] shadow-[0_8px_20px_-8px_rgba(10,125,92,0.6)] active:scale-95 transition-transform"
        >
          <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-4">
        <StoriesList
          stories={stories}
          isLoading={isLoading}
          isError={isError}
          onEdit={openEdit}
          onDelete={setDeletingStory}
        />
      </div>

      <StoryFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        editing={editingStory}
        onDone={handleFormDone}
      />

      <DeleteStoryDialog
        story={deletingStory}
        isDeleting={isDeleting}
        onCancel={() => setDeletingStory(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}