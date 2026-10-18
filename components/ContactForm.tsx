"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Cpu,
  IndianRupee,
  Layout,
  Loader2,
  Monitor,
  MoreHorizontal,
  PenTool,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import styles from "./contact-form.module.css";
import { GlassSelect, GlassOption } from "./ui/GlassSelect";

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

const SERVICE_OPTIONS: GlassOption[] = [
  {
    value: "Website Design",
    label: "Website Design",
    hint: "Look, feel and layouts",
    icon: Monitor,
  },
  {
    value: "Website Development",
    label: "Website Development",
    hint: "Build, features and speed",
    icon: Code2,
  },
  {
    value: "Redesign",
    label: "Redesign",
    hint: "Refresh an existing site",
    icon: RefreshCw,
  },
  {
    value: "Landing Page",
    label: "Landing Page",
    hint: "One page built to convert",
    icon: Layout,
  },
  {
    value: "UI/UX Design",
    label: "UI/UX Design",
    hint: "Screens, flows and prototypes",
    icon: PenTool,
  },
  {
    value: "AI Integration",
    label: "AI Integration",
    hint: "Smart assistants and workflows, on request",
    icon: Cpu,
  },
  {
    value: "Something else",
    label: "Something else",
    hint: "Tell us in your message",
    icon: MoreHorizontal,
  },
];

