"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, clearImpersonationCookie } from "./session";

export async function logoutAction(): Promise<void> {
  // Clear both cookies — if an admin was impersonating, logging out fully
  // ends that too (they'd need to log in again as themselves).
  await clearSessionCookie();
  await clearImpersonationCookie();
  redirect("/login");
}
