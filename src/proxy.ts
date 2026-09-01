// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";
// import {
//   SESSION_COOKIE_NAME,
//   IMPERSONATION_COOKIE_NAME,
// } from "@/server/auth/constants";

// // NOTE: middleware runs in the Edge runtime, so we can't import Prisma here.
// // We only verify the JWT signature/expiry — actual DB checks (isActive etc.)
// // happen in the page/action itself via getCurrentUser().
// const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// async function verifyToken(token: string | undefined) {
//   if (!token) return null;
//   try {
//     const { payload } = await jwtVerify(token, secretKey);
//     return payload as { userId: string; role: "USER" | "ADMIN" };
//   } catch {
//     return null;
//   }
// }

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const impersonationToken = request.cookies.get(IMPERSONATION_COOKIE_NAME)?.value;
//   const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

//   // Effective identity: impersonation takes priority, same as in session.ts
//   const effective = (await verifyToken(impersonationToken)) ?? (await verifyToken(sessionToken));

//   const isLoggedIn = !!effective;
//   const isAdmin = effective?.role === "ADMIN";

//   // Logged-in users shouldn't see the login page again.
//   if (pathname === "/login" && isLoggedIn) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Admin area: require a REAL admin session (impersonation should never
//   // grant admin access — check the raw session token, not "effective").
//   if (pathname.startsWith("/admin")) {
//     const realSession = await verifyToken(sessionToken);
//     if (!realSession || realSession.role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   // Dashboard area (profile, orders, etc.) requires login.
//   if (pathname.startsWith("/dashboard") && !isLoggedIn) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login", "/admin/:path*", "/dashboard/:path*"],
// };







import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  SESSION_COOKIE_NAME,
  IMPERSONATION_COOKIE_NAME,
} from "@/server/auth/constants";

// NOTE: middleware runs in the Edge runtime, so we can't import Prisma here.
// We only verify the JWT signature/expiry — actual DB checks (isActive etc.)
// happen in the page/action itself via getCurrentUser().
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; role: "USER" | "ADMIN" };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const impersonationToken = request.cookies.get(IMPERSONATION_COOKIE_NAME)?.value;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Effective identity: impersonation takes priority, same as in session.ts
  const effective = (await verifyToken(impersonationToken)) ?? (await verifyToken(sessionToken));

  const isLoggedIn = !!effective;

  // Logged-in users shouldn't see the login page again.
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin area: require a REAL admin session (impersonation should never
  // grant admin access — check the raw session token, not "effective").
  if (pathname.startsWith("/admin")) {
    const realSession = await verifyToken(sessionToken);
    if (!realSession || realSession.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  // Dashboard area (profile, orders, etc.) requires login.
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Other login-required pages (cart intentionally excluded — guests can
  // use it, per Module 3's spec).
  const requiresLogin = ["/notifications", "/favorite", "/checkout"];
  if (requiresLogin.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/dashboard/:path*",
    "/notifications",
    "/favorite",
    "/checkout",
  ],
};

