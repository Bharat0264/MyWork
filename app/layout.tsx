import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Garuda Web Designer and Developer", template: "%s · Garuda" },
  description: "Web design, development and digital growth for businesses, startups and growing brands.",
  keywords: ["freelance web developer", "website designer", "full stack developer", "website redesign", "e-commerce development"],
  openGraph: { type: "website", title: "Garuda Web Designer and Developer", description: "Websites that look better, work smarter and grow faster." },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
