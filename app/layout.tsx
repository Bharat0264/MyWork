import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SkipToContent } from "@/components/site-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-work-umber.vercel.app"),
  title: { default: "Garuda Web Design & Development Studio", template: "%s · Garuda Studio" },
  description: "Web design and development studio building fast, modern websites for businesses and startups.",
  keywords: ["web design studio", "web development studio", "website designers", "full stack development", "website redesign", "e-commerce development"],
  openGraph: {
    type: "website",
    title: "Garuda Web Design & Development Studio",
    description: "We design and build fast, modern websites that help businesses turn visitors into customers.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Web Design & Development Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garuda Web Design & Development Studio",
    description: "We design and build fast, modern websites that help businesses turn visitors into customers.",
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
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <SkipToContent />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
