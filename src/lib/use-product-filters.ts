// src/lib/use-product-filters.ts
//
// Single source of truth for reading/writing the home page's filter state
// to and from the URL. Both HomeHeader (the filter drawer) and HomeContent
// (the "clear filters" bar + pagination) use this so they never drift out
// of sync with each other.
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortOption = "newest" | "oldest" | "cheap" | "expensive";

export type ProductFilters = {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  hasDiscount: boolean;
  sort: SortOption;
  page: number;
};

function parseFilters(params: URLSearchParams): ProductFilters {
  return {
    search: params.get("search") || undefined,
    categoryId: params.get("categoryId") || undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    inStock: params.get("inStock") === "1",
    hasDiscount: params.get("hasDiscount") === "1",
    sort: (params.get("sort") as SortOption) || "newest",
    page: params.get("page") ? Number(params.get("page")) : 1,
  };
}

/** Only search/minPrice/maxPrice/inStock/hasDiscount/categoryId count as
 *  "active" filters worth showing a clear button for — sort=newest and
 *  page are not something the user thinks of as "a filter applied". */
export function hasActiveFilters(filters: ProductFilters): boolean {
  return Boolean(
    filters.search ||
      filters.categoryId ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.inStock ||
      filters.hasDiscount
  );
}

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  /** Applies a partial patch on top of current filters and navigates.
   *  Any key not in `patch` keeps its current value. Setting a key to
   *  `undefined`/`false`/empty string removes it from the URL entirely
   *  (keeps URLs clean instead of "?minPrice=&maxPrice=").
   *  Resets page to 1 unless `patch.page` is explicitly given — changing
   *  any real filter should always land you back on page 1. */
  const applyFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      const next = { ...filters, ...patch };
      if (patch.page === undefined) next.page = 1;

      const params = new URLSearchParams();
      if (next.search) params.set("search", next.search);
      if (next.categoryId) params.set("categoryId", next.categoryId);
      if (next.minPrice !== undefined) params.set("minPrice", String(next.minPrice));
      if (next.maxPrice !== undefined) params.set("maxPrice", String(next.maxPrice));
      if (next.inStock) params.set("inStock", "1");
      if (next.hasDiscount) params.set("hasDiscount", "1");
      if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
      if (next.page && next.page > 1) params.set("page", String(next.page));

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [filters, pathname, router]
  );

  /** Clears everything except nothing — a full reset back to plain "/". */
  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { filters, applyFilters, clearFilters };
}
