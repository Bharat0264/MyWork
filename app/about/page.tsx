import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";
import { Container } from "@/components/container";

const AboutCardStack = dynamic(
  () => import("@/components/about-card-stack").then((mod) => mod.AboutCardStack),
  {
    ssr: true,
    loading: () => <div className="min-h-[500px] w-full" aria-busy="true" />,
  }
);

export const metadata: Metadata = {
  title: {
    absolute: "About Garuda · Web Designer & Developer",
  },
  description:
    "Meet the freelance developer who combines design, code and SEO to grow your business.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/about",
  },
  openGraph: {
    title: "About Garuda · Web Designer & Developer",
    description: "Meet the freelance developer who combines design, code and SEO to grow your business.",
    url: "https://my-work-umber.vercel.app/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Garuda · Web Designer & Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Garuda · Web Designer & Developer",
    description: "Meet the freelance developer who combines design, code and SEO to grow your business.",
    images: ["/og-image.png"],
  },
};

export default function About() {
  return (
    <>
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        <Container as="section" className="pt-0 pb-[calc(var(--section-gap)/2)]">
          {/* HEADER */}
          <div className="max-w-[64ch]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#A9C8EB] md:text-[12px] md:tracking-[0.2em] md:text-[#8FB0D6]">
              About
            </p>
            <h1 className="mt-3 text-white font-semibold text-[clamp(36px,9vw,40px)] leading-[1.1] tracking-[-0.02em] md:text-[clamp(2rem,4.2vw,3.2rem)] md:leading-[1.12]">
              I build websites that solve real business problems.
            </h1>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-[#B8C9DE] md:text-[17px] md:leading-[1.7] md:text-[#9FB3CC]">
              I&apos;m a web designer and developer who combines design, code and SEO, so your website looks great and works well.
            </p>
          </div>

          {/* THE STAGE: Tools I use */}
          <div className="mt-[var(--header-gap)]">
            <div className="mb-4">
              <p className="eyebrow text-[#8FB0D6]">Stack</p>
              <h2 className="section-heading mt-2 font-semibold text-white text-2xl sm:text-3xl tracking-tight">
                Tools I use
              </h2>
            </div>
            <AboutCardStack />
          </div>
        </Container>

        {/* WHY CLIENTS CHOOSE ME */}
        <Container as="section" className="pt-[calc(var(--section-gap)/2)] pb-0 border-t border-[rgba(143,176,214,0.18)]">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Why work with me</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Why clients choose me
              </h2>
              <p className="mt-4 text-[#B8C9DE] text-base leading-relaxed max-w-md">
                I combine design, code and SEO into one direct partnership—so your website looks credible, loads fast and brings in customers.
              </p>
            </div>
            <div className="grid content-start gap-4">
              {[
                "Design and development from one person",
                "Technology chosen for your business needs",
                "Fast, mobile-friendly websites from day one",
                "Support from idea to launch",
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
        </Container>
      </main>
      <Footer />
    </>
  );
}
