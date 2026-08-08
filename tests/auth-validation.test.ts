import { describe, it, expect } from "vitest";
import { requestOtpSchema, verifyOtpSchema } from "@/lib/validations/auth";

describe("requestOtpSchema", () => {
  it("passes with a valid phone number", () => {
    const result = requestOtpSchema.safeParse({ phoneNumber: "09123456789" });
    expect(result.success).toBe(true);
  });

  it("fails with an invalid phone number", () => {
    const result = requestOtpSchema.safeParse({ phoneNumber: "12345" });
    expect(result.success).toBe(false);
  });
});

describe("verifyOtpSchema", () => {
  it("passes with valid phone + 6-digit code", () => {
    const result = verifyOtpSchema.safeParse({
      phoneNumber: "09123456789",
      code: "482913",
    });
    expect(result.success).toBe(true);
  });

  it("fails when code is not 6 digits long", () => {
    const result = verifyOtpSchema.safeParse({
      phoneNumber: "09123456789",
      code: "123",
    });
    expect(result.success).toBe(false);
  });
});
