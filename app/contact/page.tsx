import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/site-shell";
import { ContactForm } from "@/components/ContactForm";

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
        id="contact"
        className="page-transition bg-transparent"
      >
        <div className="wrap grid grid-cols-1 items-center justify-items-center min-[900px]:justify-items-stretch min-[900px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 min-[900px]:gap-[56px]">
          {/* LEFT COLUMN: Enquiry Form Card */}
          <section aria-label="Project enquiry form" className="flex w-full justify-center min-[900px]:justify-start">
            <ContactForm />
          </section>

          {/* RIGHT COLUMN: Garuda Eagle Delivering Message Artwork */}
          <section aria-label="Garuda eagle artwork" className="flex w-full items-center justify-center min-[900px]:justify-end">
            <div className="w-full max-w-[320px] min-[900px]:max-w-[520px]">
              <picture className="block w-full">
                <source srcSet="/contact-eagle.webp" type="image/webp" />
                <img
                  src="/contact-eagle.png"
                  alt="Garuda eagle delivering a message"
                  width={1400}
                  height={1209}
                  loading="lazy"
                  sizes="(max-width: 899px) 320px, 520px"
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
