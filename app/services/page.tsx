import { Footer, Navbar } from "@/components/site-shell";
import { ServicesGlassShowcase } from "@/components/services-glass-showcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Garuda Web Designer and Developer",
  description: "Every service is designed to solve a specific business problem—not just add another layer of digital polish.",
};

export default function Services() {
  return (
    <>
      <Navbar />
      <main className="bg-transparent">
        {/* HERO SHOWCASE: Glass slab & interactive spheres */}
        <ServicesGlassShowcase />

        {/* WHY GO DIGITAL: Core business value */}
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

        {/* A DELIBERATE PROCESS: 6-Step cards */}
        <section className="wrap py-20 sm:py-24 mb-6">
          <p className="eyebrow text-[#8FB0D6]">A deliberate process</p>
          <h2 className="section-heading mt-4 max-w-2xl font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Less guesswork. More momentum.
          </h2>
          <div className="mt-12 sm:mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["01", "Understand", "Business, audience, requirements and goals."],
              ["02", "Plan", "Structure, journey, direction and technology."],
              ["03", "Design", "Create a distinctive visual experience."],
              ["04", "Develop", "Build responsive, scalable functionality."],
              ["05", "Launch", "Test, optimize and deploy with care."],
              ["06", "Grow", "Support SEO, analytics and future moves."],
            ].map(([n, t, d]) => (
              <article
                className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45] to-[#141E30] p-7 sm:p-8 shadow-[0_16px_36px_rgba(4,9,18,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(143,176,214,0.35)]"
                key={n}
              >
                <p className="text-sm font-semibold tracking-wider text-[#8FB0D6]">{n}</p>
                <h3 className="card-heading mt-5 text-xl font-semibold text-white">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9FB3CC]">{d}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
