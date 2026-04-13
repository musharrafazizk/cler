import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSettings } from "@/lib/db";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

const syne = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-heading",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xcler.dev"),
  title: {
    default: "Xcler — Web Development, App Development & Automation Agency",
    template: "%s | Xcler",
  },
  description:
    "Xcler is a digital agency specializing in web development, app development, workflow automation, AI agents, WordPress, and Shopify. Serving businesses in Germany and worldwide.",
  keywords: [
    "web development agency",
    "app development",
    "workflow automation",
    "AI agents",
    "chatbots",
    "WordPress developer",
    "Shopify developer",
    "n8n automation",
    "make.com",
    "Next.js developer",
    "Webentwicklung",
    "App Entwicklung Deutschland",
  ],
  authors: [{ name: "Xcler", url: "https://xcler.dev" }],
  creator: "Xcler",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["de_DE"],
    url: "https://xcler.dev",
    siteName: "Xcler",
    title: "Xcler — Web Development, Automation & AI Agency",
    description:
      "We build web apps, automate workflows, and deploy AI systems for businesses that mean business.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Xcler Digital Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xcler — Web Development & Automation Agency",
    description: "Web apps, automation, and AI systems for businesses that mean business.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://xcler.dev",
    languages: { en: "https://xcler.dev", de: "https://xcler.dev/de" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let organizationJsonLd = organizationSchema();

  try {
    const settings = await getSettings();
    organizationJsonLd = organizationSchema(settings);
  } catch {
    // Gracefully fallback when settings are unavailable.
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable}`}>
        <noscript>
          <div className="noscriptBanner">
            JavaScript is disabled. You can still browse core content, but interactive features are unavailable.
          </div>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
