import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Bharat. — Web Developer & Digital Growth Partner", template: "%s · Bharat." },
  description: "Web design, development and digital growth for businesses, startups and growing brands.",
  keywords: ["freelance web developer", "website designer", "full stack developer", "website redesign", "e-commerce development"],
  openGraph: { type: "website", title: "Bharat. — Digital Growth Partner", description: "Websites that look better, work smarter and grow faster." },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
