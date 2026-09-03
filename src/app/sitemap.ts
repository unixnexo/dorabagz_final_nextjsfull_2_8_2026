import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://dorabagz.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await prisma.product.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            slug: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return [
        // Products listing
        {
            url: `${SITE_URL}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },

        // Product detail pages
        ...products.map((product) => ({
            url: `${SITE_URL}/products/${product.slug}`,
            lastModified: product.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        })),

        // Static pages
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}