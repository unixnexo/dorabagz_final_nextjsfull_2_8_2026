// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { listMyOrdersAction } from "@/server/order/actions";
// import type { OrderStatus } from "@/types/order";

// const STATUS_LABELS: Record<OrderStatus, string> = {
//   PENDING: "در انتظار پرداخت",
//   CONFIRMED: "پرداخت شده",
//   COMPLETED: "تکمیل شده",
//   CANCELLED: "لغو شده",
// };

// export function OrdersList() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<OrderStatus | "">("");

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["my-orders", page, search, status],
//     queryFn: async () => {
//       const result = await listMyOrdersAction({
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
//       <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//         <input
//           type="text"
//           placeholder="جستجو بر اساس شماره سفارش..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
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
//           {data.items.length === 0 && <p>سفارشی یافت نشد.</p>}

//           <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>شماره سفارش</th>
//                 <th>تعداد اقلام</th>
//                 <th>مبلغ کل</th>
//                 <th>وضعیت</th>
//                 <th>تاریخ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.items.map((order) => (
//                 <tr key={order.id}>
//                   <td>
//                     <Link href={`/dashboard/orders/${order.id}`}>{order.id.slice(0, 8)}...</Link>
//                   </td>
//                   <td>{order.itemCount}</td>
//                   <td>{order.totalAmount.toLocaleString("fa-IR")} تومان</td>
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

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { listMyOrdersAction } from "@/server/order/actions";
import type { OrderStatus } from "@/types/order";

import { OrderFilters } from "./order-filters";
import { OrderCard } from "./order-card";
import { OrdersPagination } from "./orders-pagination";
import { OrdersEmptyState } from "./orders-empty-state";
import { OrdersSkeleton } from "./orders-skeleton";
import { SearchCommand } from "@/components/search-command";
import { BottomNav } from "@/components/bottom-nav";

export function OrdersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders", page, debouncedSearch, status],
    queryFn: async () => {
      const result = await listMyOrdersAction({
        page,
        pageSize: 20,
        search: debouncedSearch || undefined,
        status: status || undefined,
      });

      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: OrderStatus | "") {
    setStatus(value);
    setPage(1);
  }

  return (
    <div className="px-4">
      <OrderFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {isLoading && <OrdersSkeleton />}

      {isError && (
        <div className="rounded-[25px] bg-white px-5 py-8 text-center">
          <p className="text-[14px] text-red-500">خطا در دریافت سفارش‌ها</p>
        </div>
      )}

      {data && (
        <>
          {data.items.length === 0 ? (
            <OrdersEmptyState />
          ) : (
            <motion.div layout className="space-y-3">
              <AnimatePresence mode="popLayout">
                {data.items.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          <OrdersPagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <BottomNav
        searchOpen={searchOpen}
        onSearchClick={() => setSearchOpen(true)}
      />

    </div>
  );
}

