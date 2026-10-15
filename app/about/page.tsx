import { Navbar, Footer } from "@/components/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Garuda Web Designer and Developer",
  description: "I work across product design, development, business workflows, automation, SEO and digital presence.",
};

const groups = {
  Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML / CSS"],
  Backend: ["Node.js", "Express", "REST APIs", "Authentication"],
  Data: ["MongoDB", "SQL", "Cloud databases"],
  "Tools & Growth": ["Git / GitHub", "Vercel", "Render", "SEO", "Analytics", "Payment integration"],
};

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-36">
        <section className="wrap pb-14 sm:pb-20">
          <p className="eyebrow">About</p>
          <h1 className="hero-heading mt-5 max-w-4xl font-semibold">
            I build digital experiences that solve real business problems.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            I work across product design, development, business workflows, automation, SEO and digital presence—bringing the pieces together into work that looks clear and works hard.
          </p>

          <div className="mt-20 grid gap-8 sm:grid-cols-2">
            {Object.entries(groups).map(([name, items]) => (
              <section
                key={name}
                className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[#1B2B45]/60 to-[#141E30]/70 p-7 sm:p-8 shadow-[var(--shadow-soft)]"
              >
                <h2 className="card-heading text-[var(--text)]">{name}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((x) => (
                    <span
                      className="rounded-full border border-[var(--border)] bg-[#141E30]/80 px-3.5 py-1.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[#1B2B45]"
                      key={x}
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
