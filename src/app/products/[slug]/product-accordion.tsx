"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductReviews } from "./product-reviews";
import type { ProductDetailDTO } from "@/types/product";

/**
 * Description / specifications / reviews accordion.
 *
 * NOTE: ProductDetailDTO (per your doc) doesn't include an averageRating or
 * reviewCount field, so the "نظرات کاربران" trigger doesn't show a fake
 * "★ 4.8 · 26 نظر" summary like the design reference did — that data isn't
 * available without an extra field/endpoint. Flagged this at the end of my
 * reply in case you want to add one.
 */
export function ProductAccordion({ product }: { product: ProductDetailDTO }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {product.description && (
                <AccordionItem value="description" className="border-b">
                    <AccordionTrigger className="text-base hover:no-underline">توضیحات محصول</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm leading-7 text-muted-foreground">{product.description}</p>
                    </AccordionContent>
                </AccordionItem>
            )}

            {product.specifications.length > 0 && (
                <AccordionItem value="specifications" className="border-b">
                    <AccordionTrigger className="text-base hover:no-underline">مشخصات محصول</AccordionTrigger>
                    <AccordionContent>
                        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm">
                            {product.specifications.map((spec, index) => (
                                <div key={spec.id}>
                                    {index > 0 && <div className="h-px bg-border/60" />}
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <span className="text-sm text-muted-foreground">{spec.key}</span>
                                        <span className="text-sm font-medium text-foreground">{spec.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}

            <AccordionItem value="reviews" className="border-b-0">
                <AccordionTrigger className="text-base hover:no-underline">نظرات کاربران</AccordionTrigger>
                <AccordionContent className="pt-2">
                    <ProductReviews productId={product.id} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}