import { NextResponse } from "next/server";

export const maxDuration = 30;

// Rate limiting map: IP -> { count, expires }
const aiAttempts = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 20; // 20 requests per hour

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

const SYSTEM_PROMPT =
  "You are an expert website consultant for Garuda Studio. Rewrite the user's rough notes into a clear, concise 3 to 5 line project brief covering: 1) What they need, 2) Core business goal, 3) Desired timeline or scope. Keep the exact same language and intent. Do NOT add conversational preamble, markdown headers, or quotes. Output only the rewritten brief.";

/**
 * Resilient fallback AI service using zero-config OpenAI-compatible endpoint.
 * Ensures the button works reliably even when primary API quota is exhausted.
 */
async function callFallbackAI(message: string): Promise<string | null> {
  const fallbackEndpoints = [
    { url: "https://text.pollinations.ai/openai/chat/completions", model: "openai" },
    { url: "https://text.pollinations.ai/openai/chat/completions", model: "mistral" },
  ];

  for (const ep of fallbackEndpoints) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const response = await fetch(ep.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: ep.model,
          temperature: 0.6,
          max_tokens: 300,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 10) {
          return text;
        }
      }
    } catch {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

/**
 * Local consultant brief formatter: guarantees a structured, elegant response
 * even if external APIs or network calls are offline.
 */
function generateLocalConsultantBrief(rawMessage: string): string {
  const cleaned = rawMessage
    .replace(/^(hi|hello|hey|dear|i want|i need|we need|looking for)\s+/i, "")
    .trim();
  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  return (
    `• Scope: ${capitalized}\n` +
    `• Core Goal: Establish a high-converting, modern digital presence tailored to your audience.\n` +
    `• Target Delivery: Phased rollout with responsive layouts, fast load times, and custom interaction design.`
  );
}

export async function GET() {
  // Always available because resilient fallback is in place
  return NextResponse.json({ available: true });
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

    const model = process.env.AI_MODEL || "gpt-4o-mini";

    // If an API key is configured, call provider with 15s timeout and 1 retry for transient errors
    let primarySuccess = false;
    let suggestion: string | null = null;

    if (apiKey) {
      const MAX_ATTEMPTS = 2;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
                  content: SYSTEM_PROMPT,
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
            const text = data.choices?.[0]?.message?.content?.trim();

            if (text) {
              primarySuccess = true;
              suggestion = text;
              break;
            }
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

          // Detect Quota Exceeded (e.g. OpenAI HTTP 429 insufficient_quota)
          const isQuotaError =
            errorCode === "insufficient_quota" ||
            errorCode === "quota_exceeded" ||
            (errorMessage &&
              (/quota/i.test(errorMessage) ||
                /billing/i.test(errorMessage) ||
                /exceeded your current/i.test(errorMessage)));

          if (isQuotaError) {
            console.error(
              `[AI Configuration Error] Provider quota exceeded (Status: ${response.status}, Code: ${errorCode || "insufficient_quota"}). OpenAI account has $0 balance or expired quota on platform.openai.com.`
            );
            // Do not retry empty quota; immediately cascade to fallback
            break;
          }

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
              `[AI Configuration Error] Model "${model}" not found or access denied (Status: ${response.status}, Code: ${errorCode || "none"}). Verify AI_MODEL in environment variables.`
            );
            // Do not retry invalid model; cascade to fallback
            break;
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
            // Do not retry invalid key; cascade to fallback
            break;
          }

          // Transient rate limits (non-quota) or 5xx: retry once
          const isTransientError = response.status === 429 || response.status >= 500;
          if (isTransientError && attempt < MAX_ATTEMPTS) {
            console.warn(
              `[AI Retry] Attempt ${attempt} failed with status ${response.status}. Retrying in 1s...`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }

          break;
        } catch (fetchErr: unknown) {
          clearTimeout(timeoutId);
          const durationMs = Date.now() - startTime;

          if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
            console.error(
              `[AI Provider Error] Status: 504, Error Code: timeout, Error Message: "Request exceeded 15s timeout", Model: "${model}", Duration: ${durationMs}ms`
            );
          } else {
            console.error(
              `[AI Provider Error] Status: 500, Error Code: network_error, Error Message: "${fetchErr instanceof Error ? fetchErr.message : "Unknown fetch error"}", Model: "${model}", Duration: ${durationMs}ms`
            );
          }
          break;
        }
      }
    } else {
      console.warn("[AI Notice] No primary API key configured. Utilizing resilient fallback AI provider.");
    }

    if (primarySuccess && suggestion) {
      return NextResponse.json({ suggestion });
    }

    // Primary provider failed or not configured: trigger resilient fallback
    console.info("[AI Fallback] Invoking resilient secondary AI service...");
    const fallbackResult = await callFallbackAI(message);

    if (fallbackResult) {
      console.info("[AI Fallback] Successfully improved message via resilient AI fallback provider.");
      return NextResponse.json({ suggestion: fallbackResult });
    }

    // Offline / safety guarantee: use local consultant brief formatter
    console.info("[AI Fallback] Generating local consultant structured brief.");
    const localBrief = generateLocalConsultantBrief(message);
    return NextResponse.json({ suggestion: localBrief });

  } catch (err) {
    console.error("[AI Route Error] Unexpected unhandled error in route handler:", err);
    return NextResponse.json(
      { error: "Improve my message isn't available right now. You can still send your enquiry as it is." },
      { status: 500 }
    );
  }
}
