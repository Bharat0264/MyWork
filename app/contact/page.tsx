"use client";

import { FormEvent, useState } from "react";
import { Navbar, Footer } from "@/components/site-shell";
import { siteConfig } from "@/config/site";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="wrap grid gap-14 pb-24 pt-36 lg:grid-cols-[.8fr_1.2fr]">
        <section>
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
        </section>

        <form
          onSubmit={submit}
          className="rounded-[var(--radius-card)] border border-[var(--border)] bg-gradient-to-br from-[#1B2B45]/70 to-[#141E30]/90 p-7 sm:p-10 shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Name", "text"],
              ["Email", "email"],
              ["Phone (optional)", "tel"],
              ["Company (optional)", "text"],
            ].map(([label, type]) => (
              <label className="text-sm font-medium text-[var(--text-muted)]" key={label}>
                {label}
                <input required={!label.includes("optional")} type={type} className="input mt-2" />
              </label>
            ))}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--text-muted)]">
              What do you need?
              <select className="input mt-2" defaultValue="">
                <option value="" disabled className="bg-[#141E30] text-[var(--text)]">
                  Choose a service
                </option>
                {[
                  "New Website",
                  "Website Redesign",
                  "Web Application",
                  "E-commerce",
                  "SEO",
                  "Marketing",
                  "Other",
                ].map((x) => (
                  <option key={x} className="bg-[#141E30] text-[var(--text)]">
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-[var(--text-muted)]">
              Budget
              <select className="input mt-2" defaultValue="">
                <option value="" disabled className="bg-[#141E30] text-[var(--text)]">
                  Select a range
                </option>
                {[
                  "Under ₹20,000",
                  "₹20,000 – ₹50,000",
                  "₹50,000 – ₹1,00,000",
                  "₹1,00,000+",
                  "Not sure yet",
                ].map((x) => (
                  <option key={x} className="bg-[#141E30] text-[var(--text)]">
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 block text-sm font-medium text-[var(--text-muted)]">
            Project description
            <textarea
              required
              className="input mt-2 min-h-32"
              placeholder="A few words about the project…"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-[var(--text-muted)]">
            Timeline
            <input className="input mt-2" placeholder="e.g. Next month" />
          </label>

          {sent ? (
            <p
              role="status"
              className="mt-6 rounded-xl border border-[var(--border-strong)] bg-[#1B2B45] p-4 text-sm text-[var(--text)]"
            >
              Thanks—your project details are ready to connect to an email service. I’ll be in touch soon.
            </p>
          ) : (
            <button className="button mt-7" type="submit">
              Let’s build something
            </button>
          )}
        </form>
      </main>
      <Footer />
    </>
  );
}
