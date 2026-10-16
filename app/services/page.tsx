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
  title: "Services | Garuda Web Designer and Developer",
  description:
    "Every service is designed to solve a specific business problem—website creation, redesigns, full-stack apps, e-commerce, and growth.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/services",
  },
  openGraph: {
    title: "Services · Garuda",
    description: "Every service is designed to solve a specific business problem.",
    url: "https://my-work-umber.vercel.app/services",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services · Garuda",
    description: "Every service is designed to solve a specific business problem.",
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

        {/* A DELIBERATE PROCESS: 6-Step cards */}
        <Container as="section" className="pt-[calc(var(--section-gap)/2)] pb-0">
          <p className="eyebrow text-[#8FB0D6]">A deliberate process</p>
          <h2 className="section-heading mt-3 max-w-2xl font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Less guesswork. More momentum.
          </h2>
          <div className="mt-[var(--header-gap)] grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["01", "Understand", "Business, audience, requirements and goals."],
              ["02", "Plan", "Structure, journey, direction and technology."],
              ["03", "Design", "Create a distinctive visual experience."],
              ["04", "Develop", "Build responsive, scalable functionality."],
              ["05", "Launch", "Test, optimize and deploy with care."],
              ["06", "Grow", "Support SEO, analytics and future moves."],
            ].map(([n, t, d]) => (
              <article
                className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45] to-[#141E30] p-5 sm:p-8 shadow-[0_16px_36px_rgba(4,9,18,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(143,176,214,0.35)]"
                key={n}
              >
                <p className="text-[13px] font-semibold tracking-wider text-[#A9C8EB] sm:text-sm sm:text-[#8FB0D6]">{n}</p>
                <h3 className="card-heading mt-5 text-xl font-semibold text-white">{t}</h3>
                <p className="mt-2 text-[16px] leading-[1.5] text-[#B8C9DE] sm:text-sm sm:leading-6 sm:text-[#9FB3CC]">{d}</p>
              </article>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
