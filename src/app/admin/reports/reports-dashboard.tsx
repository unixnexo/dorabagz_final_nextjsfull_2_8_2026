// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getIncomeSummaryAction,
//   getIncomeReportAction,
//   getTopProductsAction,
//   getTopCustomersAction,
// } from "@/server/reports/actions";
// import type { ReportRangePreset, IncomeSummaryDTO } from "@/types/report";

// const PRESET_LABELS: Record<ReportRangePreset, string> = {
//   TODAY: "امروز",
//   THIS_WEEK: "این هفته",
//   THIS_MONTH: "این ماه",
//   THIS_YEAR: "امسال",
//   CUSTOM: "بازه دلخواه",
// };

// function toman(n: number) {
//   return `${n.toLocaleString("fa-IR")} تومان`;
// }

// export function ReportsDashboard() {
//   const [preset, setPreset] = useState<ReportRangePreset>("THIS_MONTH");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const { data: summary, isLoading: summaryLoading } = useQuery({
//     queryKey: ["report-summary"],
//     queryFn: async () => {
//       const result = await getIncomeSummaryAction();
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//   });

//   const { data: report, isLoading: reportLoading, isError: reportError } = useQuery({
//     queryKey: ["report-range", preset, startDate, endDate],
//     queryFn: async () => {
//       const result = await getIncomeReportAction({
//         preset,
//         startDate: preset === "CUSTOM" ? startDate : undefined,
//         endDate: preset === "CUSTOM" ? endDate : undefined,
//       });
//       if (!result.success) throw new Error(result.error);
//       return result.data;
//     },
//     enabled: preset !== "CUSTOM" || (!!startDate && !!endDate),
//   });

//   const { data: topProducts } = useQuery({
//     queryKey: ["top-products"],
//     queryFn: async () => {
//       const result = await getTopProductsAction();
//       return result.success ? result.data : [];
//     },
//   });

//   const { data: topCustomers } = useQuery({
//     queryKey: ["top-customers"],
//     queryFn: async () => {
//       const result = await getTopCustomersAction();
//       return result.success ? result.data : [];
//     },
//   });

//   return (
//     <div>
//       {/* --- Always-visible summary --- */}
//       <section style={{ display: "flex", gap: 16, marginBottom: 32 }}>
//         <SummaryCard label="درآمد امروز" value={summary} loading={summaryLoading} field="today" />
//         <SummaryCard label="درآمد این ماه" value={summary} loading={summaryLoading} field="month" />
//         <SummaryCard label="درآمد امسال" value={summary} loading={summaryLoading} field="year" />
//       </section>

//       {/* --- Flexible range report --- */}
//       <section style={{ marginBottom: 32 }}>
//         <h2>گزارش بازه زمانی</h2>
//         <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//           {(Object.keys(PRESET_LABELS) as ReportRangePreset[]).map((p) => (
//             <button
//               key={p}
//               onClick={() => setPreset(p)}
//               style={{ fontWeight: preset === p ? "bold" : "normal" }}
//             >
//               {PRESET_LABELS[p]}
//             </button>
//           ))}
//         </div>

//         {preset === "CUSTOM" && (
//           <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//             <label>
//               از: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             </label>
//             <label>
//               تا: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//             </label>
//           </div>
//         )}

//         {reportLoading && <p>در حال بارگذاری...</p>}
//         {reportError && <p style={{ color: "red" }}>خطا در دریافت گزارش</p>}

//         {report && (
//           <>
//             <p>
//               مجموع درآمد: {toman(report.totalIncome)} | تعداد سفارش: {report.totalOrders} | تعداد کالای فروخته
//               شده: {report.unitsSold}
//             </p>
//             <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   <th>بازه</th>
//                   <th>درآمد</th>
//                   <th>تعداد سفارش</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.breakdown.map((point) => (
//                   <tr key={point.label}>
//                     <td>{point.label}</td>
//                     <td>{toman(point.income)}</td>
//                     <td>{point.orderCount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </section>

