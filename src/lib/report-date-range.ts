/**
 * Pure logic: given a preset (or custom start/end) and a reference "now",
 * resolves the actual [start, end) date range to query. Separated from DB
 * access for easy unit testing (see tests/report-date-range.test.ts).
 */
export type ReportRangeInput = {
  preset: "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "THIS_YEAR" | "CUSTOM";
  startDate?: string;
  endDate?: string;
};

export type ResolvedRange = {
  start: Date;
  end: Date; // exclusive upper bound
  /** Suggested breakdown granularity for this range length — day-by-day
   *  for anything up to ~31 days, month-by-month beyond that. Keeps a
   *  year-long chart from having 365 tiny bars. */
  granularity: "DAY" | "MONTH";
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  // Iranian week starts Saturday (day 6 in JS's Sunday=0 indexing).
  const day = date.getDay();
  const diff = (day + 1) % 7; // days since last Saturday
  const result = startOfDay(date);
  result.setDate(result.getDate() - diff);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function resolveReportRange(input: ReportRangeInput, now: Date = new Date()): ResolvedRange {
  switch (input.preset) {
    case "TODAY": {
      const start = startOfDay(now);
      return { start, end: addDays(start, 1), granularity: "DAY" };
    }
    case "THIS_WEEK": {
      const start = startOfWeek(now);
      return { start, end: addDays(start, 7), granularity: "DAY" };
    }
    case "THIS_MONTH": {
      const start = startOfMonth(now);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      return { start, end, granularity: "DAY" };
    }
    case "THIS_YEAR": {
      const start = startOfYear(now);
      const end = new Date(start.getFullYear() + 1, 0, 1);
      return { start, end, granularity: "MONTH" };
    }
    case "CUSTOM": {
      const start = startOfDay(new Date(input.startDate!));
      const endInclusive = startOfDay(new Date(input.endDate!));
      const end = addDays(endInclusive, 1); // make it exclusive, covers the full end day
      const daySpan = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return { start, end, granularity: daySpan > 62 ? "MONTH" : "DAY" };
    }
  }
}
