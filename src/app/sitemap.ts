import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://dorabagz.ir",
            lastModified: new Date(),
        },
        {
            url: "https://dorabagz.ir/products",
            lastModified: new Date(),
        },
    ];
}