import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One page today. Locales switch client-side, so they have no URLs to list.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
