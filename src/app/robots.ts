import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/cart/",
                "/checkout/",
                "/dashboard/",
                "/favorites/",
                "/notifications/",
            ],
        },
        sitemap: "https://dorabagz.ir/sitemap.xml",
    };
}