const BUDGET_OPTIONS: GlassOption[] = [
  {
    value: "Under ₹25,000",
    label: "Under ₹25,000",
    icon: IndianRupee,
  },
  {
    value: "₹25,000 to ₹50,000",
    label: "₹25,000 to ₹50,000",
    icon: IndianRupee,
  },
  {
    value: "₹50,000 to ₹1,00,000",
    label: "₹50,000 to ₹1,00,000",
    icon: IndianRupee,
  },
  {
    value: "Above ₹1,00,000",
    label: "Above ₹1,00,000",
    icon: IndianRupee,
  },
  {
    value: "Not sure yet",
    label: "Not sure yet",
    icon: IndianRupee,
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormProps {
  hasAiKey?: boolean;
}

export function ContactForm({ hasAiKey = false }: ContactFormProps) {
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Time-on-page spam protection
  const mountTimeRef = useRef<number>(Date.now());

  // AI assistant state
  const [aiAvailable, setAiAvailable] = useState<boolean>(hasAiKey);
  const [isImproving, setIsImproving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Textarea auto-grow ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check AI service availability on client
  useEffect(() => {
    let active = true;
    fetch("/api/improve-message")
      .then((res) => res.json() as Promise<{ available?: boolean }>)
      .then((data) => {
        if (active && typeof data?.available === "boolean") {
          setAiAvailable(data.available);
        }
      })
      .catch(() => {
        // Keep initial SSR state
      });
    return () => {
      active = false;
    };
  }, []);

  // Handle URL query ?service=ai-integration on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      if (serviceParam === "ai-integration") {
        setValues((current) => ({ ...current, service: "AI Integration" }));
        params.delete("service");
        const remaining = params.toString();
        const cleanUrl =
          window.location.pathname +
          (remaining ? `?${remaining}` : "") +
          window.location.hash;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  // Textarea auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(120, el.scrollHeight)}px`;
    }
  }, [values.details]);

  const validateField = useCallback((field: Field, val: string): string | undefined => {
    switch (field) {
      case "name":
        if (!val.trim()) return "Please enter your name.";
        if (val.trim().length < 2) return "Name must be at least 2 characters.";
        return undefined;
      case "email":
        if (!val.trim()) return "Please enter your email address.";
        if (!emailPattern.test(val.trim())) return "Please enter a valid email address.";
        return undefined;
      case "service":
        if (!val) return "Please choose a service.";
        return undefined;
      case "details":
        if (!val.trim()) return "Please add a brief description of your project.";
        if (val.trim().length < 10) return "Please add at least 10 characters.";
        return undefined;
      default:
        return undefined;
    }
  }, []);

  function handleBlur(field: Field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    // If already touched, revalidate dynamically
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((current) => ({ ...current, [field]: err }));
    }

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function validateAll(): Errors {
    const nextErrors: Errors = {};
    const nameErr = validateField("name", values.name);
    if (nameErr) nextErrors.name = nameErr;

    const emailErr = validateField("email", values.email);
    if (emailErr) nextErrors.email = emailErr;

    const serviceErr = validateField("service", values.service);
    if (serviceErr) nextErrors.service = serviceErr;

    const detailsErr = validateField("details", values.details);
    if (detailsErr) nextErrors.details = detailsErr;

    return nextErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Mark all required as touched
    setTouched({
      name: true,
      email: true,
      service: true,
      details: true,
    });

    const nextErrors = validateAll();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      // Focus first error field
      const firstField = Object.keys(nextErrors)[0];
      const element = document.getElementById(`contact-${firstField}`);
      element?.focus();
      return;
    }

    // Time-on-page bot defense (bots submit within < 2 seconds)
    const timeSpentMs = Date.now() - mountTimeRef.current;
    if (timeSpentMs < 1800) {
      console.warn("Fast submission detected; processing safely.");
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to send contact enquiry. Please try again."
        );
      }

      setValues(emptyValues);
      setHoneypot("");
      setTouched({});
      setErrors({});
      setAiSuggestion(null);
      setStatus("success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  // AI Improve Message action
  async function handleImproveMessage() {
    const raw = values.details.trim();
    if (raw.length < 5) return;

    setIsImproving(true);
    setAiError(null);

    try {
      const res = await fetch("/api/improve-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw }),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        suggestion?: string;
      } | null;

      if (!res.ok) {
        if (res.status === 503) {
          setAiAvailable(false);
        }
        throw new Error(
          data?.error || "Improve my message isn't available right now. You can still send your enquiry as it is."
        );
      }

      if (data?.suggestion) {
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Improve my message isn't available right now. You can still send your enquiry as it is.";
      setAiError(msg);
    } finally {
      setIsImproving(false);
    }
  }

  function handleApplyAiSuggestion() {
    if (aiSuggestion) {
      update("details", aiSuggestion);
      setAiSuggestion(null);
      setAiError(null);
      textareaRef.current?.focus();
    }
  }

  function handleDismissAiSuggestion() {
    setAiSuggestion(null);
    setAiError(null);
  }

  return (
    <form className={styles.formCard} noValidate onSubmit={submit}>
      <div className={styles.grid}>
        {/* Name (Required) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="contact-name">
            Name
            <span className={styles.requiredMarker} aria-hidden="true">*</span>
          </label>
          <div className={styles.inputControl}>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? "contact-name-error" : undefined}
              placeholder="Your name"
              value={values.name}
              onBlur={() => handleBlur("name")}
              onChange={(e) => update("name", e.target.value)}
              className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ""}`}
            />
          </div>
          {errors.name && touched.name && (
            <p id="contact-name-error" role="alert" aria-live="polite" className={styles.errorMessage}>
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email (Required) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="contact-email">
            Email
            <span className={styles.requiredMarker} aria-hidden="true">*</span>
          </label>
          <div className={styles.inputControl}>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email && touched.email)}
              aria-describedby={errors.email && touched.email ? "contact-email-error" : undefined}
              placeholder="you@company.com"
              value={values.email}
              onBlur={() => handleBlur("email")}
              onChange={(e) => update("email", e.target.value)}
              className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ""}`}
            />
          </div>
          {errors.email && touched.email && (
            <p id="contact-email-error" role="alert" aria-live="polite" className={styles.errorMessage}>
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="contact-phone">
            Phone
            <span className={styles.optionalTag}>(optional)</span>
          </label>
          <div className={styles.inputControl}>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Company (Optional) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="contact-company">
            Company
            <span className={styles.optionalTag}>(optional)</span>
          </label>
          <div className={styles.inputControl}>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Your company or studio"
              value={values.company}
              onChange={(e) => update("company", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Custom Liquid Glass Service Picker (Required) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} id="contact-service-label">
            What do you need?
            <span className={styles.requiredMarker} aria-hidden="true">*</span>
          </label>
          <GlassSelect
            id="contact-service"
            name="service"
            label="What do you need?"
            labelledBy="contact-service-label"
            value={values.service}
            placeholder="Choose a service"
            sheetTitle="Choose a service"
            sheetSubtitle="Select the service you're interested in"
            options={SERVICE_OPTIONS}
            required={true}
            hasError={Boolean(errors.service && touched.service)}
            onChange={(val) => {
              update("service", val);
              setTouched((prev) => ({ ...prev, service: true }));
            }}
            onBlur={() => handleBlur("service")}
          />
          {errors.service && touched.service && (
            <p id="contact-service-error" role="alert" aria-live="polite" className={styles.errorMessage}>
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.service}</span>
            </p>
          )}
        </div>

        {/* Custom Liquid Glass Budget Picker (Optional) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} id="contact-budget-label">
            Budget
            <span className={styles.optionalTag}>(optional)</span>
          </label>
          <GlassSelect
            id="contact-budget"
            name="budget"
            label="Budget"
            labelledBy="contact-budget-label"
            value={values.budget}
            placeholder="Select a range"
            sheetTitle="Budget"
            sheetSubtitle="Select your budget range"
            footnote="Just a guide. We confirm the final quote after we talk."
            allowClear={true}
            options={BUDGET_OPTIONS}
            required={false}
            hasError={Boolean(errors.budget && touched.budget)}
            onChange={(val) => {
              update("budget", val);
              setTouched((prev) => ({ ...prev, budget: true }));
            }}
            onBlur={() => handleBlur("budget")}
          />
        </div>

        {/* Project Description Textarea (Full Width, Required) */}
        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <div className="flex items-center justify-between">
            <label className={styles.label} htmlFor="contact-details">
              Project description
              <span className={styles.requiredMarker} aria-hidden="true">*</span>
            </label>
            <span className={styles.charCount} aria-live="polite">
              {values.details.length} / 1000
            </span>
          </div>
          <div className={styles.inputControl}>
            <textarea
              ref={textareaRef}
              id="contact-details"
              name="details"
              required
              aria-required="true"
              maxLength={1000}
              placeholder="Tell us a few words about what you want to build, key goals, and any design ideas…"
              value={values.details}
              onBlur={() => handleBlur("details")}
              onChange={(e) => update("details", e.target.value)}
              aria-invalid={Boolean(errors.details && touched.details)}
              aria-describedby={errors.details && touched.details ? "contact-details-error" : undefined}
              className={`${styles.textarea} ${errors.details && touched.details ? styles.inputError : ""}`}
            />
          </div>

          {errors.details && touched.details && (
            <p id="contact-details-error" role="alert" aria-live="polite" className={styles.errorMessage}>
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.details}</span>
            </p>
          )}

          {/* AI Helper Bar & Improve button - hidden if key is missing */}
          {aiAvailable && (
            <div className={styles.aiRow}>
              <span className={styles.aiHelperText}>
                Your draft is sent to an AI service to help polish your project description.
              </span>
              <button
                type="button"
                onClick={handleImproveMessage}
                disabled={values.details.trim().length < 5 || isImproving}
                className={styles.aiButton}
                title={
                  values.details.trim().length < 5
                    ? "Write a few words first to improve"
                    : "Polish and structure your project brief"
                }
              >
                {isImproving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Polishing brief…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-[#8FB0D6]" />
                    <span>Improve my message</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI Error notice if call fails */}
          {aiError && (
            <p role="alert" className={styles.aiErrorNotice}>
              {aiError}
            </p>
          )}

          {/* AI Suggestion Preview Box */}
          {aiSuggestion && (
            <div className={styles.aiSuggestionCard} role="region" aria-label="Suggested project brief">
              <div className={styles.aiSuggestionHeader}>
                <Sparkles size={15} />
                <span>Suggested Project Brief</span>
              </div>
              <p className={styles.aiSuggestionText}>{aiSuggestion}</p>
              <div className={styles.aiSuggestionActions}>
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className={styles.aiApplyBtn}
                >
                  Use this
                </button>
                <button
                  type="button"
                  onClick={handleDismissAiSuggestion}
                  className={styles.aiDismissBtn}
                >
                  Keep mine
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timeline (Optional, Full Width) */}
        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="contact-timeline">
            Timeline
            <span className={styles.optionalTag}>(optional)</span>
          </label>
          <div className={styles.inputControl}>
            <input
              id="contact-timeline"
              name="timeline"
              type="text"
              placeholder="e.g. Next month, within 2 weeks, or flexible"
              value={values.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Hidden honeypot for spam bots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
        }}
      >
        <label htmlFor="contact-hp">Leave this empty</label>
        <input
          id="contact-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Send Button & States */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className={styles.submitButton}
        >
          {status === "sending" ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Sending enquiry…</span>
            </>
          ) : (
            <>
              <Send size={17} className="stroke-[2.2]" />
              <span>Send enquiry</span>
            </>
          )}
        </button>
      </div>

      {/* Success State */}
      {status === "success" && (
        <div
          className={styles.successCard}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={24} className={styles.successIcon} />
          <div>
            <h3 className={styles.successTitle}>Enquiry sent successfully!</h3>
            <p className={styles.successText}>
              Thanks for telling us about your project. We&apos;ll review your requirements and reply within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className={styles.resetBtn}
            >
              Send another message
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div
          className={styles.errorCard}
          role="alert"
          aria-live="polite"
        >
          <div className={styles.errorRow}>
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage || "Unable to send your message right now."}</span>
          </div>
          <div className={styles.errorActions}>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className={styles.retryBtn}
            >
              <RotateCcw size={13} className="inline mr-1.5" />
              Try again
            </button>
            <span>
              Or email directly at{" "}
              <a
                href="mailto:bharathsaipulipati@gmail.com"
                className={styles.emailFallbackLink}
              >
                bharathsaipulipati@gmail.com
              </a>
            </span>
          </div>
        </div>
      )}
    </form>
  );
}


