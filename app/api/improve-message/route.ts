import { NextResponse } from "next/server";

export const maxDuration = 30;

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

export async function GET() {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.GEMINI_API_KEY;
  return NextResponse.json({ available: Boolean(apiKey) });
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    if (isRateLimited(ip, now)) {
      console.warn(`[AI Rate Limit] Visitor IP rate limit exceeded for ${ip}`);
      return NextResponse.json(
        { error: "The AI is busy, please try again in a minute" },
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

    let apiKey = process.env.OPENAI_API_KEY;
    let endpoint = "https://api.openai.com/v1/chat/completions";

    if (!apiKey) {
      if (process.env.GROQ_API_KEY) {
        apiKey = process.env.GROQ_API_KEY;
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
      } else if (process.env.GEMINI_API_KEY) {
        apiKey = process.env.GEMINI_API_KEY;
        endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      }
    }

    if (process.env.OPENAI_BASE_URL) {
      endpoint = `${process.env.OPENAI_BASE_URL.replace(/\/+$/, "")}/chat/completions`;
    } else if (process.env.AI_BASE_URL) {
      endpoint = `${process.env.AI_BASE_URL.replace(/\/+$/, "")}/chat/completions`;
    } else if (apiKey?.startsWith("gsk_")) {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
    }

    if (!apiKey) {
      console.error("[AI Configuration Error] API key is missing. No OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY configured.");
      return NextResponse.json(
        { error: "Improve my message isn't available right now. You can still send your enquiry as it is." },
        { status: 503 }
      );
    }

    const model = process.env.AI_MODEL || "gpt-4o-mini";

    // Call provider with 20-second timeout and 1 retry for 429 or 5xx
    const MAX_ATTEMPTS = 2;
    let lastError: {
      type: "timeout" | "busy" | "config" | "generic";
      status: number;
      errorCode: string | null;
      errorMessage: string | null;
      durationMs: number;
    } | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
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
        const durationMs = Date.now() - startTime;

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const suggestion = data.choices?.[0]?.message?.content?.trim();

          if (!suggestion) {
            console.error(
              `[AI Provider Error] Status: ${response.status}, Error Code: empty_response, Error Message: "Provider returned empty choices", Model: "${model}", Duration: ${durationMs}ms`
            );
            return NextResponse.json(
              { error: "The AI is busy, please try again in a minute" },
              { status: 502 }
            );
          }

          return NextResponse.json({ suggestion });
        }

        // Response not OK - extract provider error details safely without logging key or user message
        const rawBody = await response.text().catch(() => "");
        let errorCode: string | null = null;
        let errorMessage: string | null = null;

        try {
          const parsed = JSON.parse(rawBody) as {
            error?: { message?: string; code?: string | number | null; type?: string };
          };
          if (parsed.error) {
            errorMessage = parsed.error.message || null;
            errorCode = parsed.error.code ? String(parsed.error.code) : null;
          }
        } catch {
          errorMessage = rawBody.slice(0, 300) || null;
        }

        // Requirement 1: Log real provider failure on server
        console.error(
          `[AI Provider Error] Status: ${response.status}, Error Code: ${errorCode || "none"}, Error Message: "${errorMessage || "none"}", Model: "${model}", Duration: ${durationMs}ms`
        );

        // Requirement 2: Check for model not found or no access
        const isModelNotFoundOrNoAccess =
          response.status === 404 ||
          errorCode === "model_not_found" ||
          errorCode === "model_permission_denied" ||
          (errorMessage &&
            (/model.*not found/i.test(errorMessage) ||
              /does not exist/i.test(errorMessage) ||
              /no access/i.test(errorMessage) ||
              /permission/i.test(errorMessage)));

        if (isModelNotFoundOrNoAccess) {
          console.error(
            `[AI Configuration Error] Model "${model}" not found or access denied (Status: ${response.status}, Code: ${errorCode || "none"}, Message: "${errorMessage || "none"}"). Verify AI_MODEL in environment variables.`
          );
        }

        const isAuthError =
          response.status === 401 ||
          response.status === 403 ||
          errorCode === "invalid_api_key" ||
          (errorMessage && /api key/i.test(errorMessage));

        if (isAuthError) {
          console.error(
            `[AI Configuration Error] API key authentication failed (Status: ${response.status}, Code: ${errorCode || "none"}). Verify API key in environment variables.`
          );
        }

        // Requirement 3: Retry once for 429 or 5xx errors
        const isRetryable = response.status === 429 || response.status >= 500;
        if (isRetryable && attempt < MAX_ATTEMPTS) {
          console.warn(
            `[AI Retry] Attempt ${attempt} failed with status ${response.status}. Retrying in 1s...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        const failureType =
          isAuthError || isModelNotFoundOrNoAccess
            ? "config"
            : response.status === 429 || response.status >= 500
            ? "busy"
            : "generic";

        lastError = {
          type: failureType,
          status: response.status,
          errorCode,
          errorMessage,
          durationMs,
        };
        break;
      } catch (fetchErr: unknown) {
        clearTimeout(timeoutId);
        const durationMs = Date.now() - startTime;

        if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
          console.error(
            `[AI Provider Error] Status: 504, Error Code: timeout, Error Message: "Request exceeded 20s timeout", Model: "${model}", Duration: ${durationMs}ms`
          );
          lastError = {
            type: "timeout",
            status: 504,
            errorCode: "timeout",
            errorMessage: "Request exceeded 20s timeout",
            durationMs,
          };
          break;
        }

        console.error(
          `[AI Provider Error] Status: 500, Error Code: network_error, Error Message: "${fetchErr instanceof Error ? fetchErr.message : "Unknown fetch error"}", Model: "${model}", Duration: ${durationMs}ms`
        );
        lastError = {
          type: "generic",
          status: 500,
          errorCode: "network_error",
          errorMessage: fetchErr instanceof Error ? fetchErr.message : "Network error",
          durationMs,
        };
        break;
      }
    }

    // Requirement 4: Return safe messages to visitor
    if (lastError?.type === "timeout") {
      return NextResponse.json(
        { error: "That took too long, please try again" },
        { status: 504 }
      );
    }

    if (lastError?.type === "busy") {
      return NextResponse.json(
        { error: "The AI is busy, please try again in a minute" },
        { status: 429 }
      );
    }

    if (lastError?.type === "config") {
      return NextResponse.json(
        { error: "Improve my message isn't available right now. You can still send your enquiry as it is." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Improve my message isn't available right now. You can still send your enquiry as it is." },
      { status: 500 }
    );
  } catch (err) {
    console.error("[AI Route Error] Unexpected unhandled error in route handler:", err);
    return NextResponse.json(
      { error: "Improve my message isn't available right now. You can still send your enquiry as it is." },
      { status: 500 }
    );
  }
}
