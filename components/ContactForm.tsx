"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
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
  );
}
