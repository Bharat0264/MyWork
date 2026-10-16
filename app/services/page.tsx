import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Footer, Navbar } from "@/components/site-shell";
import { Container } from "@/components/container";

const ServicesGlassShowcase = dynamic(
  () => import("@/components/services-glass-showcase").then((mod) => mod.ServicesGlassShowcase),
  {
    ssr: true,
    loading: () => <div className="min-h-[560px] w-full" aria-busy="true" />,
  }
);

export const metadata: Metadata = {
  title: {
    absolute: "Web Design & Development Services · Garuda",
  },
  description:
    "Website design, redesign, full-stack development, e-commerce and SEO services.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/services",
  },
  openGraph: {
    title: "Web Design & Development Services · Garuda",
    description: "Website design, redesign, full-stack development, e-commerce and SEO services.",
    url: "https://my-work-umber.vercel.app/services",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Web Design & Development Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design & Development Services · Garuda",
    description: "Website design, redesign, full-stack development, e-commerce and SEO services.",
    images: ["/og-image.png"],
  },
};

export default function Services() {
  return (
    <>
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        {/* HERO SHOWCASE: Glass slab & interactive spheres */}
        <ServicesGlassShowcase />

        {/* A SIMPLE 4-STEP PROCESS */}
        <Container as="section" className="pt-[calc(var(--section-gap)/2)] pb-0">
          <p className="eyebrow text-[#8FB0D6]">Process</p>
          <h2 className="section-heading mt-3 max-w-2xl font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            A simple 4-step process.
          </h2>
          <div className="mt-[var(--header-gap)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              ["01", "Understand", "Business, audience, requirements and goals."],
              ["02", "Design", "Clean, modern design that matches your brand."],
              ["03", "Develop", "Fast, responsive frontend and solid backend functionality."],
              ["04", "Launch & support", "Testing, deployment, SEO optimization and ongoing care."],
            ].map(([n, t, d]) => (
              <article
                className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45] to-[#141E30] p-5 sm:p-8 shadow-[0_16px_36px_rgba(4,9,18,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(143,176,214,0.35)]"
                key={n}
              >
                <p className="text-[14px] font-semibold tracking-wider text-[#A9C8EB]">{n}</p>
                <h3 className="card-heading mt-4 text-xl font-semibold text-white">{t}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#B8C9DE]">{d}</p>
              </article>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
