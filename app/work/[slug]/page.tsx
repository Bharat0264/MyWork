import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Navbar, Footer } from "@/components/site-shell";
import type { Metadata } from "next";
import { LiveProjectPreview } from "@/components/live-project-preview";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Case({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return notFound();

  return (
    <>
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        <section className="wrap">
          <p className="eyebrow">Case study · {p.year}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-8">
            <div>
              <h1 className="hero-heading font-semibold text-[var(--text)]">
                {p.title}
              </h1>
              <p className="mt-4 text-lg text-[var(--text-muted)]">
                {p.category} · {p.client}
              </p>
            </div>
            {p.liveUrl && (
              <a className="button" href={p.liveUrl} target="_blank" rel="noreferrer">
                Visit live site <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div
            className="project-art mt-[var(--header-gap)] h-[310px] rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-soft)] sm:h-[560px]"
            style={{ "--accent": p.accent } as React.CSSProperties}
          >
            <LiveProjectPreview project={p} />
          </div>
        </section>

        <section className="wrap grid gap-12 py-[calc(var(--section-gap)/2)] lg:grid-cols-[.65fr_1.35fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="eyebrow">Project details</p>
            <dl className="mt-7 space-y-5 text-sm">
              <div>
                <dt className="text-[var(--text-muted)]">Services</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{p.services.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Technology</dt>
                <dd className="mt-1 font-medium text-[var(--text)]">{p.technologies.join(", ")}</dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-16">
            <div>
              <p className="eyebrow">Overview</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[var(--text)]">
                {p.fullDescription}
              </h2>
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[#1B2B45]/70 to-[#141E30]/80 p-7 sm:p-8 shadow-[var(--shadow-soft)]">
                <p className="eyebrow">Challenge</p>
                <p className="mt-5 leading-7 text-[var(--text)]">{p.challenge}</p>
              </article>
              <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[#1B2B45]/70 to-[#141E30]/80 p-7 sm:p-8 shadow-[var(--shadow-soft)]">
                <p className="eyebrow">Solution</p>
                <p className="mt-5 leading-7 text-[var(--text)]">{p.solution}</p>
              </article>
            </div>

            <div>
              <p className="eyebrow">Built with</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {p.technologies.map((t) => (
                  <span
                    className="rounded-full border border-[var(--border)] bg-[#141E30]/80 px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[#1B2B45]"
                    key={t}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Link
                href="/work"
                className="text-sm font-semibold text-[var(--mist)] transition-colors hover:text-[var(--text)]"
              >
                Explore more work →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return {
    title: p ? `${p.title} Case Study | Garuda` : "Project | Garuda",
    description: p?.shortDescription,
    alternates: {
      canonical: `https://my-work-umber.vercel.app/work/${slug}`,
    },
  };
}
