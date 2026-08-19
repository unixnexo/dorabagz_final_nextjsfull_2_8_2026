// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { adminListProductsAction, setProductDeletedAction } from "@/server/product/actions";

// export function AdminProductsTable() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["admin-products", page, search],
//     queryFn: async () => {
//       const result = await adminListProductsAction({ page, pageSize: 20, search: search || undefined });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   async function handleToggleDeleted(id: string, currentlyDeleted: boolean) {
//     await setProductDeletedAction(id, !currentlyDeleted);
//     queryClient.invalidateQueries({ queryKey: ["admin-products"] });
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="جستجو بر اساس عنوان یا کد محصول..."
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setPage(1);
//         }}
//         style={{ width: "100%", padding: 8, margin: "16px 0" }}
//       />

//       {isLoading && <p>در حال بارگذاری...</p>}
//       {isError && <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>}

//       {data && (
//         <>
//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>عنوان</th>
//                 <th>کد محصول</th>
//                 <th>دسته</th>
//                 <th>قیمت</th>
//                 <th>موجودی</th>
//                 <th>وضعیت</th>
//                 <th>عملیات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((p) => (
//                 <tr key={p.id} style={{ opacity: p.isDeleted ? 0.5 : 1 }}>
//                   <td>{p.title}</td>
//                   <td>{p.productCode}</td>
//                   <td>{p.categoryTitle ?? "-"}</td>
//                   <td>
//                     {p.minPrice === p.maxPrice
//                       ? p.minPrice.toLocaleString("fa-IR")
//                       : `${p.minPrice.toLocaleString("fa-IR")} - ${p.maxPrice.toLocaleString("fa-IR")}`}
//                     {p.hasDiscount && (
//                       <span style={{ color: "#c0392b", fontSize: 11, marginRight: 6 }}>در حال تخفیف</span>
//                     )}
//                   </td>
//                   <td>{p.totalStock}</td>
//                   <td>{p.isDeleted ? "حذف شده" : "فعال"}</td>
//                   <td style={{ display: "flex", gap: 4 }}>
//                     <Link href={`/admin/products/${p.id}/edit`}>ویرایش</Link>
//                     <button onClick={() => handleToggleDeleted(p.id, p.isDeleted)}>
//                       {p.isDeleted ? "بازگردانی" : "حذف"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
//             <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
//               قبلی
//             </button>
//             <span>
//               صفحه {data.page} از {data.totalPages}
//             </span>
//             <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
//               بعدی
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListProductsAction,
  setProductDeletedAction,
} from "@/server/product/actions";

import { PaginationControl } from "@/components/admin/orders/pagination-control";
import { AdminSearchField } from "@/components/admin/orders/admin-search-field";
import { AdminFabLink } from "@/components/admin/products/admin-fab-link";
import { ProductsList } from "@/components/admin/products/products-list";

export function AdminProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products", page, debouncedSearch],
    queryFn: async () => {
      const result = await adminListProductsAction({
        page,
        pageSize: 20,
        search: debouncedSearch || undefined,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  async function handleToggleDeleted(id: string, currentlyDeleted: boolean) {
    await setProductDeletedAction(id, !currentlyDeleted);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  }

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2.5 pt-4">
        <div className="flex-1">
          <AdminSearchField
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="جستجو با عنوان یا کد محصول..."
          />
        </div>
        <AdminFabLink href="/admin/products/new" label="محصول جدید" />
      </div>

      <div className="mt-4">
        <ProductsList
          products={data?.items}
          isLoading={isLoading}
          isError={isError}
          onToggleDeleted={handleToggleDeleted}
        />
      </div>

      {data && (
        <PaginationControl
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

