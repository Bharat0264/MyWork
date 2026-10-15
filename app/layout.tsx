import type { Metadata, Viewport } from "next";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SkipToContent } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-work-umber.vercel.app"),
  title: { default: "Garuda Web Designer and Developer", template: "%s · Garuda" },
  description: "Web design, development and digital growth for businesses, startups and growing brands.",
  keywords: ["freelance web developer", "website designer", "full stack developer", "website redesign", "e-commerce development"],
  openGraph: {
    type: "website",
    title: "Garuda Web Designer and Developer",
    description: "Websites that look better, work smarter and grow faster.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Web Designer and Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garuda Web Designer and Developer",
    description: "Websites that look better, work smarter and grow faster.",
    images: ["/og-image.png"],
  },
  other: {
    "codex-preview": "development",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#141E30" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <SkipToContent />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
