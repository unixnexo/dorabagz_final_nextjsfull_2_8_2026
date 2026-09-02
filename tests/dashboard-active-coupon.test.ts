import { describe, it, expect } from "vitest";

/**
 * The "active coupon" count in the dashboard uses a Prisma where clause
 * rather than a reusable pure function (it's a simple DB filter, not
 * business logic worth extracting) -- so this test re-implements the
 * same boolean check in plain JS and verifies it against the exact
 * boundary cases the real Prisma query needs to get right: null
 * start/end dates, a coupon that hasn't started yet, and one that's
 * already expired.
 */
function isCouponActive(
  coupon: { isDeleted: boolean; startAt: Date | null; expiresAt: Date },
  now: Date
): boolean {
  if (coupon.isDeleted) return false;
  if (coupon.expiresAt.getTime() <= now.getTime()) return false;
  if (coupon.startAt && coupon.startAt.getTime() > now.getTime()) return false;
  return true;
}

const NOW = new Date("2026-08-15T00:00:00Z");

describe("active coupon date-window logic", () => {
  it("counts a coupon with no startAt and a future expiresAt as active", () => {
    expect(
      isCouponActive({ isDeleted: false, startAt: null, expiresAt: new Date("2026-12-01") }, NOW)
    ).toBe(true);
  });

  it("excludes a deleted coupon even if its dates are otherwise active", () => {
    expect(
      isCouponActive({ isDeleted: true, startAt: null, expiresAt: new Date("2026-12-01") }, NOW)
    ).toBe(false);
  });

  it("excludes an already-expired coupon", () => {
    expect(
      isCouponActive({ isDeleted: false, startAt: null, expiresAt: new Date("2026-01-01") }, NOW)
    ).toBe(false);
  });

  it("excludes a coupon that hasn't started yet", () => {
    expect(
      isCouponActive(
        { isDeleted: false, startAt: new Date("2026-12-01"), expiresAt: new Date("2027-01-01") },
        NOW
      )
    ).toBe(false);
  });

  it("counts a coupon whose start date has already passed", () => {
    expect(
      isCouponActive(
        { isDeleted: false, startAt: new Date("2026-01-01"), expiresAt: new Date("2027-01-01") },
        NOW
      )
    ).toBe(true);
  });

  it("treats a coupon expiring at exactly now as no longer active", () => {
    expect(isCouponActive({ isDeleted: false, startAt: null, expiresAt: NOW }, NOW)).toBe(false);
  });
});
