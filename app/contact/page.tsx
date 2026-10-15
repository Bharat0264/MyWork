import { ContactForm } from "@/components/ContactForm";
import { Footer, Navbar } from "@/components/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Garuda Web Designer and Developer",
  description: "Tell me what you’re building, redesigning or trying to improve.",
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <main
        id="contact"
        className="wrap grid grid-cols-1 items-center gap-12 pb-24 pt-36 min-[900px]:grid-cols-[minmax(0,15fr)_minmax(0,13fr)] min-[900px]:gap-14"
      >
        <section aria-label="Project enquiry form" className="flex w-full justify-center min-[900px]:justify-start">
          <ContactForm />
        </section>

        <section className="flex w-full items-center justify-center min-[900px]:justify-end">
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
      </main>
      <Footer />
    </>
  );
}
