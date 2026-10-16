import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Navbar, Footer } from "@/components/site-shell";

const WorkPortfolioShowcase = dynamic(
  () => import("@/components/work-portfolio-showcase").then((mod) => mod.WorkPortfolioShowcase),
  {
    ssr: true,
    loading: () => <div className="min-h-[640px] w-full" aria-busy="true" />,
  }
);

export const metadata: Metadata = {
  title: {
    absolute: "Web Design Projects · Garuda",
  },
  description:
    "See websites and web apps designed and developed by Garuda for real businesses.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/work",
  },
  openGraph: {
    title: "Web Design Projects · Garuda",
    description: "See websites and web apps designed and developed by Garuda for real businesses.",
    url: "https://my-work-umber.vercel.app/work",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Web Design Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Projects · Garuda",
    description: "See websites and web apps designed and developed by Garuda for real businesses.",
    images: ["/og-image.png"],
  },
};

export default function Work() {
  return (
    <>
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        <WorkPortfolioShowcase />
      </main>
      <Footer />
    </>
  );
}
