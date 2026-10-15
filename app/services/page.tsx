import { Navbar, Footer, CTA } from "@/components/site-shell";
import { services } from "@/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Garuda Web Designer and Developer",
  description: "Every service is designed to solve a specific business problem—not just add another layer of digital polish.",
};

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="pt-36">
        <section className="wrap pb-20">
          <p className="eyebrow">Services</p>
          <h1 className="hero-heading mt-5 max-w-4xl font-semibold">
            A sharper digital presence starts here.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            Every service is designed to solve a specific business problem—not just add another layer of digital polish.
          </p>

          <div className="mt-16 grid border-t border-[var(--border)] md:grid-cols-2">
            {services.map(([n, t, d, why]) => (
              <article className="border-b border-[var(--border)] py-10 md:pr-10" key={n}>
                <p className="text-sm font-semibold tracking-wider text-[var(--mist)]">{n}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text)]">{t}</h2>
                <p className="mt-3 max-w-md leading-7 text-[var(--text-muted)]">{d}</p>
                <div className="mt-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[#1B2B45]/50 to-[#141E30]/60 p-5 shadow-[var(--shadow-soft)]">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--mist)]">
                    Why it matters
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text)]">{why}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
