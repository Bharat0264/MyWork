import { NextResponse } from "next/server";

const attempts = new Map<string, { count: number; expires: number }>();

const services = new Set([
  "Website Design",
  "Website Development",
  "Redesign",
  "Landing Page",
  "UI/UX Design",
  "Something else",
]);

const budgets = new Set([
  "",
  "Under ₹25,000",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "Above ₹1,00,000",
  "Not sure yet",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recipient = "bharathsaipulipati@gmail.com";
const rateLimitWindow = 60 * 60 * 1000;
const rateLimitMaximum = 5;

function rateLimit(ip: string, now: number) {
  const previous = attempts.get(ip);
  const current = previous && previous.expires > now
    ? previous
    : { count: 0, expires: now + rateLimitWindow };

  if (current.count >= rateLimitMaximum) {
    return false;
  }

  current.count += 1;
  attempts.set(ip, current);

  if (attempts.size > 1_000) {
    for (const [key, value] of attempts) {
      if (value.expires <= now) {
        attempts.delete(key);
      }
    }
  }

  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!rateLimit(ip, Date.now())) {
    return NextResponse.json({ error: "Too many messages. Please try later." }, { status: 429 });
  }

  let data: Record<string, unknown>;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots receive a benign response but never send mail.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const value = (key: string) => (typeof data[key] === "string" ? data[key].trim() : "");
  const name = value("name");
  const email = value("email");
  const phone = value("phone");
  const company = value("company");
  const service = value("service");
  const budget = value("budget");
  const details = value("details");
  const timeline = value("timeline");

  const hasInvalidFields =
    !name ||
    name.length > 120 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    !services.has(service) ||
    !budgets.has(budget) ||
    details.length < 10 ||
    details.length > 5_000 ||
    [phone, company, timeline].some((field) => field.length > 200);

  if (hasInvalidFields) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

  const emailSubject = `New project enquiry: ${service} - ${name}`;
  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Company: ${company || "Not provided"}`,
    `Service: ${service}`,
    `Budget: ${budget || "Not provided"}`,
    `Timeline: ${timeline || "Not provided"}`,
    "",
    "Project details:",
    details,
  ].join("\n");

  // 1. Send via Resend if RESEND_API_KEY is configured
  if (resendKey) {
    const from = process.env.CONTACT_FROM_EMAIL || "Garuda Portfolio <onboarding@resend.dev>";
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [recipient],
          reply_to: email,
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
    }
  }

  // 2. Send via Web3Forms if WEB3FORMS_ACCESS_KEY is configured
  if (web3FormsKey) {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: emailSubject,
          from_name: name,
          email: email,
          to_email: recipient,
          message: emailBody,
        }),
      });

      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;

      if (!response.ok || (result && result.success === false)) {
        return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
    }
  }

  // 3. Fallback for development/testing when no API key is set yet
  if (process.env.NODE_ENV !== "production") {
    console.log("[Dev Contact Form submission]", {
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      details,
    });
    return NextResponse.json({ ok: true, devMode: true });
  }

  return NextResponse.json(
    {
      error:
        "Email delivery is not configured. Please add RESEND_API_KEY or WEB3FORMS_ACCESS_KEY in Vercel environment variables.",
    },
    { status: 503 }
  );
}
