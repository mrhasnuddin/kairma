import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SHARE_DESCRIPTION, KEYWORDS, SITE_COPY } from "@/lib/site";
import { ThemeProvider, themeScript } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import "./globals.css";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

// v5 type: IBM Plex Sans (display + body) and Plex Mono (labels, readouts).
// latin-ext + vietnamese cover the vi and ms locales.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-plex-sans",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
// CJK faces (IBM Plex Sans JP / KR, Noto Sans TC) are NOT self-hosted: each is
// ~100 unicode slices and made builds flaky. They load from Google Fonts on
// demand, only for that locale (see LanguageProvider).

// Share images come from the opengraph-image / twitter-image file conventions
// (landscape 1200×630 + square 1200×1200), so no `images` are set here.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SHARE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SHARE_DESCRIPTION,
  },
};

// Browser chrome follows the page: paper in light, void in dark.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0A0C" },
  ],
};

// Entity facts for search and AI engines, all drawn from the site copy.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/kairma-logo.svg` },
      description: SITE_COPY.hero_center.body,
      slogan: SITE_COPY.footer.closing,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "zh-TW", "vi", "ms", "ja", "ko"],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image/landscape` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(plexSans.variable, plexMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // `<` is escaped so no copy string can close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
