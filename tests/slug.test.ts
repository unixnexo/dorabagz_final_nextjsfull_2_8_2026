import { describe, it, expect } from "vitest";
import { slugify, buildProductSlug, generateProductCode } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Nike Air Max")).toBe("nike-air-max");
  });

  it("keeps Persian characters", () => {
    expect(slugify("کفش ورزشی")).toBe("کفش-ورزشی");
  });

  it("strips punctuation", () => {
    expect(slugify("Nike Air Max! (2024)")).toBe("nike-air-max-2024");
  });

  it("collapses multiple dashes and trims edges", () => {
    expect(slugify("  multi   space  ")).toBe("multi-space");
  });
});

describe("buildProductSlug", () => {
  it("combines slugified title and lowercased product code", () => {
    expect(buildProductSlug("Nike Air Max", "PRD-8F3K2L")).toBe("nike-air-max-prd-8f3k2l");
  });
});

describe("generateProductCode", () => {
  it("always starts with PRD- and has 6 chars after it, excluding ambiguous O/I/0/1", () => {
    const code = generateProductCode();
    expect(code).toMatch(/^PRD-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
  });

  it("generates different codes across calls (extremely likely)", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateProductCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});
