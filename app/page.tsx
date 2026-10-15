import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, Code2, Monitor, Rocket, Sparkles } from "lucide-react";
import { Navbar, Footer, CTA } from "@/components/site-shell";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/data/projects";

const proofPoints = [
  { icon: Monitor, label: "Custom", detail: "Designs" },
  { icon: Code2, label: "Clean", detail: "Code" },
  { icon: Rocket, label: "Faster", detail: "Growth" },
];

export default function Home() {
  return <>
    <Navbar />
    <main>
      <section className="hero grid-bg relative isolate overflow-hidden pt-24 sm:pt-28" aria-labelledby="hero-title">
        <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
        <div className="hero-ambient hero-ambient-two" aria-hidden="true" />
        <div className="wrap relative grid min-h-[min(820px,calc(100svh-1rem))] items-center gap-8 py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-2 lg:py-20">
          <div className="hero-copy relative z-10 max-w-[43rem]">
            <p className="hero-kicker hero-enter" style={{ "--enter-delay": "60ms" } as CSSProperties}><span>We design</span><i aria-hidden="true" /><span>Develop</span><i aria-hidden="true" /><span>Launch</span></p>
            <h1 id="hero-title" className="hero-title hero-enter" style={{ "--enter-delay": "150ms" } as CSSProperties}>Websites that<br /><em>look better,</em><br />work smarter<br />and <strong>grow</strong> your business.</h1>
            <p className="hero-description hero-enter" style={{ "--enter-delay": "250ms" } as CSSProperties}>We design and develop modern, high-performance websites that help startups and businesses build a strong online presence, attract customers, and grow faster.</p>
            <div className="hero-actions hero-enter" style={{ "--enter-delay": "340ms" } as CSSProperties}>
              <Link className="hero-primary button" href="/contact">Start a project <ArrowUpRight size={18} strokeWidth={2.3} /></Link>
              <a className="hero-secondary" href="#work">Explore our work <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-proof hero-enter" style={{ "--enter-delay": "430ms" } as CSSProperties}>{proofPoints.map(({ icon: Icon, label, detail }) => <div className="hero-proof-item" key={label}><span className="hero-proof-icon"><Icon size={23} strokeWidth={1.8} /></span><span>{label}<br />{detail}</span></div>)}</div>
          </div>

          <div className="hero-art hero-enter" style={{ "--enter-delay": "180ms" } as CSSProperties} aria-label="Water-inspired Garuda eagle artwork">
            <div className="hero-halo" aria-hidden="true" /><div className="hero-ring hero-ring-one" aria-hidden="true" /><div className="hero-ring hero-ring-two" aria-hidden="true" /><div className="hero-particle particle-one" aria-hidden="true" /><div className="hero-particle particle-two" aria-hidden="true" /><div className="hero-particle particle-three" aria-hidden="true" />
            <Image className="hero-eagle" src="/logo-eagle.png" alt="Garuda, a water-inspired blue eagle with outstretched wings" width={512} height={512} priority sizes="(max-width: 640px) 94vw, (max-width: 1024px) 70vw, 56vw" />
            <div className="hero-float-card hero-card-design" aria-hidden="true"><Sparkles size={22} /><span>Custom<br />Design</span></div>
            <div className="hero-float-card hero-card-code" aria-hidden="true"><Code2 size={22} /><span>Clean<br />Development</span></div>
            <div className="hero-float-card hero-card-growth" aria-hidden="true"><Rocket size={22} /><span>Built for<br />Growth</span></div>
          </div>
          <a href="#work" aria-label="Scroll to selected work" className="hero-scroll"><ArrowDown size={17} /></a>
        </div>
      </section>

      <section className="border-y border-white/10 py-5"><div className="wrap flex flex-wrap justify-between gap-4 text-xs font-semibold uppercase tracking-[.16em] text-zinc-500"><span>Strategy</span><span>Design</span><span>Development</span><span>Growth</span><span>Systems</span></div></section>
      <section id="work" className="wrap py-28"><div className="mb-12 flex items-end justify-between gap-6"><div><p className="eyebrow">Selected work</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Useful by design.<br />Beautiful by default.</h2></div><Link href="/work" className="hidden text-sm font-semibold text-zinc-300 hover:text-white sm:block">All projects →</Link></div><div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["4", "Selected projects"], ["6", "Core services"], ["5+", "Web technologies"], ["1", "End-to-end partner"]].map(([n, l]) => <div className="rounded-xl border border-white/10 bg-[#0b0b0d] p-4" key={l}><p className="text-2xl font-semibold text-[#61a6ff]">{n}</p><p className="mt-1 text-xs text-muted">{l}</p></div>)}</div><div className="grid gap-5 md:grid-cols-2">{projects.filter(x => x.featured).map((p, i) => <ProjectCard project={p} large={i === 0} key={p.slug} />)}</div></section>
      <section className="border-y border-white/10 bg-[#0b0b0d]"><div className="wrap grid gap-12 py-28 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Why go digital</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Your website is your hardest-working first impression.</h2><p className="mt-5 max-w-md text-muted">It is where people check whether you are credible, understand what you offer and decide whether to contact or buy from you—often before they speak to anyone.</p></div><div className="grid gap-x-8 sm:grid-cols-2">{[["Always discoverable", "Give customers a clear place to find you, understand your services and make contact."], ["Build trust faster", "A polished, current experience signals care, reliability and professionalism."], ["Make decisions easier", "Clear information, proof and calls to action help visitors take the next step."], ["Support growth", "A flexible digital foundation can grow into lead capture, commerce, automation or a client portal."]].map(([t, d]) => <article className="border-t border-white/10 py-6" key={t}><h3 className="text-xl font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-muted">{d}</p></article>)}</div></div></section>
      <section className="wrap py-28"><p className="eyebrow">A deliberate process</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Less guesswork. More momentum.</h2><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["01", "Understand", "Business, audience, requirements and goals."], ["02", "Plan", "Structure, journey, direction and technology."], ["03", "Design", "Create a distinctive visual experience."], ["04", "Develop", "Build responsive, scalable functionality."], ["05", "Launch", "Test, optimize and deploy with care."], ["06", "Grow", "Support SEO, analytics and future moves."]].map(([n, t, d]) => <article className="rounded-2xl border border-white/10 p-6" key={n}><p className="text-sm text-[#61a6ff]">{n}</p><h3 className="mt-8 text-xl font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-muted">{d}</p></article>)}</div></section>
      <section className="wrap pb-12"><div className="grid gap-10 border-y border-white/10 py-20 md:grid-cols-2"><div><p className="eyebrow">Why work together</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em]">Design thinking with a builder’s mindset.</h2></div><div className="grid content-start gap-4">{["Design + development in one focused partnership", "Technology choices grounded in business requirements", "Responsive, performant experiences from day one", "End-to-end execution from idea to deployment"].map(x => <p className="flex gap-3 text-zinc-300" key={x}><Check className="mt-0.5 text-[#61a6ff]" size={17} />{x}</p>)}</div></div></section>
      <CTA />
    </main>
    <Footer />
  </>;
}
