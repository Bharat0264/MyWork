import { Navbar, Footer, CTA } from "@/components/site-shell";
import { WorkPortfolioShowcase } from "@/components/work-portfolio-showcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work & Portfolio | Garuda Web Designer and Developer",
  description: "A selection of websites, products and digital experiences shaped around real business goals and user needs.",
};

export default function Work() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 bg-transparent">
        <WorkPortfolioShowcase />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
