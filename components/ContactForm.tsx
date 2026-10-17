"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import styles from "./contact-form.module.css";
import {
  LiquidGlassServicePicker,
  LIQUID_GLASS_SERVICES,
} from "./LiquidGlassServicePicker";

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
  "AI Integration",
  "Something else",
];

const budgets = [
  "Under ₹25,00,0",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "Above ₹1,00,000",
  "Not sure yet",
];
// Normalize budget 1st item typo if any
const budgetOptions = [
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
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Time-on-page spam protection
  const mountTimeRef = useRef<number>(Date.now());

  // AI assistant state
  const [isImproving, setIsImproving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Liquid Glass Service Picker state
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  const serviceTriggerRef = useRef<HTMLButtonElement>(null);
  const selectedServiceObj = LIQUID_GLASS_SERVICES.find(
    (s) => s.name === values.service
  );

  // Textarea auto-grow ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        throw new Error(
          data?.error || "Unable to improve message right now. Your draft was kept as is."
        );
      }

      if (data?.suggestion) {
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not improve message. Your draft has been kept as is.";
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
          <div className="relative w-full">
            <button
              ref={serviceTriggerRef}
              type="button"
              id="contact-service"
              role="button"
              aria-haspopup="dialog"
              aria-expanded={isServicePickerOpen}
              aria-labelledby="contact-service-label contact-service"
              aria-required="true"
              aria-invalid={Boolean(errors.service && touched.service)}
              onClick={() => {
                setIsServicePickerOpen(true);
                setTouched((prev) => ({ ...prev, service: true }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                  e.preventDefault();
                  setIsServicePickerOpen(true);
                  setTouched((prev) => ({ ...prev, service: true }));
                }
              }}
              className={`${styles.selectTrigger} ${
                errors.service && touched.service ? styles.selectTriggerError : ""
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {selectedServiceObj && (
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: selectedServiceObj.bgTint,
                      color: selectedServiceObj.color,
                      border: `1px solid ${selectedServiceObj.borderTint}`,
                    }}
                  >
                    <selectedServiceObj.icon size={12} strokeWidth={2.4} />
                  </div>
                )}
                <span className={values.service ? styles.valueText : styles.placeholderText}>
                  {values.service || "Choose a service"}
                </span>
              </div>
              <ChevronDown
                aria-hidden="true"
                className={`${styles.chevronIcon} ${
                  isServicePickerOpen ? styles.chevronOpen : ""
                }`}
              />
            </button>
          </div>

          <LiquidGlassServicePicker
            isOpen={isServicePickerOpen}
            onClose={() => {
              setIsServicePickerOpen(false);
              serviceTriggerRef.current?.focus();
            }}
            selectedService={values.service}
            onSelectService={(val) => {
              update("service", val);
              setTouched((prev) => ({ ...prev, service: true }));
            }}
          />

          {errors.service && touched.service && (
            <p id="contact-service-error" role="alert" aria-live="polite" className={styles.errorMessage}>
              <AlertCircle size={14} className="shrink-0" />
              <span>{errors.service}</span>
            </p>
          )}
        </div>

        {/* Custom Accessible Dropdown: Budget (Optional) */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} id="contact-budget-label">
            Budget
            <span className={styles.optionalTag}>(optional)</span>
          </label>
          <AccessibleSelect
            id="contact-budget"
            labelledBy="contact-budget-label"
            value={values.budget}
            placeholder="Select a range"
            options={budgetOptions}
            hasError={Boolean(errors.budget && touched.budget)}
            onSelect={(val) => {
              update("budget", val);
              setTouched((prev) => ({ ...prev, budget: true }));
            }}
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

          {/* AI Helper Bar & Improve button */}
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

/* ==========================================================================
   CUSTOM ACCESSIBLE DROPDOWN COMPONENT
   Desktop: 16px radius panel, 8px gap, soft shadow, checkmark & tint
   Mobile: Bottom sheet modal with backdrop
   ========================================================================== */

interface AccessibleSelectProps {
  id: string;
  labelledBy: string;
  value: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  hasError?: boolean;
  onSelect: (value: string) => void;
}

function AccessibleSelect({
  id,
  labelledBy,
  value,
  placeholder,
  options,
  required = false,
  hasError = false,
  onSelect,
}: AccessibleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-listbox`;

  // Detect mobile viewport (<= 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync highlightedIndex with selected value when opened
  useEffect(() => {
    if (isOpen) {
      const idx = options.indexOf(value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  // Click outside to close (desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile]);

  // Close on Escape & handle type-ahead
  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      }
      case "Home": {
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      }
      case "End": {
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          onSelect(options[highlightedIndex]);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case "Tab": {
        setIsOpen(false);
        break;
      }
      default: {
        // Single letter type-ahead search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase();
          const matchIndex = options.findIndex((opt) =>
            opt.toLowerCase().startsWith(char)
          );
          if (matchIndex >= 0) {
            setHighlightedIndex(matchIndex);
          }
        }
        break;
      }
    }
  };

  const handleSelectOption = (opt: string) => {
    onSelect(opt);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-controls={listboxId}
        aria-required={required}
        aria-invalid={hasError}
        data-state={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`${styles.selectTrigger} ${hasError ? styles.selectTriggerError : ""}`}
      >
        <span className={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {/* DESKTOP DROPDOWN POPPER MENU */}
      {!isMobile && isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={styles.dropdownMenu}
          onKeyDown={handleKeyDown}
        >
          {options.map((opt, idx) => {
            const isSelected = opt === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={opt}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleSelectOption(opt)}
                className={`${styles.optionItem} ${
                  isSelected ? styles.optionItemSelected : ""
                } ${isHighlighted ? styles.optionItemActive : ""}`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <Check className={styles.checkIcon} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MOBILE BOTTOM SHEET MODAL WITH BACKDROP */}
      {isMobile && isOpen && (
        <div
          className={styles.bottomSheetBackdrop}
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={placeholder}
        >
          <div
            className={styles.bottomSheetContent}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.dragHandle} aria-hidden="true" />
            <div className={styles.sheetHeader}>
              <span className={styles.sheetTitle}>{placeholder}</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close options"
                className={styles.sheetCloseBtn}
              >
                <X size={16} />
              </button>
            </div>
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={labelledBy}
              className={styles.sheetOptionsList}
            >
              {options.map((opt, idx) => {
                const isSelected = opt === value;
                return (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt)}
                    className={`${styles.sheetOptionItem} ${
                      isSelected ? styles.sheetOptionItemSelected : ""
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check className={styles.checkIcon} aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
