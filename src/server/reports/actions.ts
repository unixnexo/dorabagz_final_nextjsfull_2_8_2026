"use server";

import { getSession } from "@/server/auth/session";
import { reportRangeQuerySchema } from "@/lib/validations/report";
import {
  getIncomeSummary,
  getIncomeReport,
  getTopProducts,
  getTopCustomers,
} from "./report-queries";
import type { ActionResult } from "@/server/auth/actions";
import type {
  IncomeSummaryDTO,
  IncomeReportDTO,
  TopProductDTO,
  TopCustomerDTO,
} from "@/types/report";

async function requireAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.role === "ADMIN";
}

export async function getIncomeSummaryAction(): Promise<ActionResult<IncomeSummaryDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };
  return { success: true, data: await getIncomeSummary() };
}

export async function getIncomeReportAction(input: unknown): Promise<ActionResult<IncomeReportDTO>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };

  const parsed = reportRangeQuerySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  return { success: true, data: await getIncomeReport(parsed.data) };
}

export async function getTopProductsAction(): Promise<ActionResult<TopProductDTO[]>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };
  return { success: true, data: await getTopProducts(10) };
}

export async function getTopCustomersAction(): Promise<ActionResult<TopCustomerDTO[]>> {
  if (!(await requireAdmin())) return { success: false, error: "دسترسی غیرمجاز." };
  return { success: true, data: await getTopCustomers(10) };
}