//       {/* --- Top 10 products --- */}
//       <section style={{ marginBottom: 32 }}>
//         <h2>پرفروش‌ترین محصولات (۱۰ محصول برتر)</h2>
//         <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>رتبه</th>
//               <th>محصول</th>
//               <th>تعداد فروخته شده</th>
//               <th>درآمد</th>
//             </tr>
//           </thead>
//           <tbody>
//             {topProducts?.map((p, i) => (
//               <tr key={p.productId ?? p.productTitle}>
//                 <td>{i + 1}</td>
//                 <td>{p.productTitle}</td>
//                 <td>{p.unitsSold}</td>
//                 <td>{toman(p.revenue)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* --- Top 10 customers --- */}
//       <section>
//         <h2>مشتریان برتر (۱۰ نفر برتر)</h2>
//         <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>رتبه</th>
//               <th>شماره موبایل</th>
//               <th>نام</th>
//               <th>تعداد سفارش</th>
//               <th>مجموع خرید</th>
//             </tr>
//           </thead>
//           <tbody>
//             {topCustomers?.map((c, i) => (
//               <tr key={c.userId}>
//                 <td>{i + 1}</td>
//                 <td>{c.phoneNumber}</td>
//                 <td>{c.fullName ?? "-"}</td>
//                 <td>{c.orderCount}</td>
//                 <td>{toman(c.totalSpent)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }

// function SummaryCard({
//   label,
//   value,
//   loading,
//   field,
// }: {
//   label: string;
//   value: IncomeSummaryDTO | undefined;
//   loading: boolean;
//   field: "today" | "month" | "year";
// }) {
//   const income = value ? value[`${field}Income`] : 0;
//   const count = value ? value[`${field}OrderCount`] : 0;

//   return (
//     <div style={{ border: "1px solid #ddd", padding: 16, flex: 1 }}>
//       <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{label}</p>
//       {loading ? <p>...</p> : <h2 style={{ margin: "4px 0" }}>{toman(income)}</h2>}
//       {!loading && <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{count} سفارش</p>}
//     </div>
//   );
// }









"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getIncomeSummaryAction,
  getIncomeReportAction,
  getTopProductsAction,
  getTopCustomersAction,
} from "@/server/reports/actions";
import type { ReportRangePreset } from "@/types/report";

import { IncomeSummaryCards } from "@/components/admin/reports/income-summary-cards";
import { RangePresetPicker } from "@/components/admin/reports/range-preset-picker";
import { CustomRangeInputs } from "@/components/admin/reports/custom-range-inputs";
import { RangeReportCard } from "@/components/admin/reports/range-report-card";
import { TopProductsList } from "@/components/admin/reports/top-products-list";
import { TopCustomersList } from "@/components/admin/reports/top-customers-list";
import { SectionHeading } from "@/components/admin/reports/section-heading";

export function ReportsDashboard() {
  const [preset, setPreset] = useState<ReportRangePreset>("THIS_MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-summary"],
    queryFn: async () => {
      const result = await getIncomeSummaryAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
  } = useQuery({
    queryKey: ["report-range", preset, startDate, endDate],
    queryFn: async () => {
      const result = await getIncomeReportAction({
        preset,
        startDate: preset === "CUSTOM" ? startDate : undefined,
        endDate: preset === "CUSTOM" ? endDate : undefined,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: preset !== "CUSTOM" || (!!startDate && !!endDate),
  });

  const { data: topProducts } = useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      const result = await getTopProductsAction();
      return result.success ? result.data : [];
    },
  });

  const { data: topCustomers } = useQuery({
    queryKey: ["top-customers"],
    queryFn: async () => {
      const result = await getTopCustomersAction();
      return result.success ? result.data : [];
    },
  });

  return (
    <div className="pb-4">
      <IncomeSummaryCards summary={summary} loading={summaryLoading} />

      <section className="mt-7">
        <SectionHeading title="گزارش بازه زمانی" />
        <RangePresetPicker value={preset} onChange={setPreset} />

        {preset === "CUSTOM" && (
          <CustomRangeInputs
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}

        <RangeReportCard report={report} loading={reportLoading} error={reportError} />
      </section>

      <section className="mt-7">
        <SectionHeading title="پرفروش‌ترین محصولات" subtitle="۱۰ محصول برتر" />
        <TopProductsList products={topProducts} />
      </section>

      <section className="mt-7">
        <SectionHeading title="مشتریان برتر" subtitle="۱۰ نفر برتر" />
        <TopCustomersList customers={topCustomers} />
      </section>
    </div>
  );
}
