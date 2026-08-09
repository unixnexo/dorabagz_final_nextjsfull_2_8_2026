"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from "@/server/coupon/actions";
import { adminListProductsAction } from "@/server/product/actions";
import { getCategoryTreeAction } from "@/server/category/actions";
import { listUsersAction } from "@/server/user/admin-actions";
import type { CouponDTO, CouponType, CouponScope } from "@/types/coupon";

export function CouponsManager() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CouponDTO | "new" | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons", search],
    queryFn: async () => {
      const result = await listCouponsAction({ page: 1, pageSize: 100, search: search || undefined });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("این کد تخفیف حذف شود؟")) return;
    const result = await deleteCouponAction(id);
    if (!result.success) {
      alert(result.error);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="جستجو بر اساس کد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setEditing("new")}>+ کد تخفیف جدید</button>
      </div>

      {editing && (
        <CouponForm
          key={editing === "new" ? "new" : editing.id}
          editing={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <hr style={{ margin: "24px 0" }} />

      {isLoading && <p>در حال بارگذاری...</p>}

      {data && (
        <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>کد</th>
              <th>نوع</th>
              <th>مقدار</th>
              <th>محدوده</th>
              <th>استفاده شده</th>
              <th>انقضا</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.type === "PERCENT" ? "درصدی" : "مبلغ ثابت"}</td>
                <td>{c.type === "PERCENT" ? `${c.value}%` : `${c.value.toLocaleString("fa-IR")} تومان`}</td>
                <td>
                  {c.scope === "ENTIRE_CART"
                    ? "کل سبد خرید"
                    : c.scope === "SPECIFIC_PRODUCTS"
                      ? `محصولات خاص (${c.productIds.length})`
                      : `دسته‌های خاص (${c.categoryIds.length})`}
                </td>
                <td>
                  {c.totalUsageCount} / {c.maxTotalUsage ?? "∞"}
                </td>
                <td>{new Date(c.expiresAt).toLocaleDateString("fa-IR")}</td>
                <td style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setEditing(c)}>ویرایش</button>
                  <button onClick={() => handleDelete(c.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CouponForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: CouponDTO | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(editing?.code ?? "");
  const [type, setType] = useState<CouponType>(editing?.type ?? "PERCENT");
  const [value, setValue] = useState(editing?.value ?? 10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | "">(
    editing?.maxDiscountAmount ?? ""
  );
  const [scope, setScope] = useState<CouponScope>(editing?.scope ?? "ENTIRE_CART");
  const [productIds, setProductIds] = useState<string[]>(editing?.productIds ?? []);
  const [categoryIds, setCategoryIds] = useState<string[]>(editing?.categoryIds ?? []);
  const [minOrderAmount, setMinOrderAmount] = useState<number | "">(editing?.minOrderAmount ?? "");
  const [maxUsesPerUser, setMaxUsesPerUser] = useState(editing?.maxUsesPerUser ?? 1);
  const [maxTotalUsage, setMaxTotalUsage] = useState<number | "">(editing?.maxTotalUsage ?? "");
  const [assignedUserId, setAssignedUserId] = useState(editing?.assignedUserId ?? "");
  const [expiresAt, setExpiresAt] = useState(
    editing ? new Date(editing.expiresAt).toISOString().slice(0, 16) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products-for-coupon"],
    queryFn: async () => {
      const result = await adminListProductsAction({ page: 1, pageSize: 200 });
      return result.success ? result.data.items : [];
    },
    enabled: scope === "SPECIFIC_PRODUCTS",
  });

  const { data: categories } = useQuery({
    queryKey: ["category-tree-for-coupon"],
    queryFn: async () => {
      const result = await getCategoryTreeAction();
      return result.success ? result.data : [];
    },
    enabled: scope === "SPECIFIC_CATEGORIES",
  });

  const { data: users } = useQuery({
    queryKey: ["users-for-coupon"],
    queryFn: async () => {
      const result = await listUsersAction({ page: 1, pageSize: 200 });
      return result.success ? result.data.items : [];
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      code: code.trim() || undefined,
      type,
      value,
      maxDiscountAmount: type === "PERCENT" && maxDiscountAmount !== "" ? Number(maxDiscountAmount) : null,
      scope,
      productIds: scope === "SPECIFIC_PRODUCTS" ? productIds : [],
      categoryIds: scope === "SPECIFIC_CATEGORIES" ? categoryIds : [],
      minOrderAmount: minOrderAmount !== "" ? Number(minOrderAmount) : null,
      maxUsesPerUser,
      maxTotalUsage: maxTotalUsage !== "" ? Number(maxTotalUsage) : null,
      assignedUserId: assignedUserId || null,
      expiresAt: new Date(expiresAt).toISOString(),
    };

    const result = editing
      ? await updateCouponAction({ id: editing.id, ...payload })
      : await createCouponAction(payload);

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onDone();
  }

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }
  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: 16, marginBottom: 16 }}>
      <h2>{editing ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}</h2>

      <label htmlFor="code">کد (اختیاری — در صورت خالی بودن به‌صورت خودکار تولید می‌شود)</label>
      <input
        id="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="type">نوع تخفیف</label>
      <select
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value as CouponType)}
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

      {/* maxDiscountAmount only makes sense for PERCENT — hidden for FIXED */}
      {type === "PERCENT" && (
        <>
          <label htmlFor="maxDiscount">حداکثر مبلغ تخفیف (تومان، اختیاری)</label>
          <input
            id="maxDiscount"
            type="number"
            value={maxDiscountAmount}
            onChange={(e) => setMaxDiscountAmount(e.target.value === "" ? "" : Number(e.target.value))}
            style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
          />
        </>
      )}

      <label htmlFor="scope">محدوده تخفیف</label>
      <select
        id="scope"
        value={scope}
        onChange={(e) => setScope(e.target.value as CouponScope)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      >
        <option value="ENTIRE_CART">کل سبد خرید</option>
        <option value="SPECIFIC_PRODUCTS">محصولات خاص</option>
        <option value="SPECIFIC_CATEGORIES">دسته‌بندی‌های خاص</option>
      </select>

      {/* Product/category pickers only shown (not grayed — hidden, cleaner UX)
          when their scope is selected */}
      {scope === "SPECIFIC_PRODUCTS" && (
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", padding: 8 }}>
          {products?.map((p) => (
            <label key={p.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={productIds.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
              />{" "}
              {p.title}
            </label>
          ))}
        </div>
      )}

      {scope === "SPECIFIC_CATEGORIES" && (
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
      )}

      <label htmlFor="minOrder">حداقل مبلغ سفارش (تومان، اختیاری)</label>
      <input
        id="minOrder"
        type="number"
        value={minOrderAmount}
        onChange={(e) => setMinOrderAmount(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="maxUsesPerUser">حداکثر استفاده هر کاربر</label>
      <input
        id="maxUsesPerUser"
        type="number"
        min={1}
        value={maxUsesPerUser}
        onChange={(e) => setMaxUsesPerUser(Number(e.target.value))}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="maxTotalUsage">حداکثر تعداد کل استفاده (اختیاری — مثلا فقط ۱۰ نفر اول)</label>
      <input
        id="maxTotalUsage"
        type="number"
        value={maxTotalUsage}
        onChange={(e) => setMaxTotalUsage(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <label htmlFor="assignedUser">مخصوص یک کاربر خاص (اختیاری)</label>
      <select
        id="assignedUser"
        value={assignedUserId}
        onChange={(e) => setAssignedUserId(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      >
        <option value="">همه کاربران</option>
        {users?.map((u) => (
          <option key={u.id} value={u.id}>
            {u.phoneNumber} {u.fullName ? `(${u.fullName})` : ""}
          </option>
        ))}
      </select>

      <label htmlFor="expiresAt">تاریخ و ساعت انقضا</label>
      <input
        id="expiresAt"
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        style={{ display: "block", width: "100%", margin: "8px 0", padding: 8 }}
      />

      <div style={{ marginTop: 16 }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد کد تخفیف"}
        </button>
        <button type="button" onClick={onCancel} style={{ marginRight: 8 }}>
          انصراف
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
