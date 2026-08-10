import { describe, it, expect } from "vitest";
import { resolveReportRange } from "@/lib/report-date-range";

// Wednesday, August 12, 2026, 14:30 local time
const REFERENCE_NOW = new Date(2026, 7, 12, 14, 30);

describe("resolveReportRange — TODAY", () => {
  it("starts at midnight and ends at midnight the next day", () => {
    const result = resolveReportRange({ preset: "TODAY" }, REFERENCE_NOW);
    expect(result.start).toEqual(new Date(2026, 7, 12, 0, 0, 0));
    expect(result.end).toEqual(new Date(2026, 7, 13, 0, 0, 0));
    expect(result.granularity).toBe("DAY");
  });
});

describe("resolveReportRange — THIS_WEEK", () => {
  it("starts on the most recent Saturday (Iranian week start)", () => {
    // Aug 12 2026 is a Wednesday. Most recent Saturday is Aug 8 2026.
    const result = resolveReportRange({ preset: "THIS_WEEK" }, REFERENCE_NOW);
    expect(result.start).toEqual(new Date(2026, 7, 8, 0, 0, 0));
    expect(result.start.getDay()).toBe(6); // Saturday
  });

  it("spans exactly 7 days", () => {
    const result = resolveReportRange({ preset: "THIS_WEEK" }, REFERENCE_NOW);
    const spanDays = (result.end.getTime() - result.start.getTime()) / (1000 * 60 * 60 * 24);
    expect(spanDays).toBe(7);
  });

  it("resolves correctly when 'now' IS a Saturday", () => {
    const saturday = new Date(2026, 7, 8, 10, 0); // Aug 8 2026 is a Saturday
    const result = resolveReportRange({ preset: "THIS_WEEK" }, saturday);
    expect(result.start).toEqual(new Date(2026, 7, 8, 0, 0, 0));
  });
});

describe("resolveReportRange — THIS_MONTH", () => {
  it("starts on the 1st and ends on the 1st of next month", () => {
    const result = resolveReportRange({ preset: "THIS_MONTH" }, REFERENCE_NOW);
    expect(result.start).toEqual(new Date(2026, 7, 1));
    expect(result.end).toEqual(new Date(2026, 8, 1));
  });

  it("handles December correctly (rolls into next year)", () => {
    const december = new Date(2026, 11, 15);
    const result = resolveReportRange({ preset: "THIS_MONTH" }, december);
    expect(result.end).toEqual(new Date(2027, 0, 1));
  });
});

describe("resolveReportRange — THIS_YEAR", () => {
  it("starts Jan 1 and ends Jan 1 next year, with MONTH granularity", () => {
    const result = resolveReportRange({ preset: "THIS_YEAR" }, REFERENCE_NOW);
    expect(result.start).toEqual(new Date(2026, 0, 1));
    expect(result.end).toEqual(new Date(2027, 0, 1));
    expect(result.granularity).toBe("MONTH");
  });
});

describe("resolveReportRange — CUSTOM", () => {
  it("includes the full end day (exclusive upper bound is end+1 day)", () => {
    const result = resolveReportRange({
      preset: "CUSTOM",
      startDate: "2026-08-01",
      endDate: "2026-08-05",
    });
    expect(result.start).toEqual(new Date(2026, 7, 1));
    expect(result.end).toEqual(new Date(2026, 7, 6)); // exclusive, covers all of Aug 5
  });

  it("uses DAY granularity for short ranges (<=62 days)", () => {
    const result = resolveReportRange({
      preset: "CUSTOM",
      startDate: "2026-08-01",
      endDate: "2026-08-10",
    });
    expect(result.granularity).toBe("DAY");
  });

  it("uses MONTH granularity for long ranges (>62 days)", () => {
    const result = resolveReportRange({
      preset: "CUSTOM",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
    });
    expect(result.granularity).toBe("MONTH");
  });

  it("handles a single-day custom range correctly", () => {
    const result = resolveReportRange({
      preset: "CUSTOM",
      startDate: "2026-08-05",
      endDate: "2026-08-05",
    });
    expect(result.start).toEqual(new Date(2026, 7, 5));
    expect(result.end).toEqual(new Date(2026, 7, 6));
  });
});
