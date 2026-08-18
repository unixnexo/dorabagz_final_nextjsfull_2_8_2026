"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type ProductCardProduct = {
    id: number | string;
    title: string;
    price: number | string;
    image: string;
};

type ProductCardProps = {
    product: ProductCardProduct;
};

export function ProductCard({ product }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Card className="group overflow-hidden rounded-[25px] border-0 bg-transparent shadow-none">
            {/* Image */}
            <div className="relative aspect-[0.88] overflow-hidden rounded-[25px] bg-white">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* Favorite */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite((current) => !current)}
                    className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
                >
                    <Heart
                        className="h-[19px] w-[19px] stroke-[1.8]"
                        fill={isFavorite ? "currentColor" : "none"}
                    />
                </Button>
            </div>

            {/* Product info */}
            <div className="px-1 pt-2.5">
                <h3 className="truncate text-[15px] font-medium">
                    {product.title}
                </h3>

                <div className="mt-1 flex items-center gap-1">
                    <span className="text-[15px] font-bold">
                        {Number(product.price).toLocaleString("en-US")}
                    </span>

                    <span className="text-[12px] text-muted-foreground">
                        تومن
                    </span>
                </div>
            </div>
        </Card>
    );
}