import type { Metadata } from "next";
import Image from "next/image";
import { Navbar, Footer } from "@/components/site-shell";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/ContactForm";
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
      <main
        id="content"
        className="page-transition bg-transparent"
      >
        <Container className="grid grid-cols-1 items-center justify-items-center min-[900px]:justify-items-stretch min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-12 min-[900px]:gap-[clamp(32px,5vw,96px)]">
          {/* LEFT COLUMN: Enquiry Form Card */}
          <section aria-label="Project enquiry form" className="flex w-full flex-col items-start">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 text-[clamp(36px,9vw,48px)] font-semibold leading-[1.1] tracking-tight text-white">Let’s start your project.</h1>
            <p className="mt-4 mb-6 max-w-[52ch] text-[16px] leading-relaxed text-[#B8C9DE]">Tell me what you’re building, redesigning or trying to improve.</p>
            <ContactForm />
            <div className="mt-6 flex w-full flex-col gap-2 text-[15px] text-[#D4E4F5] sm:flex-row sm:flex-wrap sm:gap-6">
              <a className="inline-flex min-h-11 items-center" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <a className="inline-flex min-h-11 items-center" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
            </div>
          </section>

          {/* RIGHT COLUMN: Garuda Eagle Delivering Message Artwork */}
          <section aria-label="Garuda eagle artwork" className="flex w-full items-center justify-center min-[900px]:justify-end">
            <div className="w-full max-w-[320px] min-[900px]:max-w-[640px]">
              <div className="block w-full">
                <Image
                  src="/contact-eagle.webp"
                  alt="Garuda eagle delivering a message"
                  width={1400}
                  height={1209}
                  loading="lazy"
                  sizes="(max-width: 899px) 320px, (max-width: 1680px) 45vw, 640px"
                  className="contact-eagle-floating h-auto w-full object-contain"
                />
              </div>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
