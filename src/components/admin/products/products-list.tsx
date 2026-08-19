import type { ProductListItemDTO } from "@/types/product";
import { ProductListCard } from "./product-list-card";

export function ProductsList({
    products,
    isLoading,
    isError,
    onToggleDeleted,
}: {
    products: ProductListItemDTO[] | undefined;
    isLoading: boolean;
    isError: boolean;
    onToggleDeleted: (id: string, currentlyDeleted: boolean) => void;
}) {
    if (isError) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] font-medium text-[#FF3B30]">
                    خطا در دریافت اطلاعات
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-2.5">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[80px] animate-pulse rounded-3xl bg-white/70" />
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[13.5px] text-[#8E8E93]">محصولی پیدا نشد</p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {products.map((product) => (
                <ProductListCard
                    key={product.id}
                    product={product}
                    onToggleDeleted={() => onToggleDeleted(product.id, product.isDeleted)}
                />
            ))}
        </div>
    );
}