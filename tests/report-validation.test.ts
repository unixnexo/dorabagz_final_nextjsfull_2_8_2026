import { describe, it, expect } from "vitest";
import { reportRangeQuerySchema } from "@/lib/validations/report";

describe("reportRangeQuerySchema", () => {
  it("accepts a simple preset with no dates", () => {
    expect(reportRangeQuerySchema.safeParse({ preset: "THIS_MONTH" }).success).toBe(true);
  });

  it("rejects CUSTOM without startDate/endDate", () => {
    const result = reportRangeQuerySchema.safeParse({ preset: "CUSTOM" });
    expect(result.success).toBe(false);
  });

  it("accepts CUSTOM with valid startDate/endDate", () => {
    const result = reportRangeQuerySchema.safeParse({
      preset: "CUSTOM",
      startDate: "2026-08-01",
      endDate: "2026-08-10",
    });
    expect(result.success).toBe(true);
  });

  it("rejects CUSTOM when startDate is after endDate", () => {
    const result = reportRangeQuerySchema.safeParse({
      preset: "CUSTOM",
      startDate: "2026-08-10",
      endDate: "2026-08-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts CUSTOM when startDate equals endDate (single day)", () => {
    const result = reportRangeQuerySchema.safeParse({
      preset: "CUSTOM",
      startDate: "2026-08-05",
      endDate: "2026-08-05",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid preset value", () => {
    const result = reportRangeQuerySchema.safeParse({ preset: "LAST_DECADE" });
    expect(result.success).toBe(false);
  });
});
