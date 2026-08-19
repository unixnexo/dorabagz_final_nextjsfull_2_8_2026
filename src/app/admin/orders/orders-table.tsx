// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { adminListOrdersAction } from "@/server/order/actions";
// import type { OrderStatus } from "@/types/order";

// const STATUS_LABELS: Record<OrderStatus, string> = {
//   PENDING: "در انتظار پرداخت",
//   CONFIRMED: "پرداخت شده",
//   COMPLETED: "تکمیل شده",
//   CANCELLED: "لغو شده",
// };

// const COURIER_LABELS: Record<string, string> = {
//   SNAPP_BOX: "اسنپ‌باکس",
//   TIPAX: "تیپاکس",
// };

// export function AdminOrdersTable() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<OrderStatus | "">("");

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["admin-orders", page, search, status],
//     queryFn: async () => {
//       const result = await adminListOrdersAction({
//         page,
//         pageSize: 20,
//         search: search || undefined,
//         status: status || undefined,
//       });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   return (
//     <div>
//       <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
//         <input
//           type="text"
//           placeholder="جستجو بر اساس شماره سفارش، نام یا شماره گیرنده..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//           style={{ flex: 1 }}
//         />
//         <select
//           value={status}
//           onChange={(e) => {
//             setStatus(e.target.value as OrderStatus | "");
//             setPage(1);
//           }}
//         >
//           <option value="">همه وضعیت‌ها</option>
//           {Object.entries(STATUS_LABELS).map(([value, label]) => (
//             <option key={value} value={value}>
//               {label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {isLoading && <p>در حال بارگذاری...</p>}
//       {isError && <p style={{ color: "red" }}>خطا در دریافت اطلاعات</p>}

//       {data && (
//         <>
//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>شماره سفارش</th>
//                 <th>تعداد اقلام</th>
//                 <th>مبلغ کل</th>
//                 <th>روش ارسال</th>
//                 <th>وضعیت</th>
//                 <th>تاریخ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <Link href={`/admin/orders/${order.id}`}>{order.id.slice(0, 8)}...</Link>
//                   </td>
//                   <td>{order.itemCount}</td>
//                   <td>{order.totalAmount.toLocaleString("fa-IR")} تومان</td>
//                   <td>{COURIER_LABELS[order.courierType]}</td>
//                   <td>{STATUS_LABELS[order.status]}</td>
//                   <td>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminListOrdersAction } from "@/server/order/actions";
import type { OrderStatus } from "@/types/order";

import { OrderStatusFilter } from "@/components/admin/orders/order-status-filter";
import { OrdersList } from "@/components/admin/orders/orders-list";
import { PaginationControl } from "@/components/admin/orders/pagination-control";
import { AdminSearchField } from "@/components/admin/orders/admin-search-field";

export function AdminOrdersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-orders", page, search, status],
    queryFn: async () => {
      const result = await adminListOrdersAction({
        page,
        pageSize: 20,
        search: search || undefined,
        status: status || undefined,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  return (
    <div className="pb-4">
      <div className="space-y-2.5 pt-4">
        <AdminSearchField
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="جستجو با شماره سفارش، نام یا شماره گیرنده..."
        />

        <OrderStatusFilter
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-4">
        <OrdersList orders={data?.items} isLoading={isLoading} isError={isError} />
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


