import { z } from "zod";

export const reportRangeQuerySchema = z
  .object({
    preset: z.enum(["TODAY", "THIS_WEEK", "THIS_MONTH", "THIS_YEAR", "CUSTOM"]),
    // Only required/used when preset = CUSTOM
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => data.preset !== "CUSTOM" || (data.startDate && data.endDate),
    { message: "برای بازه دلخواه، تاریخ شروع و پایان الزامی است.", path: ["startDate"] }
  )
  .refine(
    (data) =>
      data.preset !== "CUSTOM" ||
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate).getTime() <= new Date(data.endDate).getTime(),
    { message: "تاریخ شروع باید قبل از تاریخ پایان باشد.", path: ["startDate"] }
  );
export type ReportRangeQuery = z.infer<typeof reportRangeQuerySchema>;
