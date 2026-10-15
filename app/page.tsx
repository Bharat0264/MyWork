import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { Navbar, Footer, CTA } from "@/components/site-shell";
import { StartProjectButton } from "@/components/cta-button";
import { WorkPortfolioShowcase } from "@/components/work-portfolio-showcase";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO SECTION */}
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
                <p className="p-7 text-xs font-medium tracking-wider text-[var(--text-muted)]">DIGITAL EXPERIENCE</p>
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

            <a href="#work" aria-label="Scroll to work" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
              <ArrowDown size={18} />
            </a>
          </div>
        </section>

        {/* PILLARS STRIP */}
        <section className="border-y border-[var(--border)] bg-[#141E30]/40 py-5">
          <div className="wrap flex flex-wrap justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            <span>Strategy</span>
            <span>Design</span>
            <span>Development</span>
            <span>Growth</span>
            <span>Systems</span>
          </div>
        </section>

        {/* WORK SHOWCASE */}
        <WorkPortfolioShowcase />

        {/* WHY GO DIGITAL */}
        <section className="border-y border-[var(--border)] bg-[#141E30]/60">
          <div className="wrap grid gap-12 py-24 sm:py-28 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Why go digital</p>
              <h2 className="section-heading mt-4 font-semibold">
                Your website is your hardest-working first impression.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[var(--text-muted)]">
                It is where people check whether you are credible, understand what you offer and decide whether to contact or buy from you—often before they speak to anyone.
              </p>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              {[
                ["Always discoverable", "Give customers a clear place to find you, understand your services and make contact."],
                ["Build trust faster", "A polished, current experience signals care, reliability and professionalism."],
                ["Make decisions easier", "Clear information, proof and calls to action help visitors take the next step."],
                ["Support growth", "A flexible digital foundation can grow into lead capture, commerce, automation or a client portal."],
              ].map(([t, d]) => (
                <article className="border-t border-[var(--border)] py-6" key={t}>
                  <h3 className="card-heading">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DELIBERATE PROCESS */}
        <section className="wrap py-24 sm:py-28">
          <p className="eyebrow">A deliberate process</p>
          <h2 className="section-heading mt-4 max-w-2xl font-semibold">
            Less guesswork. More momentum.
          </h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["01", "Understand", "Business, audience, requirements and goals."],
              ["02", "Plan", "Structure, journey, direction and technology."],
              ["03", "Design", "Create a distinctive visual experience."],
              ["04", "Develop", "Build responsive, scalable functionality."],
              ["05", "Launch", "Test, optimize and deploy with care."],
              ["06", "Grow", "Support SEO, analytics and future moves."],
            ].map(([n, t, d]) => (
              <article
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[#1B2B45] to-[#141E30] p-7 sm:p-8 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                key={n}
              >
                <p className="text-sm font-semibold tracking-wider text-[var(--mist)]">{n}</p>
                <h3 className="card-heading mt-6">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* WHY WORK TOGETHER */}
        <section className="wrap pb-16">
          <div className="grid gap-10 border-y border-[var(--border)] py-20 md:grid-cols-2">
            <div>
              <p className="eyebrow">Why work together</p>
              <h2 className="section-heading mt-4 font-semibold">
                Design thinking with a builder’s mindset.
              </h2>
            </div>
            <div className="grid content-start gap-4">
              {[
                "Design + development in one focused partnership",
                "Technology choices grounded in business requirements",
                "Responsive, performant experiences from day one",
                "End-to-end execution from idea to deployment",
              ].map((x) => (
                <p className="flex items-center gap-3 text-[var(--text)]" key={x}>
                  <Check className="shrink-0 text-[var(--mist)]" size={18} />
                  <span>{x}</span>
                </p>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
