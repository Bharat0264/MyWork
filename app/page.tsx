import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
  Smartphone,
  RefreshCw,
  HeartHandshake,
} from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";
import { StartProjectButton } from "@/components/cta-button";
import { ViewProjectGlassButton } from "@/components/view-project-button";
import { Container } from "@/components/container";
import { CommitmentSlider } from "@/components/commitment-slider";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { projects } from "@/data/projects";

const heroTrustLine = "Free consultation · Reply within 24 hours";

export const metadata: Metadata = {
  title: {
    absolute: "Garuda · Web Design & Development Studio",
  },
  description:
    "We design and build fast, mobile-friendly websites for businesses and startups. Based in Chennai, working worldwide.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app",
  },
  openGraph: {
    title: "Garuda · Web Design & Development Studio",
    description:
      "We design and build fast, mobile-friendly websites for businesses and startups. Based in Chennai, working worldwide.",
    url: "https://my-work-umber.vercel.app",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda · Web Design & Development Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garuda · Web Design & Development Studio",
    description:
      "We design and build fast, mobile-friendly websites for businesses and startups. Based in Chennai, working worldwide.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  // Featured spotlight project: PrintBee
  const spotlightProject = projects.find((p) => p.slug === "printbee") || projects[1];
  const spotlightChips = spotlightProject.technologies.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Garuda Web Design & Development Studio",
    url: "https://my-work-umber.vercel.app",
    image: "https://my-work-umber.vercel.app/og-image.png",
    logo: "https://my-work-umber.vercel.app/logo-full.png",
    description:
      "A tight-knit web design & development studio. We design and build fast, mobile-friendly websites for businesses and startups.",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    areaServed: ["Chennai", "India", "Worldwide"],
    sameAs: [
      socialConfig.github,
      socialConfig.linkedin,
      socialConfig.instagram,
      socialConfig.x,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="content" className="home-main page-transition bg-transparent">
        {/* ========================================================
            1. HERO SECTION
            ======================================================== */}
        <section className="home-hero grid-bg relative">
          <Container className="home-hero__container relative">
            <div className="home-hero__grid">
              <div className="home-hero__content flex min-w-0 flex-col justify-center">
                <p className="eyebrow flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--steel-light)]" />
                  Web design &amp; development studio
                </p>
                <h1 className="hero-heading font-semibold text-white">
                  Websites that look premium and bring you customers.
                </h1>
                <p className="home-hero__description text-[#B8C9DE]">
                  We design and build fast, mobile-friendly websites for businesses and startups, so you look professional and get more enquiries.
                </p>
                <div className="home-hero__actions flex flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center">
                  <StartProjectButton className="home-hero__primary w-full sm:w-auto sm:max-w-[320px]" label="Start your project" />
                  <Link className="home-hero__secondary button-secondary" href="/work" prefetch={true}>
                    View our work <ArrowUpRight size={16} />
                  </Link>
                </div>
                <p className="home-hero__trust text-[#C3D5EA]">{heroTrustLine}</p>
              </div>

              <div className="home-hero__deck relative w-full min-w-0">
                <CommitmentSlider />
              </div>
            </div>

            <a
              href="#featured-project"
              aria-label="Scroll to featured project"
              className="home-hero__scroll hidden lg:flex absolute left-1/2 -translate-x-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowDown size={18} />
            </a>
          </Container>
        </section>

        {/* ========================================================
            2. TRUST / MARQUEE STRIP
            ======================================================== */}
        <section className="home-marquee border-y border-[var(--border)] bg-[#141E30]/40 py-5">
          <Container className="flex flex-wrap justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            <span>Strategy</span>
            <span>Design</span>
            <span>Development</span>
            <span>Growth</span>
            <span>Systems</span>
          </Container>
        </section>

        {/* ========================================================
            3. FEATURED PROJECT (ONE large spotlight card)
            ======================================================== */}
        <section id="featured-project" className="py-[calc(var(--section-gap)/2)]">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-[var(--header-gap)]">
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
                  <div className="hidden h-9 items-center gap-2 border-b border-white/10 bg-[#141E30]/80 px-4 md:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
                    <span className="ml-3 truncate text-[11px] font-mono text-[#A9C8EB]">
                      {spotlightProject.liveUrl?.replace(/^https?:\/\//, "") || "www.printbee.co.in"}
                    </span>
                  </div>

                  {/* Real screenshot inside mockup */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0F1D]">
                    <Image
                      src={`/projects/${spotlightProject.slug}.webp`}
                      alt="PrintBee digital print ordering website homepage screenshot"
                      width={1440}
                      height={900}
                      sizes="(max-width: 640px) calc(100vw - 80px), (max-width: 1024px) 50vw, 600px"
                      loading="lazy"
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
                  <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#B8C9DE]">
                    {spotlightProject.shortDescription}
                  </p>

                  {/* 3 Tech Chips */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {spotlightChips.map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.05] px-3.5 py-1.5 text-[13px] font-medium text-[#E8EEF7]"
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
                      <ViewProjectGlassButton project={spotlightProject} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ========================================================
            4. OUTCOMES: Clear deliverable promises
            ======================================================== */}
        <section className="py-[calc(var(--section-gap)/2)] border-t border-[rgba(143,176,214,0.16)]">
          <Container>
            <div className="max-w-2xl mb-[var(--header-gap)]">
              <p className="eyebrow text-[#8FB0D6]">Outcomes</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Clear deliverables, zero surprises.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Item 1: Fast delivery */}
              <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-6 sm:p-7 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6]">
                  <Clock3 size={22} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Fast delivery
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#B8C9DE]">
                  Clear deadline before we start
                </p>
              </div>

              {/* Item 2: Mobile-first */}
              <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-6 sm:p-7 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6]">
                  <Smartphone size={22} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Mobile-first
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#B8C9DE]">
                  Tested on real phones
                </p>
              </div>

              {/* Item 3: Free revisions */}
              <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-6 sm:p-7 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6]">
                  <RefreshCw size={22} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Free revisions
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#B8C9DE]">
                  Until you are happy
                </p>
              </div>

              {/* Item 4: After-launch support */}
              <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-6 sm:p-7 shadow-[0_12px_32px_rgba(4,9,18,0.35)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[#8FB0D6]">
                  <HeartHandshake size={22} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  After-launch support
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#B8C9DE]">
                  Included
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ========================================================
            5. WHY WORK WITH US
            ======================================================== */}
        <section className="border-t border-[rgba(143,176,214,0.16)] bg-[#141E30]/60 py-[calc(var(--section-gap)/2)]">
          <Container className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 items-center">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Why work with us</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Your website is your first impression.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-[#B8C9DE]">
                Customers check your website before they call you. We build sites that look credible, load fast and make it easy to contact you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                ["Easy to find", "Clean structure and search-ready code so Google and customers find you."],
                ["Builds trust", "A modern, credible design that reassures visitors before they even call."],
                ["Easy to use", "Intuitive navigation and fast load speeds on phones and laptops."],
                ["Built to grow", "Scalable foundation ready for new features, leads, and future growth."],
              ].map(([t, d]) => (
                <article className="border-t border-[rgba(143,176,214,0.18)] pt-6" key={t}>
                  <h3 className="card-heading text-lg font-semibold text-white">{t}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-[#9FB3CC]">{d}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
