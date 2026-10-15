import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Globe,
  RefreshCw,
  Layers,
  ShoppingBag,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Navbar, Footer, CTA } from "@/components/site-shell";
import { StartProjectButton } from "@/components/cta-button";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

// Capabilities teaser services
const teaserServices = [
  { name: "Website Creation", icon: Globe },
  { name: "Website Redesign", icon: RefreshCw },
  { name: "Full-stack Development", icon: Layers },
  { name: "E-commerce", icon: ShoppingBag },
  { name: "SEO & Performance", icon: Zap },
  { name: "Digital Marketing", icon: TrendingUp },
];

// Core tech chips from existing About data
const coreTechChips = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
  "REST APIs",
  "Git",
];

export default function Home() {
  // 3 most recent projects for compact teaser cards
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="bg-transparent">
        {/* ========================================================
            a. HERO SECTION
            ======================================================== */}
        <section className="grid-bg relative overflow-hidden pt-36">
          <div className="absolute -right-32 top-8 h-96 w-96 rounded-full bg-[rgba(53,87,125,0.22)] blur-[120px]" />
          <div className="wrap relative grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--steel-light)]" />
                {siteConfig.availability}
              </p>
              <h1 className="hero-heading mt-7 max-w-3xl font-semibold">
                Websites built to{" "}
                <em className="font-normal italic text-[var(--mist)]">look better,</em>{" "}
                work smarter, and grow faster.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
                I create, redesign and develop modern websites and digital experiences for businesses, startups and growing brands.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link className="button" href="/work">
                  View my work <ArrowUpRight size={16} />
                </Link>
                <StartProjectButton />
              </div>
            </div>

            {/* 3D PERSPECTIVE GRAPHIC */}
            <div className="perspective relative hidden h-[440px] lg:block">
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
              href="#recent-work"
              aria-label="Scroll to featured work"
              className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowDown size={18} />
            </a>
          </div>
        </section>

        {/* ========================================================
            b. TRUST STRIP: Pillars row under hero
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
            c. FEATURED WORK (TEASER): Recent work with 3 compact cards
            ======================================================== */}
        <section id="recent-work" className="wrap py-16 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Featured projects</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Recent work
              </h2>
            </div>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8FB0D6] transition-colors hover:text-white self-start sm:self-auto"
            >
              <span>See all work</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* 3 Compact Project Cards Row (scroll-snap on mobile) */}
          <div className="mt-10 sm:mt-12 flex overflow-x-auto pb-4 gap-5 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href="/work"
                className="group flex flex-col rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/90 via-[#141E30]/80 to-[#0B1322]/90 p-3.5 sm:p-4 shadow-[0_16px_36px_rgba(4,9,18,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(143,176,214,0.38)] hover:shadow-[0_20px_48px_rgba(4,9,18,0.6)] cursor-pointer snap-center shrink-0 w-[84vw] max-w-[340px] md:w-auto md:max-w-none"
              >
                {/* 16:10 Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#0A0F1D] border border-white/10">
                  <img
                    src={`/projects/${project.slug}.webp`}
                    alt={`Preview of ${project.title}`}
                    width={1440}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Info row below thumbnail */}
                <div className="mt-4 flex items-center justify-between gap-3 px-1 pb-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-semibold text-white tracking-tight truncate group-hover:text-[#8FB0D6] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-[#9FB3CC] font-normal truncate">
                      {project.category}
                    </p>
                  </div>
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-[rgba(143,176,214,0.2)] bg-white/5 text-[#8FB0D6] transition-all duration-200 group-hover:bg-white group-hover:text-[#141E30] group-hover:scale-105">
                    <ArrowUpRight size={15} strokeWidth={2.2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================
            d. WHAT I DO (TEASER): What I can build for you (3x2 grid)
            ======================================================== */}
        <section className="wrap py-16 sm:py-24 border-t border-[rgba(143,176,214,0.16)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Capabilities</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                What I can build for you
              </h2>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8FB0D6] transition-colors hover:text-white self-start sm:self-auto"
            >
              <span>Explore services</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* 3x2 Grid of small glass tiles */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {teaserServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  href="/services"
                  className="group flex items-center justify-between rounded-[20px] border border-[rgba(143,176,214,0.16)] bg-[#1B2B45]/40 backdrop-blur-md px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(143,176,214,0.35)] hover:bg-[#1B2B45]/70 shadow-[0_8px_24px_rgba(4,9,18,0.3)]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#8FB0D6] transition-colors group-hover:border-white/25 group-hover:text-white">
                      <Icon size={19} strokeWidth={2} />
                    </span>
                    <span className="text-[15px] font-medium text-white tracking-tight truncate group-hover:text-[#8FB0D6] transition-colors">
                      {service.name}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-[#6F86A3] transition-colors group-hover:text-white"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            e. ABOUT (TEASER): Compact two-column band
            ======================================================== */}
        <section className="wrap py-16 sm:py-24 border-t border-[rgba(143,176,214,0.16)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            {/* Left Column: Fresh 2-sentence intro + link to /about */}
            <div>
              <p className="eyebrow text-[#8FB0D6]">About</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                A builder’s approach to digital products.
              </h2>
              <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.65] text-[#9FB3CC] max-w-xl">
                I bridge the gap between thoughtful design and resilient full-stack code to turn ideas into digital products that perform. Every interface is built to load instantly, feel intuitive to users, and scale sustainably.
              </p>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#8FB0D6] transition-colors hover:text-white"
                >
                  <span>More about me</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Right Column: 8 Tech Chips in a Glass Container */}
            <div className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-[#1B2B45]/40 backdrop-blur-md p-6 sm:p-8 shadow-[0_16px_36px_rgba(4,9,18,0.3)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8FB0D6] mb-5">
                Core Technologies
              </p>
              <div className="flex flex-wrap gap-2.5">
                {coreTechChips.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-white/[0.14] bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-[#E8EEF7] shadow-sm transition-colors hover:border-white/25 hover:bg-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            f. FINAL CTA: Only on Home page
            ======================================================== */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
