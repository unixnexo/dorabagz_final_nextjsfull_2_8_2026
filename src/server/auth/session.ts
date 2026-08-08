import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRY_DAYS,
  IMPERSONATION_COOKIE_NAME,
  IMPERSONATION_EXPIRY_HOURS,
} from "./constants";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

// ---------------------------------------------------------------------------
// Shape of data we store inside the JWT payload.
// ---------------------------------------------------------------------------
export type SessionPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

export type ImpersonationPayload = {
  userId: string; // the impersonated user
  role: "USER" | "ADMIN"; // always "USER" in practice
  impersonatedBy: string; // the admin's userId
};

// ---------------------------------------------------------------------------
// Normal login session (30 days)
// ---------------------------------------------------------------------------
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// ---------------------------------------------------------------------------
// Impersonation session (1 hour, separate cookie so the admin's own
// session token is preserved underneath and can be restored on "back").
// ---------------------------------------------------------------------------
export async function createImpersonationToken(
  payload: ImpersonationPayload
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${IMPERSONATION_EXPIRY_HOURS}h`)
    .sign(secretKey);
}

export async function verifyImpersonationToken(
  token: string
): Promise<ImpersonationPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as ImpersonationPayload;
  } catch {
    return null;
  }
}

export async function setImpersonationCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(IMPERSONATION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: IMPERSONATION_EXPIRY_HOURS * 60 * 60,
  });
}

export async function clearImpersonationCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(IMPERSONATION_COOKIE_NAME);
}

export async function getImpersonation(): Promise<ImpersonationPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(IMPERSONATION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyImpersonationToken(token);
}

/**
 * The "effective identity" for the current request: if an impersonation
 * cookie is present and valid, we act as that (target) user, otherwise we
 * act as whoever the normal session says. Use this everywhere in the app
 * EXCEPT admin-only checks, where you should check the REAL session/role.
 */
export async function getEffectiveIdentity(): Promise<{
  userId: string;
  role: "USER" | "ADMIN";
  isImpersonating: boolean;
} | null> {
  const impersonation = await getImpersonation();
  if (impersonation) {
    return {
      userId: impersonation.userId,
      role: impersonation.role,
      isImpersonating: true,
    };
  }
  const session = await getSession();
  if (session) {
    return { userId: session.userId, role: session.role, isImpersonating: false };
  }
  return null;
}
