import { siteCopyEnV6 } from "@/data/site-copy-en-v6";

/* Single source for SEO, share and GEO surfaces (metadata, share images,
   JSON-LD, sitemap, robots, llms.txt). Every sentence here is lifted from the
   English site copy, so search snippets never drift from what the page says. */

const copy = siteCopyEnV6;

/* Canonical origin. Must be the host that answers 200: on Vercel, kairma.ai
   308-redirects to www.kairma.ai, so www is canonical. If the Vercel redirect
   is ever flipped to apex, change this to https://kairma.ai. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kairma.ai").replace(/\/$/, "");

export const SITE_NAME = copy.wordmark; // "Kairma"

export const SITE_TITLE =
  "Kairma — Own Your AI Workforce | Forward-Deployed AI Employees for Cross-Border Operations";

// hero headline + sub: ~150 chars, inside the search-snippet limit.
export const SITE_DESCRIPTION = `${copy.hero_left.h1} ${copy.hero_left.sub}`;

// Shorter line for share cards, where the title already carries the promise.
export const SHARE_DESCRIPTION = copy.hero_center.body;

export const SHARE_ALT = `${SITE_NAME} — ${copy.hero_left.h1}`;

export const KEYWORDS = [
  "Kairma",
  "AI employees",
  "AI workforce",
  "forward-deployed engineering",
  "FDE",
  "cross-border operations",
  "sovereign AI",
  "data sovereignty",
  "The Keep",
  "model routing",
];

export const SITE_COPY = copy;
