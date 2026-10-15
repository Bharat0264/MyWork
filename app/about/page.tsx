import { Navbar, Footer } from "@/components/site-shell";
import { AboutCardStack } from "@/components/about-card-stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Garuda Web Designer and Developer",
  description: "I work across product design, development, business workflows, automation, SEO and digital presence.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-36">
        <section className="wrap pb-14 sm:pb-20">
          {/* HEADER */}
          <div className="max-w-[1200px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8FB0D6]">
              About
            </p>
            <h1 className="mt-5 max-w-[760px] text-white font-semibold text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.12] tracking-[-0.02em]">
              I build digital experiences that solve real business problems.
            </h1>
            <p className="mt-7 max-w-[560px] text-[17px] leading-[1.65] text-[#9FB3CC]">
              I work across product design, development, business workflows, automation, SEO and digital presence—bringing the pieces together into work that looks clear and works hard.
            </p>
          </div>

          {/* THE STAGE: Interactive Stacked Cards */}
          <div className="mt-14">
            <AboutCardStack />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
