import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";

const AboutCardStack = dynamic(
  () => import("@/components/about-card-stack").then((mod) => mod.AboutCardStack),
  {
    ssr: true,
    loading: () => <div className="min-h-[500px] w-full" aria-busy="true" />,
  }
);

export const metadata: Metadata = {
  title: "About | Garuda Web Designer and Developer",
  description:
    "I build digital experiences that solve real business problems, bridging product design, development, and digital presence.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/about",
  },
  openGraph: {
    title: "About · Garuda",
    description: "I build digital experiences that solve real business problems.",
    url: "https://my-work-umber.vercel.app/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Garuda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Garuda",
    description: "I build digital experiences that solve real business problems.",
    images: ["/og-image.png"],
  },
};

export default function About() {
  return (
    <>
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        <section className="wrap pt-0 pb-[calc(var(--section-gap)/2)]">
          {/* HEADER */}
          <div className="max-w-[1200px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8FB0D6]">
              About
            </p>
            <h1 className="mt-3 max-w-[760px] text-white font-semibold text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.12] tracking-[-0.02em]">
              I build digital experiences that solve real business problems.
            </h1>
            <p className="mt-4 max-w-[560px] text-[17px] leading-[1.65] text-[#9FB3CC]">
              I work across product design, development, business workflows, automation, SEO and digital presence—bringing the pieces together into work that looks clear and works hard.
            </p>
          </div>

          {/* THE STAGE: Interactive Stacked Cards */}
          <div className="mt-[var(--header-gap)]">
            <AboutCardStack />
          </div>
        </section>

        {/* WHY WORK TOGETHER: Design thinking with a builder's mindset */}
        <section className="wrap pt-[calc(var(--section-gap)/2)] pb-0 border-t border-[rgba(143,176,214,0.18)]">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Why work together</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Design thinking with a builder’s mindset.
              </h2>
              <p className="mt-4 text-[#9FB3CC] text-base leading-relaxed max-w-md">
                No silos between design files and the production codebase. Every aesthetic decision is made with real engineering and user outcomes in mind.
              </p>
            </div>
            <div className="grid content-start gap-4">
              {[
                "Design + development in one focused partnership",
                "Technology choices grounded in business requirements",
                "Responsive, performant experiences from day one",
                "End-to-end execution from idea to deployment",
              ].map((x) => (
                <div
                  className="flex items-center gap-3.5 rounded-2xl border border-[rgba(143,176,214,0.14)] bg-[#141E30]/70 p-4 text-[15px] text-[#E8EEF7]"
                  key={x}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8FB0D6]/15 text-[#8FB0D6]">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <span>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
