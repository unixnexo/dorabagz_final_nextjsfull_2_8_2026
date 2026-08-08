import { describe, it, expect } from "vitest";
import { generateVariantCombinations, combinationKey } from "@/app/admin/products/variant-utils";

describe("generateVariantCombinations", () => {
  it("returns a single empty-combination variant when there are no options", () => {
    expect(generateVariantCombinations([])).toEqual([{}]);
  });

  it("returns a single empty-combination variant when options have no values", () => {
    expect(generateVariantCombinations([{ name: "Size", values: [] }])).toEqual([{}]);
  });

  it("generates every combination across two options", () => {
    const result = generateVariantCombinations([
      { name: "Size", values: ["SM", "M"] },
      { name: "Color", values: ["Red"] },
    ]);
    expect(result).toEqual([
      { Size: "SM", Color: "Red" },
      { Size: "M", Color: "Red" },
    ]);
  });

  it("generates the full cross-product for two options with multiple values", () => {
    const result = generateVariantCombinations([
      { name: "Size", values: ["SM", "M"] },
      { name: "Color", values: ["Red", "Blue"] },
    ]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual({ Size: "SM", Color: "Red" });
    expect(result).toContainEqual({ Size: "SM", Color: "Blue" });
    expect(result).toContainEqual({ Size: "M", Color: "Red" });
    expect(result).toContainEqual({ Size: "M", Color: "Blue" });
  });

  it("ignores options with a blank name", () => {
    const result = generateVariantCombinations([{ name: "  ", values: ["SM"] }]);
    expect(result).toEqual([{}]);
  });
});

describe("combinationKey", () => {
  it("produces the same key regardless of property order", () => {
    const a = combinationKey({ Size: "SM", Color: "Red" });
    const b = combinationKey({ Color: "Red", Size: "SM" });
    expect(a).toBe(b);
  });

  it("produces different keys for different combinations", () => {
    const a = combinationKey({ Size: "SM" });
    const b = combinationKey({ Size: "M" });
    expect(a).not.toBe(b);
  });
});
