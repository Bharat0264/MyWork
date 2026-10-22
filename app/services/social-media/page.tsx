import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/site-shell";
import { Container } from "@/components/container";
import { SocialMediaPlans } from "@/components/social-media-plans";
import { socialPackages } from "@/data/social-packages";

export const metadata: Metadata = {
  title: {
    absolute: "Social Media Management & Monthly Plans · Garuda Studio",
  },
  description:
    "Steady on-brand content for your business every week. Choose a monthly social media plan or build a custom package for posts, reels, and reporting.",
  keywords: [
    "social media management",
    "monthly social media plans",
    "social media marketing packages",
    "reels and posts management",
    "content creation for small business",
    "Garuda Studio",
  ],
  alternates: {
    canonical: "https://my-work-umber.vercel.app/services/social-media",
  },
  openGraph: {
    title: "Social Media Management & Monthly Plans · Garuda Studio",
    description:
      "Steady on-brand content for your business every week. Choose a monthly social media plan or build a custom package for posts, reels, and reporting.",
    url: "https://my-work-umber.vercel.app/services/social-media",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Garuda Social Media Management" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media Management & Monthly Plans · Garuda Studio",
    description:
      "Steady on-brand content for your business every week. Choose a monthly social media plan or build a custom package for posts, reels, and reporting.",
    images: ["/og-image.png"],
  },
};

export default function SocialMediaPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Social Media Management",
    name: "Social Media Management & Monthly Content Packages",
    description:
      "Consistent, on-brand posts and short videos, planned, designed, scheduled and reported every month.",
    provider: {
      "@type": "ProfessionalService",
      name: "Garuda Web Design & Development Studio",
      url: "https://my-work-umber.vercel.app",
      image: "https://my-work-umber.vercel.app/og-image.png",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Social Media Monthly Plans",
      itemListElement: socialPackages.map((pkg) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${pkg.name} Social Media Plan`,
          description: pkg.tagline,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Navbar />
      <main id="content" className="page-transition bg-transparent">
        <Container className="space-y-[var(--header-gap)]">
          {/* Header Block */}
          <header className="max-w-[780px]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#A9C8EB] flex items-center gap-2.5 md:text-[12px] md:tracking-[0.2em] md:text-[#8FB0D6]">
              <span className="inline-block w-6 h-px bg-[#8FB0D6]" aria-hidden="true" />
              <span>SOCIAL MEDIA MANAGEMENT</span>
            </p>
            <h1 className="mt-3 font-semibold text-white tracking-[-0.02em] leading-[1.1] text-[clamp(36px,9vw,48px)] md:text-[clamp(2.4rem,4.8vw,3.6rem)]">
              Steady content for your brand, every week.
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] leading-[1.65] text-[#B8C9DE] md:text-[18px] md:leading-[1.7] md:text-[#9FB3CC]">
              Pick a monthly plan or build your own. We plan, create, schedule and report, so you can focus on your business.
            </p>
          </header>

          {/* Interactive Plans & Content Sections */}
          <SocialMediaPlans />
        </Container>
      </main>
      <Footer />
    </>
  );
}
