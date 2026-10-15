"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Building2, CalendarDays, ChevronDown, FileText, LayoutGrid, Mail, Phone, Send, Tag, UserRound } from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";

type Field = "name" | "email" | "phone" | "company" | "service" | "budget" | "details" | "timeline";
type Values = Record<Field, string>;
const empty: Values = { name: "", email: "", phone: "", company: "", service: "", budget: "", details: "", timeline: "" };
const services = ["Website Design", "Website Development", "Redesign", "Landing Page", "UI/UX Design", "Something else"];
const budgets = ["Under ₹25,000", "₹25,000 to ₹50,000", "₹50,000 to ₹1,00,000", "Above ₹1,00,000", "Not sure yet"];

export default function Contact() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");

  function update(field: Field, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (!values.service) next.service = "Please choose a service.";
    if (values.details.trim().length < 10) next.details = "Please add at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, website: honeypot }) });
      if (!response.ok) throw new Error("Send failed");
      setValues(empty);
      setHoneypot("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const input = (field: Field, label: string, Icon: typeof UserRound, type = "text", autoComplete?: string) => <div className="contact-field" key={field}>
    <label className="sr-only" htmlFor={`contact-${field}`}>{label}</label>
    <div className="contact-control"><Icon aria-hidden="true" size={22}/><input id={`contact-${field}`} name={field} type={type} autoComplete={autoComplete} placeholder={label} value={values[field]} onChange={event => update(field, event.target.value)} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `contact-${field}-error` : undefined}/></div>
    {errors[field] && <p className="contact-error" id={`contact-${field}-error`}>{errors[field]}</p>}
  </div>;

  const select = (field: "service" | "budget", label: string, Icon: typeof LayoutGrid, options: string[]) => <div className="contact-field">
    <label className="sr-only" htmlFor={`contact-${field}`}>{label}</label>
    <div className="contact-control contact-select"><Icon aria-hidden="true" size={22}/><select id={`contact-${field}`} name={field} value={values[field]} onChange={event => update(field, event.target.value)} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `contact-${field}-error` : undefined}><option value="" disabled>{label}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="contact-chevron" aria-hidden="true" size={18}/></div>
    {errors[field] && <p className="contact-error" id={`contact-${field}-error`}>{errors[field]}</p>}
  </div>;

  return <><Navbar/><main id="contact" className="contact-page"><section className="contact-card" aria-labelledby="contact-title"><div className="contact-intro"><div className="contact-bird-slot" aria-label="Space reserved for a white bird carrying an envelope"><img src="/contact-bird.png" alt="White bird carrying a sealed envelope" onLoad={event => event.currentTarget.parentElement?.classList.add("bird-loaded")} onError={event => { event.currentTarget.style.display = "none"; }}/></div><div className="contact-copy"><p className="contact-eyebrow">LET&apos;S CONNECT</p><h1 id="contact-title">Have a project<br/><span>in mind?</span></h1><p>Tell us what you&apos;re building, redesigning or trying to improve. Let&apos;s create something meaningful together.</p></div></div><form className="contact-panel" onSubmit={submit} noValidate><div className="contact-row">{input("name", "Your name", UserRound, "text", "name")}{input("email", "Your email address", Mail, "email", "email")}</div><div className="contact-row">{input("phone", "Phone (optional)", Phone, "tel", "tel")}{input("company", "Company (optional)", Building2, "text", "organization")}</div><div className="contact-row">{select("service", "What do you need?", LayoutGrid, services)}{select("budget", "Budget range", Tag, budgets)}</div><div className="contact-field contact-details"><label className="sr-only" htmlFor="contact-details">Project details</label><div className="contact-control"><FileText aria-hidden="true" size={22}/><textarea id="contact-details" name="details" placeholder="Project details" value={values.details} onChange={event => update("details", event.target.value)} aria-invalid={!!errors.details} aria-describedby={errors.details ? "contact-details-error" : undefined}/></div>{errors.details && <p className="contact-error" id="contact-details-error">{errors.details}</p>}</div>{input("timeline", "Timeline (optional)", CalendarDays, "text")}<div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={event => setHoneypot(event.target.value)}/></div><button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? <span className="contact-spinner" aria-hidden="true"/> : <Send size={22} aria-hidden="true"/>}<span>{status === "sending" ? "Sending…" : "Send message"}</span><ArrowRight size={22} aria-hidden="true"/></button>{status === "success" && <p className="contact-feedback contact-success" role="status">Thanks! Your message is on its way. I&apos;ll reply within 24 hours.</p>}{status === "error" && <p className="contact-feedback contact-failure" role="alert">Message could not be sent. Please try again.</p>}</form></section></main><Footer/></>;
}
