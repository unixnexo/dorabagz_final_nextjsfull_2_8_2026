import { describe, it, expect } from "vitest";
import { resolveCourierType, courierTypeLabel } from "@/lib/courier";

describe("resolveCourierType", () => {
  it("returns SNAPP_BOX for Shiraz", () => {
    expect(resolveCourierType("شیراز")).toBe("SNAPP_BOX");
  });

  it("returns TIPAX for any other city", () => {
    expect(resolveCourierType("تهران")).toBe("TIPAX");
    expect(resolveCourierType("اصفهان")).toBe("TIPAX");
  });

  it("trims whitespace before comparing", () => {
    expect(resolveCourierType("  شیراز  ")).toBe("SNAPP_BOX");
  });
});

describe("courierTypeLabel", () => {
  it("returns a Persian label for each courier type", () => {
    expect(courierTypeLabel("SNAPP_BOX")).toContain("اسنپ");
    expect(courierTypeLabel("TIPAX")).toContain("تیپاکس");
  });
});
