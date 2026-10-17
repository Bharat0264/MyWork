import { NextResponse } from "next/server";

// Rate limiting map: IP -> { count, expires }
const aiAttempts = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour

function isRateLimited(ip: string, now: number): boolean {
  const previous = aiAttempts.get(ip);
  const current =
    previous && previous.expires > now
      ? previous
      : { count: 0, expires: now + RATE_LIMIT_WINDOW };

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  current.count += 1;
  aiAttempts.set(ip, current);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    if (isRateLimited(ip, now)) {
      return NextResponse.json(
        { error: "Too many AI requests. Please try again in an hour." },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Message is required." },
        { status: 400 }
      );
    }

    const message = body.message.trim();
    if (message.length < 5) {
      return NextResponse.json(
        { error: "Please write at least a few words before asking to improve it." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message exceeds the 1,000 character limit for AI assistance." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Set OPENAI_API_KEY in your Vercel project environment variables.",
        },
        { status: 503 }
      );
    }

    // Call OpenAI API with a strict 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.6,
          max_tokens: 300,
          messages: [
            {
              role: "system",
              content:
                "You are an expert website consultant for Garuda Studio. Rewrite the user's rough notes into a clear, concise 3 to 5 line project brief covering: 1) What they need, 2) Core business goal, 3) Desired timeline or scope. Keep the exact same language and intent. Do NOT add conversational preamble, markdown headers, or quotes. Output only the rewritten brief.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.error("AI service response error:", response.status, errText);
        return NextResponse.json(
          { error: "AI service temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const suggestion = data.choices?.[0]?.message?.content?.trim();

      if (!suggestion) {
        return NextResponse.json(
          { error: "Unable to generate an improved suggestion." },
          { status: 502 }
        );
      }

      return NextResponse.json({ suggestion });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
        return NextResponse.json(
          { error: "AI request timed out after 10 seconds. Your draft was kept as is." },
          { status: 504 }
        );
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing the AI request." },
      { status: 500 }
    );
  }
}
