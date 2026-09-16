"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { OrderDetailDTO } from "@/types/order";

export function OrderItemsCard({ order }: { order: OrderDetailDTO }) {
    const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

    return (
        <>
            <div className="overflow-hidden rounded-[25px] bg-brand-secondary">
                <ul>
                    {order.items.map((item, index) => (
                        <li
                            key={item.id}
                            className={`flex items-center gap-3 px-4 py-3.5 ${index !== order.items.length - 1 ? "border-b border-black/[0.05]" : ""
                                }`}
                        >
                            <button
                                type="button"
                                disabled={!item.productImage}
                                onClick={() => {
                                    if (!item.productImage) return;
                                    setPreviewImage({ src: item.productImage, alt: item.productTitle });
                                }}
                                className="relative size-14 shrink-0 overflow-hidden rounded-[16px] bg-[#f1f2f3] transition-transform active:scale-95 disabled:cursor-default"
                            >
                                {item.productImage ? (
                                    <Image
                                        src={item.productImage}
                                        alt={item.productTitle}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="absolute inset-0 m-auto size-5 text-black/25" />
                                )}
                            </button>

                            <div className="min-w-0 flex-1">
                                {item.productSlug ? (
                                    <Link
                                        href={`/products/${item.productSlug}`}
                                        className="block truncate text-[14px] font-medium hover:underline"
                                    >
                                        {item.productTitle}
                                    </Link>
                                ) : (
                                    <p className="truncate text-[14px] font-medium">{item.productTitle}</p>
                                )}

                                {item.optionSummary && (
                                    <p className="text-[11.5px] text-black/40">{item.optionSummary}</p>
                                )}
                            </div>

                            <span className="shrink-0 text-[12px] text-black/40">
                                {item.quantity.toLocaleString("fa-IR")}×
                            </span>

                            <span className="shrink-0 text-[13px] font-bold tabular-nums">
                                {(item.unitPrice * item.quantity).toLocaleString("fa-IR")} تومن
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="space-y-2 border-t border-black/[0.05] px-4 py-4">
                    <TotalsRow label="جمع جزء" value={`${order.subtotal.toLocaleString("fa-IR")} تومن`} />

                    {order.discountAmount > 0 && (
                        <TotalsRow
                            label={`تخفیف${order.couponCode ? ` (${order.couponCode})` : ""}`}
                            value={`${order.discountAmount.toLocaleString("fa-IR")}- تومن`}
                            tone="green"
                        />
                    )}

                    <div className="flex items-center justify-between pt-1.5">
                        <span className="text-[14.5px] font-bold">مبلغ کل</span>
                        <span className="text-[16px] font-bold tabular-nums">
                            {order.totalAmount.toLocaleString("fa-IR")} تومن
                        </span>
                    </div>
                </div>
            </div>

            <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
                <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-0 bg-white p-2">
                    <DialogTitle className="sr-only">{previewImage?.alt ?? "تصویر محصول"}</DialogTitle>

                    {previewImage && (
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f1f2f3] sm:aspect-video">
                            <Image
                                src={previewImage.src}
                                alt={previewImage.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, 768px"
                                className="object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function TotalsRow({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: "green";
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[12.5px] text-black/40">{label}</span>
            <span
                className={`text-[12.5px] font-medium tabular-nums ${tone === "green" ? "text-emerald-600" : ""
                    }`}
            >
                {value}
            </span>
        </div>
    );
}