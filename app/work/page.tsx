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
  title: "Work & Portfolio | Garuda Web Designer and Developer",
  description:
    "A selection of websites, products and digital experiences shaped around real business goals and user needs.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/work",
  },
  openGraph: {
    title: "Work & Portfolio · Garuda",
    description: "A selection of websites, products and digital experiences shaped around real business goals.",
    url: "https://my-work-umber.vercel.app/work",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work & Portfolio · Garuda",
    description: "A selection of websites, products and digital experiences shaped around real business goals.",
    images: ["/og-image.png"],
  },
};

export default function Work() {
  return (
    <>
      <Navbar />
      <main id="content" className="pt-[72px] min-[900px]:pt-[84px] pb-24 min-[900px]:pb-0 page-transition bg-transparent">
        <WorkPortfolioShowcase />
      </main>
      <Footer />
    </>
  );
}
