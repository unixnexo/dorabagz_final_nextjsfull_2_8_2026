import { describe, it, expect } from "vitest";
import { maskPhoneNumber } from "@/lib/mask-phone";

describe("maskPhoneNumber", () => {
  it("masks the middle 4 digits of a standard 11-digit number", () => {
    expect(maskPhoneNumber("09123456789")).toBe("0912****789");
  });

  it("keeps exactly the first 4 and last 3 digits visible", () => {
    const result = maskPhoneNumber("09351234567");
    expect(result.slice(0, 4)).toBe("0935");
    expect(result.slice(-3)).toBe("567");
    expect(result).toContain("****");
  });

  it("never reveals all 11 original digits in sequence", () => {
    const phone = "09123456789";
    const result = maskPhoneNumber(phone);
    expect(result).not.toBe(phone);
  });

  it("returns the input unchanged if it isn't 11 digits (defensive fallback)", () => {
    expect(maskPhoneNumber("12345")).toBe("12345");
  });
});
