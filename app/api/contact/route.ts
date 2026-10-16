import { NextResponse } from "next/server";

// In-memory rate limiting map: IP -> { count, expires }
const attempts = new Map<string, { count: number; expires: number }>();

const validServices = new Set([
  "Website Design",
  "Website Development",
  "Redesign",
  "Landing Page",
  "UI/UX Design",
  "Something else",
]);

const validBudgets = new Set([
  "",
  "Under ₹25,000",
  "₹25,000 to ₹50,000",
  "₹50,000 to ₹1,00,000",
  "Above ₹1,00,000",
  "Not sure yet",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECIPIENT_EMAIL = "bharathsaipulipati@gmail.com";
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 submissions per hour per IP

function isRateLimited(ip: string, now: number): boolean {
  const previous = attempts.get(ip);
  const current =
    previous && previous.expires > now
      ? previous
      : { count: 0, expires: now + RATE_LIMIT_WINDOW };

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  current.count += 1;
  attempts.set(ip, current);

  // Periodic cleanup if map grows
  if (attempts.size > 1_000) {
    for (const [key, value] of attempts) {
      if (value.expires <= now) {
        attempts.delete(key);
      }
    }
  }

  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const isDev = process.env.NODE_ENV !== "production";

  // Rate limiting check (skipped in local development for convenience)
  if (!isDev && isRateLimited(ip, Date.now())) {
    console.warn(`[Contact API] Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: "Too many messages sent. Please wait an hour before trying again." },
      { status: 429 }
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch (err) {
    console.error("[Contact API] JSON parse error:", err);
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  // Honeypot spam protection: if hidden field 'website' is filled, silently discard
  if (data.website) {
    console.log(`[Contact API] Honeypot triggered by IP: ${ip}. Submission discarded.`);
    return NextResponse.json({ ok: true });
  }

  const value = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";

  const name = value("name");
  const email = value("email");
  const phone = value("phone");
  const company = value("company");
  const service = value("service");
  const budget = value("budget");
  const details = value("details");
  const timeline = value("timeline");

  // Server-side field validation
  const validationErrors: string[] = [];
  if (!name || name.length > 120) {
    validationErrors.push("Please provide your name (max 120 characters).");
  }
  if (!email || !emailPattern.test(email) || email.length > 254) {
    validationErrors.push("Please provide a valid email address.");
  }
  if (!service || !validServices.has(service)) {
    validationErrors.push("Please select a valid service.");
  }
  if (budget && !validBudgets.has(budget)) {
    validationErrors.push("Please select a valid budget range.");
  }
  if (!details || details.length < 10) {
    validationErrors.push("Project description must be at least 10 characters.");
  }
  if (details.length > 5_000) {
    validationErrors.push("Project description must be under 5,000 characters.");
  }
  if (phone.length > 50 || company.length > 100 || timeline.length > 100) {
    validationErrors.push("Optional fields exceed maximum permitted length.");
  }

  if (validationErrors.length > 0) {
    console.warn("[Contact API] Validation failed:", validationErrors);
    return NextResponse.json({ error: validationErrors[0] }, { status: 400 });
  }

  const emailSubject = `New project enquiry: ${service} - ${name}`;

  const plainTextContent = [
    `NEW PROJECT ENQUIRY FROM WEBSITE`,
    `================================`,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${phone || "Not provided"}`,
    `Company:  ${company || "Not provided"}`,
    `Service:  ${service}`,
    `Budget:   ${budget || "Not provided"}`,
    `Timeline: ${timeline || "Not provided"}`,
    `Submitted from IP: ${ip}`,
    ``,
    `PROJECT DESCRIPTION:`,
    `--------------------`,
    details,
  ].join("\n");

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B1329; color: #E2E8F0; margin: 0; padding: 24px; }
    .card { background-color: #141E30; border: 1px solid rgba(143, 176, 214, 0.25); border-radius: 16px; max-width: 580px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .header { border-bottom: 1px solid rgba(143, 176, 214, 0.15); padding-bottom: 18px; margin-bottom: 24px; }
    .title { color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; }
    .subtitle { color: #8FB0D6; font-size: 14px; margin: 0; }
    .field { margin-bottom: 16px; }
    .label { color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600; }
    .value { color: #FFFFFF; font-size: 15px; font-weight: 500; }
    .value-highlight { color: #60A5FA; font-weight: 600; font-size: 16px; }
    .message-box { background: rgba(0, 0, 0, 0.35); border-left: 3px solid #3882F0; padding: 16px; border-radius: 8px; margin-top: 8px; white-space: pre-wrap; color: #F1F5F9; font-size: 15px; line-height: 1.6; }
    .footer { margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(143, 176, 214, 0.15); font-size: 13px; color: #8FB0D6; line-height: 1.5; }
    .button { display: inline-block; background-color: #3882F0; color: #FFFFFF !important; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="title">New Project Enquiry</h1>
      <p class="subtitle">Garuda Portfolio Website &middot; ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
    </div>
    
    <div class="field">
      <div class="label">Client Name</div>
      <div class="value">${escapeHtml(name)}</div>
    </div>

    <div class="field">
      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #60A5FA; text-decoration: none;">${escapeHtml(email)}</a></div>
    </div>

    ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${escapeHtml(phone)}</div></div>` : ""}
    ${company ? `<div class="field"><div class="label">Company</div><div class="value">${escapeHtml(company)}</div></div>` : ""}

    <div class="field">
      <div class="label">Service Needed</div>
      <div class="value-highlight">${escapeHtml(service)}</div>
    </div>

    ${budget ? `<div class="field"><div class="label">Budget</div><div class="value">${escapeHtml(budget)}</div></div>` : ""}
    ${timeline ? `<div class="field"><div class="label">Timeline</div><div class="value">${escapeHtml(timeline)}</div></div>` : ""}

    <div class="field" style="margin-top: 22px;">
      <div class="label">Project Description</div>
      <div class="message-box">${escapeHtml(details)}</div>
    </div>

    <div class="footer">
      <div>Reply-To is configured to <strong>${escapeHtml(email)}</strong>. Hit "Reply" to respond directly.</div>
      <a class="button" href="mailto:${escapeHtml(email)}?subject=Re:%20${encodeURIComponent(emailSubject)}">Reply to ${escapeHtml(name)} &rarr;</a>
    </div>
  </div>
</body>
</html>
`.trim();

  const resendKey = process.env.RESEND_API_KEY;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

  // =========================================================================
  // 1. Send via Resend (https://resend.com)
  // =========================================================================
  if (resendKey) {
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || "Garuda Portfolio <onboarding@resend.dev>";

    console.log(`[Contact API] Dispatching email via Resend to ${RECIPIENT_EMAIL}...`);

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [RECIPIENT_EMAIL],
          reply_to: email,
          replyTo: email,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        }),
      });

      const resendResult = (await response.json().catch(() => null)) as {
        id?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        console.error(
          `[Contact API] Resend returned HTTP ${response.status}:`,
          JSON.stringify(resendResult)
        );
        return NextResponse.json(
          {
            error:
              resendResult?.message ||
              "Email delivery failed via Resend. Please check Vercel logs.",
          },
          { status: 502 }
        );
      }

      console.log(
        `[Contact API] Successfully delivered via Resend. Message ID: ${resendResult?.id}`
      );
      return NextResponse.json({ ok: true, id: resendResult?.id, provider: "resend" });
    } catch (err) {
      console.error("[Contact API] Network error calling Resend API:", err);
      return NextResponse.json(
        { error: "Could not connect to email delivery service." },
        { status: 502 }
      );
    }
  }

  // =========================================================================
  // 2. Send via Web3Forms (https://web3forms.com)
  // =========================================================================
  if (web3FormsKey) {
    console.log(`[Contact API] Dispatching email via Web3Forms to ${RECIPIENT_EMAIL}...`);

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
          email: email, // Automatically sets Reply-To header
          to_email: RECIPIENT_EMAIL,
          phone: phone || undefined,
          company: company || undefined,
          service: service,
          budget: budget || undefined,
          timeline: timeline || undefined,
          message: plainTextContent,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || (result && result.success === false)) {
        console.error(
          `[Contact API] Web3Forms returned HTTP ${response.status}:`,
          JSON.stringify(result)
        );
        return NextResponse.json(
          {
            error:
              result?.message ||
              "Email delivery failed via Web3Forms. Please check Vercel logs.",
          },
          { status: 502 }
        );
      }

      console.log("[Contact API] Successfully delivered via Web3Forms.");
      return NextResponse.json({ ok: true, provider: "web3forms" });
    } catch (err) {
      console.error("[Contact API] Network error calling Web3Forms API:", err);
      return NextResponse.json(
        { error: "Could not connect to email delivery service." },
        { status: 502 }
      );
    }
  }

  // =========================================================================
  // 3. Fallback for Local Development (when no API key configured yet)
  // =========================================================================
  if (isDev) {
    console.log(
      "\n==================== [DEV MODE SUBMISSION] ====================" +
        `\nTo: ${RECIPIENT_EMAIL}` +
        `\nFrom: ${name} <${email}>` +
        `\nSubject: ${emailSubject}` +
        `\nDetails: ${details}` +
        "\n================================================================\n"
    );
    return NextResponse.json({
      ok: true,
      devMode: true,
      notice: "Delivered in dev mode (logged to console). Configure RESEND_API_KEY in production.",
    });
  }

  // =========================================================================
  // 4. Missing Configuration in Production
  // =========================================================================
  console.error(
    "[Contact API] ERROR: Neither RESEND_API_KEY nor WEB3FORMS_ACCESS_KEY is set in Vercel environment variables!"
  );

  return NextResponse.json(
    {
      error:
        "Email delivery is not configured yet. Please add RESEND_API_KEY or WEB3FORMS_ACCESS_KEY to your Vercel Environment Variables.",
    },
    { status: 503 }
  );
}
