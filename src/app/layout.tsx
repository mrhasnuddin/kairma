import type { Metadata } from "next";
import { ThemeProvider, themeScript } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://kairma.vercel.app"),
  title: "KAIRMA OS · The AI workforce for cross-border brands",
  description:
    "ONE BOX. YOUR FIRST AI EMPLOYEE. Deploy a sovereign AI workforce on-premise in 48 hours. Brand data stays local, powered by Kairma Edge Appliance.",
  keywords: [
    "KAIRMA",
    "KAIRMA OS",
    "Sovereign AI",
    "Cross-border brands",
    "AI workforce",
    "Edge Appliance",
    "Web3Labs",
    "Kairma Box",
  ],
  authors: [{ name: "KAIRMA" }],
  openGraph: {
    title: "KAIRMA OS",
    description: "The AI workforce for cross-border brands.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KAIRMA OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
