import type { MetadataRoute } from "next";

const SITE_URL = "https://bayrcm.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The demo submission endpoint is not useful to crawlers.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
