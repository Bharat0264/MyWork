"use client";

import { FormEvent, useState } from "react";

type Field =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "budget"
  | "details"
  | "timeline";

type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success" | "error";

const emptyValues: Values = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  details: "",
  timeline: "",
};

const services = [
  "Website Design",
  "Website Development",
  "Redesign",
  "Landing Page",
  "UI/UX Design",
  "Something else",
];

const budgets = [
  "Under ₹25,000",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "Above ₹1,00,000",
  "Not sure yet",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function validate() {
    const nextErrors: Errors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.service) {
      nextErrors.service = "Please choose a service.";
    }

    if (values.details.trim().length < 10) {
      nextErrors.details = "Please add at least 10 characters.";
    }

    return nextErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      if (!response.ok) {
        throw new Error("Unable to send contact enquiry");
      }

      setValues(emptyValues);
      setHoneypot("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={submit}>
      <div className="contact-form__grid">
        <Field
          autoComplete="name"
          error={errors.name}
          field="name"
          label="Name"
          onChange={update}
          required
          type="text"
          value={values.name}
        />
        <Field
          autoComplete="email"
          error={errors.email}
          field="email"
          label="Email"
          onChange={update}
          required
          type="email"
          value={values.email}
        />
        <Field
          autoComplete="tel"
          error={errors.phone}
          field="phone"
          label="Phone (optional)"
          onChange={update}
          type="tel"
          value={values.phone}
        />
        <Field
          autoComplete="organization"
          error={errors.company}
          field="company"
          label="Company (optional)"
          onChange={update}
          type="text"
          value={values.company}
        />
        <SelectField
          error={errors.service}
          field="service"
          label="What do you need?"
          onChange={update}
          options={services}
          placeholder="Choose a service"
          required
          value={values.service}
        />
        <SelectField
          error={errors.budget}
          field="budget"
          label="Budget"
          onChange={update}
          options={budgets}
          placeholder="Select a range"
          value={values.budget}
        />
      </div>

      <TextAreaField
        error={errors.details}
        field="details"
        label="Project description"
        onChange={update}
        placeholder="A few words about the project…"
        required
        value={values.details}
      />

      <div className="contact-form__full-field">
        <Field
          error={errors.timeline}
          field="timeline"
          label="Timeline"
          onChange={update}
          placeholder="e.g. Next month"
          type="text"
          value={values.timeline}
        />
      </div>

      <div aria-hidden="true" className="contact-form__honeypot">
        <label htmlFor="contact-website">Website</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          type="text"
          value={honeypot}
        />
      </div>

      <button className="contact-form__submit" disabled={status === "sending"} type="submit">
        {status === "sending" && <span aria-hidden="true" className="contact-form__spinner" />}
        <span>{status === "sending" ? "Sending…" : "Let’s build something"}</span>
      </button>

      {status === "success" && (
        <p className="contact-form__feedback contact-form__feedback--success" role="status">
          Thanks! Your message is on its way. I&apos;ll reply within 24 hours.
        </p>
      )}

      {status === "error" && (
        <div className="contact-form__feedback contact-form__feedback--error" role="alert">
          <span>Something went wrong. Please try again.</span>
          <button onClick={() => setStatus("idle")} type="button">
            Try again
          </button>
        </div>
      )}
    </form>
  );
}

interface FieldProps {
  autoComplete?: string;
  error?: string;
  field: Exclude<Field, "service" | "budget" | "details">;
  label: string;
  onChange: (field: Field, value: string) => void;
  placeholder?: string;
  required?: boolean;
  type: "email" | "tel" | "text";
  value: string;
}

function Field({
  autoComplete,
  error,
  field,
  label,
  onChange,
  placeholder,
  required = false,
  type,
  value,
}: FieldProps) {
  const id = `contact-${field}`;
  const errorId = `${id}-error`;

  return (
    <div className="contact-form__field">
      <label htmlFor={id}>{label}</label>
      <div className="contact-form__control">
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          id={id}
          name={field}
          onChange={(event) => onChange(field, event.target.value)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      </div>
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  error?: string;
  field: "service" | "budget";
  label: string;
  onChange: (field: Field, value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  value: string;
}

function SelectField({
  error,
  field,
  label,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: SelectFieldProps) {
  const id = `contact-${field}`;
  const errorId = `${id}-error`;

  return (
    <div className="contact-form__field">
      <label htmlFor={id}>{label}</label>
      <div className="contact-form__control contact-form__select-control">
        <select
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          id={id}
          name={field}
          onChange={(event) => onChange(field, event.target.value)}
          required={required}
          value={value}
        >
          <option disabled value="">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" className="contact-form__chevron" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </svg>
      </div>
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps {
  error?: string;
  field: "details";
  label: string;
  onChange: (field: Field, value: string) => void;
  placeholder: string;
  required?: boolean;
  value: string;
}

function TextAreaField({ error, field, label, onChange, placeholder, required = false, value }: TextAreaFieldProps) {
  const id = `contact-${field}`;
  const errorId = `${id}-error`;

  return (
    <div className="contact-form__field contact-form__full-field">
      <label htmlFor={id}>{label}</label>
      <div className="contact-form__control contact-form__textarea-control">
        <textarea
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          id={id}
          minLength={10}
          name={field}
          onChange={(event) => onChange(field, event.target.value)}
          placeholder={placeholder}
          required={required}
          value={value}
        />
      </div>
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
