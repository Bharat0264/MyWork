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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <title>New Project Enquiry</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #0B1322; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #60A5FA; }
    @media only screen and (max-width: 600px) {
      .card-wrap { width: 100% !important; }
      .card-body { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0B1322; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8EEF7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0B1322;">
    <tr>
      <td align="center" style="padding: 12px 0;">
        <!-- MAIN CARD TABLE (max-width 600px, fluid) -->
        <table role="presentation" class="card-wrap" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; width: 100%; background-color: #141E30; border: 1px solid rgba(143, 176, 214, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- LOGO HEADER ROW (bgcolor="#0F1626", centered, 28px padding, 1px divider #1F2A44 below) -->
          <tr>
            <td align="center" bgcolor="#0F1626" style="background-color: #0F1626; padding: 28px; border-bottom: 1px solid #1F2A44;">
              <a href="https://my-work-umber.vercel.app" target="_blank" style="text-decoration: none; display: inline-block;">
                <img
                  src="https://my-work-umber.vercel.app/email-logo.png"
                  width="240"
                  alt="Garuda Web Designer and Developer"
                  border="0"
                  style="display: block; width: 240px; max-width: 100%; height: auto; border: 0; outline: none; margin: 0 auto;"
                />
              </a>
            </td>
          </tr>

          <!-- CARD BODY -->
          <tr>
            <td class="card-body" style="padding: 32px;">
              <!-- Heading -->
              <div style="border-bottom: 1px solid rgba(143, 176, 214, 0.15); padding-bottom: 18px; margin-bottom: 24px;">
                <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.01em;">New Project Enquiry</h1>
                <p style="color: #8FB0D6; font-size: 14px; margin: 0;">Garuda Portfolio Website &middot; ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>

              <!-- Client Name -->
              <div style="margin-bottom: 16px;">
                <div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Client Name</div>
                <div style="color: #FFFFFF; font-size: 15px; font-weight: 500;">${escapeHtml(name)}</div>
              </div>

              <!-- Email Address -->
              <div style="margin-bottom: 16px;">
                <div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Email Address</div>
                <div style="font-size: 15px; font-weight: 500;">
                  <a href="mailto:${escapeHtml(email)}" style="color: #60A5FA; text-decoration: none;">${escapeHtml(email)}</a>
                </div>
              </div>

              ${phone ? `<div style="margin-bottom: 16px;"><div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Phone</div><div style="color: #FFFFFF; font-size: 15px; font-weight: 500;"><a href="tel:${escapeHtml(phone.replace(/\s/g, ""))}" style="color: #60A5FA; text-decoration: none;">${escapeHtml(phone)}</a></div></div>` : ""}

              ${company ? `<div style="margin-bottom: 16px;"><div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Company</div><div style="color: #FFFFFF; font-size: 15px; font-weight: 500;">${escapeHtml(company)}</div></div>` : ""}

              <!-- Service Needed -->
              <div style="margin-bottom: 16px;">
                <div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Service Needed</div>
                <div style="color: #60A5FA; font-weight: 600; font-size: 16px;">${escapeHtml(service)}</div>
              </div>

              ${budget ? `<div style="margin-bottom: 16px;"><div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Budget</div><div style="color: #FFFFFF; font-size: 15px; font-weight: 500;">${escapeHtml(budget)}</div></div>` : ""}

              ${timeline ? `<div style="margin-bottom: 16px;"><div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600;">Timeline</div><div style="color: #FFFFFF; font-size: 15px; font-weight: 500;">${escapeHtml(timeline)}</div></div>` : ""}

              <!-- Project Description -->
              <div style="margin-top: 22px; margin-bottom: 16px;">
                <div style="color: #8FB0D6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: 600;">Project Details</div>
                <div style="background-color: rgba(0, 0, 0, 0.35); border-left: 3px solid #3882F0; padding: 16px; border-radius: 8px; white-space: pre-wrap; color: #F1F5F9; font-size: 15px; line-height: 1.6;">${escapeHtml(details)}</div>
              </div>

              <!-- Footer with Reply Button -->
              <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(143, 176, 214, 0.15); font-size: 13px; color: #8FB0D6; line-height: 1.5;">
                <div>Reply-To is configured to <a href="mailto:${escapeHtml(email)}" style="color: #FFFFFF; font-weight: 600; text-decoration: none;">${escapeHtml(email)}</a>. Hit &ldquo;Reply&rdquo; in your email client to respond directly.</div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;">
                  <tr>
                    <td align="center" bgcolor="#3882F0" style="border-radius: 999px;">
                      <a href="mailto:${escapeHtml(email)}?subject=Re:%20${encodeURIComponent(emailSubject)}" style="display: inline-block; background-color: #3882F0; color: #FFFFFF !important; text-decoration: none; padding: 10px 22px; border-radius: 999px; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;">Reply to ${escapeHtml(name)} &rarr;</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
