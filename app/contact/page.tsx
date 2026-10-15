import { Navbar, Footer } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Garuda Web Designer and Developer",
  description: "Tell me what you’re building, redesigning or trying to improve.",
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <main id="contact" className="wrap grid items-center gap-12 pb-24 pt-36 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* LEFT COLUMN: Contact Information */}
        <section className="flex flex-col items-start justify-center">
          <p className="eyebrow">Contact</p>
          <h1 className="hero-heading mt-5 font-semibold text-[var(--text)]">
            Have a project in mind?
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[var(--text-muted)]">
            Tell me what you’re building, redesigning or trying to improve.
          </p>
          <div className="mt-12 space-y-3.5 text-sm text-[var(--text-muted)]">
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
                rel="noreferrer"
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
      </main>
      <Footer />
    </>
  );
}
