"use server";

import { getSession } from "@/server/auth/session";
import { getAdminDashboardOverview } from "./dashboard-queries";
import type { ActionResult } from "@/server/auth/actions";
import type { AdminDashboardOverviewDTO } from "@/types/dashboard";

export async function getAdminDashboardOverviewAction(): Promise<
  ActionResult<AdminDashboardOverviewDTO>
> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { success: false, error: "دسترسی غیرمجاز." };

  return { success: true, data: await getAdminDashboardOverview() };
}
