"use client";

import { logoutAction } from "@/server/auth/logout-action";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">خروج از حساب</button>
    </form>
  );
}
