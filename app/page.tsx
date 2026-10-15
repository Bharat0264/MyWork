import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FolderGit2, Sparkles, Cpu } from "lucide-react";
import { Navbar, Footer, CTA } from "@/components/site-shell";
import { StartProjectButton } from "@/components/cta-button";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Garuda Web Designer and Developer | High-Performance Modern Websites",
  description:
    "Web design, development and digital growth for businesses, startups and growing brands. Websites built to look better, work smarter, and grow faster.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app",
  },
  openGraph: {
    title: "Garuda Web Designer and Developer",
    description: "Websites that look better, work smarter and grow faster.",
    url: "https://my-work-umber.vercel.app",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Web Designer and Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garuda Web Designer and Developer",
    description: "Websites that look better, work smarter and grow faster.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  // Real spotlight project
  const spotlightProject = projects[0]; // Rainbow Digi School
  const spotlightChips = spotlightProject.technologies.slice(0, 3);

  // Exact real data computations for "At a glance"
  const totalProjects = projects.length;
  const totalServices = services.length;
  const uniqueTechnologies = Array.from(new Set(projects.flatMap((p) => p.technologies))).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Garuda Web Designer and Developer",
    url: "https://my-work-umber.vercel.app",
    logo: "https://my-work-umber.vercel.app/logo-full.png",
    description: "Web design, development and digital growth for businesses, startups and growing brands.",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    sameAs: [
      socialConfig.github,
      socialConfig.linkedin,
      socialConfig.instagram,
      socialConfig.x,
    ],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="content" className="pt-[72px] min-[900px]:pt-[84px] pb-24 min-[900px]:pb-0 page-transition bg-transparent">
        {/* ========================================================
            1. HERO SECTION
            ======================================================== */}
        <section className="grid-bg relative overflow-hidden pt-12 sm:pt-20">
          <div className="absolute -right-32 top-8 h-96 w-96 rounded-full bg-[rgba(53,87,125,0.22)] blur-[120px] pointer-events-none" />
          <div className="wrap relative grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--steel-light)]" />
                {siteConfig.availability}
              </p>
              <h1 className="hero-heading mt-7 max-w-3xl font-semibold text-white">
                Websites built to{" "}
                <em className="font-normal italic text-[var(--mist)]">look better,</em>{" "}
                work smarter, and grow faster.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
                I create, redesign and develop modern websites and digital experiences for businesses, startups and growing brands.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link className="button" href="/work" prefetch={true}>
                  View my work <ArrowUpRight size={16} />
                </Link>
                <StartProjectButton />
              </div>
            </div>

            {/* 3D PERSPECTIVE GRAPHIC */}
            <div className="perspective relative hidden h-[440px] lg:block" aria-hidden="true">
              <div className="floating-plane left-8 top-14">
                <p className="p-7 text-xs font-medium tracking-wider text-[var(--text-muted)]">
                  DIGITAL EXPERIENCE
                </p>
                <div className="mx-7 h-px bg-[var(--border)]" />
                <p className="p-7 text-3xl font-semibold text-[var(--text)]">
                  Built to feel<br />ahead of now.
                </p>
              </div>
              <div className="floating-orb bottom-8 right-8" />
              <div className="absolute bottom-6 left-12 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mist)]">
                Design × Technology
              </div>
            </div>

            <a
              href="#featured-project"
              aria-label="Scroll to featured project"
              className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowDown size={18} />
            </a>
          </div>
        </section>

        {/* ========================================================
            2. TRUST / MARQUEE STRIP
            ======================================================== */}
        <section className="border-y border-[var(--border)] bg-[#141E30]/40 py-5">
          <div className="wrap flex flex-wrap justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            <span>Strategy</span>
            <span>Design</span>
            <span>Development</span>
            <span>Growth</span>
            <span>Systems</span>
          </div>
        </section>

        {/* ========================================================
            3. FEATURED PROJECT (ONE large spotlight card)
            ======================================================== */}
        <section id="featured-project" className="wrap py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Featured project</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Spotlight: {spotlightProject.title}
              </h2>
            </div>
            <Link
              href="/work"
              prefetch={true}
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8FB0D6] transition-colors hover:text-white self-start sm:self-auto"
            >
              <span>See all work</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Large Spotlight Card with Real Screenshot inside Device Frame */}
          <div className="overflow-hidden rounded-[28px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/90 via-[#141E30]/80 to-[#0B1322]/90 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(4,9,18,0.5)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
              {/* Left Column: Device Frame */}
              <div className="relative overflow-hidden rounded-[20px] border border-[rgba(143,176,214,0.22)] bg-[#0A0F1D] shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                {/* Browser chrome header bar */}
                <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#141E30]/80 px-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
                  <span className="ml-3 truncate text-[11px] font-mono text-[#6F86A3]">
                    {spotlightProject.liveUrl?.replace("https://", "") || "rainbow-digi-school.vercel.app"}
                  </span>
                </div>

                {/* Real screenshot inside mockup */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0F1D]">
                  <Image
                    src={`/projects/${spotlightProject.slug}.webp`}
                    alt={`Real homepage screenshot of ${spotlightProject.title}`}
                    width={1440}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 600px"
                    priority
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Right Column: Project Details */}
              <div className="flex flex-col justify-center">
                <p className="eyebrow text-[#8FB0D6]">{spotlightProject.category}</p>
                <h3 className="card-heading mt-3 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {spotlightProject.title}
                </h3>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#9FB3CC]">
                  {spotlightProject.shortDescription}
                </p>

                {/* 3 Tech Chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {spotlightChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1.5 text-[12px] font-medium text-[#E8EEF7]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/work"
                    prefetch={true}
                    className="button inline-flex items-center gap-2"
                  >
                    <span>See all work</span>
                    <ArrowUpRight size={16} />
                  </Link>
                  {spotlightProject.liveUrl && (
                    <a
                      href={spotlightProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary inline-flex items-center gap-2"
                    >
                      <span>Visit live site</span>
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. AT A GLANCE (3 small stat tiles computed from real data)
            ======================================================== */}
        <section className="wrap py-16 sm:py-24 border-t border-[rgba(143,176,214,0.16)]">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <p className="eyebrow text-[#8FB0D6]">At a glance</p>
            <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Work and capability in numbers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Tile 1: Projects */}
            <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-7 sm:p-8 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6] mb-6">
                <FolderGit2 size={22} strokeWidth={2} />
              </div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {totalProjects}
              </p>
              <h3 className="card-heading mt-3 text-lg font-semibold text-white">
                Featured Projects
              </h3>
              <p className="mt-2 text-sm text-[#9FB3CC] leading-relaxed">
                Bespoke websites and full-stack applications in portfolio.
              </p>
            </div>

            {/* Tile 2: Services */}
            <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-7 sm:p-8 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6] mb-6">
                <Sparkles size={22} strokeWidth={2} />
              </div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {totalServices}
              </p>
              <h3 className="card-heading mt-3 text-lg font-semibold text-white">
                Core Services
              </h3>
              <p className="mt-2 text-sm text-[#9FB3CC] leading-relaxed">
                Specialized digital offerings from creation to SEO and growth.
              </p>
            </div>

            {/* Tile 3: Technologies */}
            <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-7 sm:p-8 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6] mb-6">
                <Cpu size={22} strokeWidth={2} />
              </div>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {uniqueTechnologies}
              </p>
              <h3 className="card-heading mt-3 text-lg font-semibold text-white">
                Technologies & Tools
              </h3>
              <p className="mt-2 text-sm text-[#9FB3CC] leading-relaxed">
                Modern tools including React, Next.js, Node.js, and TypeScript.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. WHY GO DIGITAL: Your website is your hardest-working first impression
            (Moved here from other pages - lives ONLY on Home)
            ======================================================== */}
        <section className="border-t border-[rgba(143,176,214,0.16)] bg-[#141E30]/60">
          <div className="wrap grid gap-12 py-20 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Why go digital</p>
              <h2 className="section-heading mt-4 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Your website is your hardest-working first impression.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#9FB3CC]">
                It is where people check whether you are credible, understand what you offer and decide whether to contact or buy from you—often before they speak to anyone.
              </p>
            </div>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {[
                ["Always discoverable", "Give customers a clear place to find you, understand your services and make contact."],
                ["Build trust faster", "A polished, current experience signals care, reliability and professionalism."],
                ["Make decisions easier", "Clear information, proof and calls to action help visitors take the next step."],
                ["Support growth", "A flexible digital foundation can grow into lead capture, commerce, automation or a client portal."],
              ].map(([t, d]) => (
                <article className="border-t border-[rgba(143,176,214,0.18)] pt-6" key={t}>
                  <h3 className="card-heading text-lg font-semibold text-white">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9FB3CC]">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            6. FINAL CTA: Only on Home page
            ======================================================== */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
