import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Check, Users } from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";
import { Container } from "@/components/container";
import { teamMembers } from "@/data/team";

const AboutCardStack = dynamic(
  () => import("@/components/about-card-stack").then((mod) => mod.AboutCardStack),
  {
    ssr: true,
    loading: () => <div className="min-h-[500px] w-full" aria-busy="true" />,
  }
);

function GithubIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34M7.85 18.5V10.1H5.06v8.4h2.79z"/>
    </svg>
  );
}

export const metadata: Metadata = {
  title: {
    absolute: "About Garuda · Web Design & Development Studio",
  },
  description:
    "We are a small, tight-knit web design & development studio. Meet the team building fast, modern websites for growing businesses.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/about",
  },
  openGraph: {
    title: "About Garuda · Web Design & Development Studio",
    description: "We are a small, tight-knit web design & development studio. Meet the team building fast, modern websites for growing businesses.",
    url: "https://my-work-umber.vercel.app/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Garuda · Web Design & Development Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Garuda · Web Design & Development Studio",
    description: "We are a small, tight-knit web design & development studio. Meet the team building fast, modern websites for growing businesses.",
    images: ["/og-image.png"],
  },
};

export default function About() {
  const studioJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Garuda Web Design & Development Studio",
    url: "https://my-work-umber.vercel.app/about",
    image: "https://my-work-umber.vercel.app/og-image.png",
    description:
      "A tight-knit web design & development studio founded by a small group of friends. We design and build fast, modern websites for businesses and startups.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    member: teamMembers.map((m) => ({
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd) }}
      />
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        {/* HERO HEADER */}
        <Container as="section" className="pt-0 pb-[calc(var(--section-gap)/2)]">
          <div className="max-w-[64ch]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#A9C8EB] md:text-[12px] md:tracking-[0.2em] md:text-[#8FB0D6]">
              About us
            </p>
            <h1 className="mt-3 text-white font-semibold text-[clamp(36px,9vw,40px)] leading-[1.1] tracking-[-0.02em] md:text-[clamp(2rem,4.2vw,3.2rem)] md:leading-[1.12]">
              We build websites that solve real business problems.
            </h1>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-[#B8C9DE] md:text-[17px] md:leading-[1.7] md:text-[#9FB3CC]">
              We&apos;re a small, tight-knit web design and development studio. We combine design, code and SEO, so your website looks great and works well.
            </p>
          </div>

          {/* THE STAGE: Tools we use */}
          <div className="mt-[var(--header-gap)]">
            <div className="mb-4">
              <p className="eyebrow text-[#8FB0D6]">Stack</p>
              <h2 className="section-heading mt-2 font-semibold text-white text-2xl sm:text-3xl tracking-tight">
                Tools we use
              </h2>
            </div>
            <AboutCardStack />
          </div>
        </Container>

        {/* MEET THE TEAM */}
        <Container as="section" className="pt-[calc(var(--section-gap)/2)] pb-[calc(var(--section-gap)/2)] border-t border-[rgba(143,176,214,0.18)]">
          <div className="max-w-2xl mb-[var(--header-gap)]">
            <p className="eyebrow text-[#8FB0D6] flex items-center gap-2">
              <Users size={16} className="text-[#8FB0D6]" />
              The Team
            </p>
            <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Meet the team
            </h2>
            <p className="mt-4 text-[#B8C9DE] text-base leading-relaxed">
              We are a close-knit group of friends building great digital experiences. When you work with us, you collaborate directly with the people designing and coding your site.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/85 to-[#141E30]/90 p-6 sm:p-7 shadow-[0_12px_32px_rgba(4,9,18,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(143,176,214,0.35)] hover:shadow-[0_20px_40px_rgba(4,9,18,0.5)]"
              >
                <div>
                  {/* Photo placeholder / avatar frame */}
                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-[rgba(143,176,214,0.25)] bg-gradient-to-br from-[#273F63] to-[#141F32] shadow-inner overflow-hidden text-[#E8EEF7]">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-mono text-xl font-bold tracking-wider text-[#A9C8EB]">
                          {member.initials}
                        </span>
                      </div>
                    )}
                    {/* Subtle status dot */}
                    <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#141E30] bg-emerald-400" aria-hidden="true" />
                  </div>

                  {/* Name & Role */}
                  <h3 className="card-heading text-xl font-semibold text-white tracking-tight">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[13px] font-semibold uppercase tracking-wider text-[#8FB0D6]">
                    {member.role}
                  </p>

                  {/* One-line bio */}
                  <p className="mt-3 text-[15px] leading-relaxed text-[#B8C9DE]">
                    {member.bio}
                  </p>
                </div>

                {/* Optional Social Links */}
                {(member.github || member.linkedin) && (
                  <div className="mt-6 flex items-center gap-2.5 pt-4 border-t border-[rgba(143,176,214,0.14)]">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on GitHub`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                      >
                        <GithubIcon />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>

        {/* WHY CLIENTS CHOOSE US */}
        <Container as="section" className="pt-[calc(var(--section-gap)/2)] pb-0 border-t border-[rgba(143,176,214,0.18)]">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="eyebrow text-[#8FB0D6]">Why work with us</p>
              <h2 className="section-heading mt-3 font-semibold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Why clients choose us
              </h2>
              <p className="mt-4 text-[#B8C9DE] text-base leading-relaxed max-w-md">
                We combine design, code and SEO into a direct, collaborative partnership—so your website looks credible, loads fast and brings in customers.
              </p>
            </div>
            <div className="grid content-start gap-4">
              {[
                "Direct collaboration with the creators",
                "Technology chosen for your business needs",
                "Fast, mobile-friendly websites from day one",
                "Support from idea to launch and beyond",
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
