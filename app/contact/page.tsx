import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/site-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact | Garuda Web Designer and Developer",
  description: "Tell me what you’re building, redesigning or trying to improve.",
  alternates: {
    canonical: "https://my-work-umber.vercel.app/contact",
  },
  openGraph: {
    title: "Contact · Garuda",
    description: "Have a project in mind? Tell me what you're building, redesigning or improving.",
    url: "https://my-work-umber.vercel.app/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Garuda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact · Garuda",
    description: "Have a project in mind? Tell me what you're building, redesigning or improving.",
    images: ["/og-image.png"],
  },
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <main id="content" className="pt-[72px] min-[900px]:pt-[84px] pb-24 min-[900px]:pb-0 page-transition bg-transparent">
        <div className="wrap grid items-center gap-12 pt-10 sm:pt-16 pb-20 sm:pb-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* LEFT COLUMN: Contact Information */}
          <section className="flex flex-col items-start justify-center">
            <p className="eyebrow">Contact</p>
            <h1 className="hero-heading mt-5 font-semibold text-[var(--text)]">
              Have a project in mind?
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-[var(--text-muted)]">
              Tell me what you’re building, redesigning or trying to improve.
            </p>
            <div className="mt-10 space-y-3.5 text-sm text-[var(--text-muted)]">
              <p>
                Email:{" "}
                <a
                  className="font-medium text-[var(--text)] underline transition-colors hover:text-[var(--mist)]"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  className="font-medium text-[var(--text)] underline transition-colors hover:text-[var(--mist)]"
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                GitHub:{" "}
                <a
                  className="font-medium text-[var(--text)] underline transition-colors hover:text-[var(--mist)]"
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Bharat0264
                </a>
              </p>
            </div>

            <div className="mt-8">
              <a
                href="mailto:bharathsaipulipati@gmail.com?subject=New%20project%20enquiry"
                className="button"
              >
                Let’s build something
              </a>
            </div>
          </section>

          {/* RIGHT COLUMN: Garuda Eagle Delivering Message Artwork */}
          <section className="flex w-full items-center justify-center lg:justify-end">
            <div className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[560px]">
              <picture className="block w-full">
                <source srcSet="/contact-eagle.webp" type="image/webp" />
                <img
                  src="/contact-eagle.png"
                  alt="Garuda eagle delivering a message"
                  width={1400}
                  height={1209}
                  loading="lazy"
                  sizes="(max-width: 900px) 340px, 560px"
                  className="contact-eagle-floating h-auto w-full object-contain"
                />
              </picture>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
