import { NextResponse } from "next/server";

const attempts = new Map<string, { count: number; expires: number }>();
const services = new Set(["Website Design", "Website Development", "Redesign", "Landing Page", "UI/UX Design", "Something else"]);
const budgets = new Set(["", "Under ₹25,000", "₹25,000 to ₹50,000", "₹50,000 to ₹1,00,000", "Above ₹1,00,000", "Not sure yet"]);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const existing = attempts.get(ip);
  const current = existing && existing.expires > now ? existing : { count: 0, expires: now + 60 * 60 * 1000 };
  if (current.count >= 5) return NextResponse.json({ error: "Too many messages. Please try later." }, { status: 429 });
  current.count++;
  attempts.set(ip, current);
  if (attempts.size > 1000) for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);

  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (data.website) return NextResponse.json({ ok: true });
  const value = (key: string) => typeof data[key] === "string" ? (data[key] as string).trim() : "";
  const name = value("name"), email = value("email"), phone = value("phone"), company = value("company"), service = value("service"), budget = value("budget"), details = value("details"), timeline = value("timeline");
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !services.has(service) || !budgets.has(budget) || details.length < 10 || details.length > 5000 || [phone, company, timeline].some(field => field.length > 200)) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
  const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: ["bharathsaipulipati@gmail.com"], reply_to: email, subject: `New project enquiry: ${service}`, text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Company: ${company || "Not provided"}`, `Service: ${service}`, `Budget: ${budget || "Not provided"}`, `Timeline: ${timeline || "Not provided"}`, "", "Project details:", details].join("\n") }) });
  if (!result.ok) return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
