"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listDiscountGroupsAction,
  createDiscountGroupAction,
  updateDiscountGroupAction,
  removeProductFromGroupAction,
  removeCategoryFromGroupAction,
  deleteDiscountGroupAction,
} from "@/server/discount/actions";
import { adminListProductsAction } from "@/server/product/actions";
import { getCategoryTreeAction } from "@/server/category/actions";
import type { DiscountGroupDTO, DiscountType } from "@/types/discount";

export function DiscountsManager() {
  const [editing, setEditing] = useState<DiscountGroupDTO | "new" | null>(null);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ["admin-discount-groups"],
    queryFn: async () => {
      const result = await listDiscountGroupsAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-discount-groups"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("این گروه تخفیف حذف شود؟ تخفیف از تمام اعضای آن برداشته می‌شود.")) return;
    await deleteDiscountGroupAction(id);
    invalidate();
  }

  async function handleRemoveProduct(groupId: string, productId: string) {
    await removeProductFromGroupAction(groupId, productId);
    invalidate();
  }

  async function handleRemoveCategory(groupId: string, categoryId: string) {
    await removeCategoryFromGroupAction(groupId, categoryId);
    invalidate();
  }

  return (
    <div>
      <button onClick={() => setEditing("new")} style={{ marginBottom: 16 }}>
        + گروه تخفیف جدید
      </button>

      {editing && (
        <DiscountForm
          key={editing === "new" ? "new" : editing.id}
          editing={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            invalidate();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <hr style={{ margin: "24px 0" }} />

      {isLoading && <p>در حال بارگذاری...</p>}
      {groups && groups.length === 0 && <p>هیچ گروه تخفیفی وجود ندارد.</p>}

      {groups?.map((g) => (
        <div key={g.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{g.title}</strong>{" "}
              <span style={{ color: g.isActive ? "green" : "#999" }}>
                {g.isActive ? "فعال" : "غیرفعال"}
              </span>
              <p style={{ margin: "4px 0" }}>
                {g.type === "PERCENT" ? `${g.value}٪ تخفیف` : `${g.value.toLocaleString("fa-IR")} تومان تخفیف`}
                {g.startAt && ` | از ${new Date(g.startAt).toLocaleString("fa-IR")}`}
                {g.endAt && ` | تا ${new Date(g.endAt).toLocaleString("fa-IR")}`}
              </p>
            </div>
            <div>
              <button onClick={() => setEditing(g)}>ویرایش گروه</button>
              <button onClick={() => handleDelete(g.id)} style={{ marginRight: 4 }}>
                حذف گروه
              </button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>محصولات:</strong>{" "}
            {g.productIds.length === 0 && "—"}
            {g.productIds.map((id, i) => (
              <span key={id} style={{ display: "inline-block", background: "#eee", padding: "2px 6px", margin: 2 }}>
                {g.productTitles[i]}{" "}
                <button onClick={() => handleRemoveProduct(g.id, id)} style={{ fontSize: 10 }}>
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div style={{ marginTop: 4 }}>
            <strong>دسته‌بندی‌ها:</strong>{" "}
            {g.categoryIds.length === 0 && "—"}
            {g.categoryIds.map((id, i) => (
              <span key={id} style={{ display: "inline-block", background: "#eee", padding: "2px 6px", margin: 2 }}>
                {g.categoryTitles[i]}{" "}
                <button onClick={() => handleRemoveCategory(g.id, id)} style={{ fontSize: 10 }}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiscountForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: DiscountGroupDTO | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [type, setType] = useState<DiscountType>(editing?.type ?? "PERCENT");
  const [value, setValue] = useState(editing?.value ?? 10);
  const [startAt, setStartAt] = useState(editing?.startAt ? editing.startAt.slice(0, 16) : "");
  const [endAt, setEndAt] = useState(editing?.endAt ? editing.endAt.slice(0, 16) : "");
  const [productIds, setProductIds] = useState<string[]>(editing?.productIds ?? []);
  const [categoryIds, setCategoryIds] = useState<string[]>(editing?.categoryIds ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products-for-discount"],
    queryFn: async () => {
      const result = await adminListProductsAction({ page: 1, pageSize: 200 });
      return result.success ? result.data.items : [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["category-tree-for-discount"],
    queryFn: async () => {
      const result = await getCategoryTreeAction();
      return result.success ? result.data : [];
    },
  });

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }
  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      title,
      type,
      value,
      startAt: startAt || null,
      endAt: endAt || null,
      productIds,
      categoryIds,
    };

    const result = editing
      ? await updateDiscountGroupAction({ id: editing.id, ...payload })
      : await createDiscountGroupAction(payload);

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 16 }}>
      <h2>{editing ? "ویرایش گروه تخفیف" : "گروه تخفیف جدید"}</h2>

      <label htmlFor="title">عنوان (فقط برای مدیر، به مشتری نمایش داده نمی‌شود)</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="type">نوع تخفیف</label>
      <select
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value as DiscountType)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      >
        <option value="PERCENT">درصدی</option>
        <option value="FIXED">مبلغ ثابت (تومان)</option>
      </select>

      <label htmlFor="value">{type === "PERCENT" ? "درصد تخفیف (۱ تا ۱۰۰)" : "مبلغ تخفیف (تومان)"}</label>
      <input
        id="value"
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="startAt">شروع (اختیاری — خالی یعنی همین الان فعال)</label>
      <input
        id="startAt"
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="endAt">پایان (اختیاری — خالی یعنی تا زمان حذف دستی فعال می‌ماند)</label>
      <input
        id="endAt"
        type="datetime-local"
        value={endAt}
        onChange={(e) => setEndAt(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label>محصولات مشمول تخفیف</label>
      <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
        {products?.map((p) => (
          <label key={p.id} style={{ display: "block" }}>
            <input type="checkbox" checked={productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} />{" "}
            {p.title}
          </label>
        ))}
      </div>

      <label>دسته‌بندی‌های مشمول تخفیف (شامل زیردسته‌ها هم می‌شود)</label>
      <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", padding: 8 }}>
        {categories?.map((cat) => (
          <div key={cat.id}>
            <label style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={categoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />{" "}
              {cat.title}
            </label>
            {cat.children.map((child) => (
              <label key={child.id} style={{ display: "block", marginRight: 16 }}>
                <input
                  type="checkbox"
                  checked={categoryIds.includes(child.id)}
                  onChange={() => toggleCategory(child.id)}
                />{" "}
                {child.title}
              </label>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد گروه تخفیف"}
        </button>
        <button type="button" onClick={onCancel} style={{ marginRight: 8 }}>
          انصراف
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
