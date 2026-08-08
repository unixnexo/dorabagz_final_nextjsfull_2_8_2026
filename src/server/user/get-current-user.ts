import "server-only";
import { prisma } from "@/lib/prisma";
import { getEffectiveIdentity } from "@/server/auth/session";
import { toUserDTO } from "./user-mapper";
import type { UserDTO } from "@/types/user";

/**
 * Returns the currently logged-in user (respecting impersonation — if an
 * admin is impersonating, this returns the IMPERSONATED user, which is
 * what every page/component should use to render "current user" data).
 * Returns null if nobody is logged in.
 */
export async function getCurrentUser(): Promise<UserDTO | null> {
  const identity = await getEffectiveIdentity();
  if (!identity) return null;

  const user = await prisma.user.findUnique({ where: { id: identity.userId } });
  if (!user || !user.isActive) return null;

  return toUserDTO(user);
}
