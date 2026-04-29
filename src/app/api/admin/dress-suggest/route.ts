import { NextResponse, type NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getCurrentUser } from "@/lib/auth";

const SYSTEM = `You are a senior fashion copywriter for a luxury Indian boutique called Neha's Studio. Given a photo of a dress, return:
- A concise, evocative title (3–7 words). Title-case. No filler ("Stunning", "Beautiful").
- A description (2–3 sentences) describing fabric, silhouette, occasion, and what makes the piece distinctive. Warm, premium tone. No hashtags, no emoji.

If the image isn't a dress or you can't see clearly, return a generic fallback title and a description that gently asks the admin to verify.`;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured on server" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl : null;
  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
  }

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    return NextResponse.json(
      { error: `Could not fetch image (${imgRes.status})` },
      { status: 502 },
    );
  }
  const mimeType = imgRes.headers.get("content-type") ?? "image/jpeg";
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const base64 = buf.toString("base64");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let raw: string;
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM },
            { inlineData: { mimeType, data: base64 } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
        temperature: 0.7,
      },
    });
    raw = result.text ?? "";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Gemini SDK throws ApiError with status 429 / 403 / etc embedded in message
    const status = /\b(429|RESOURCE_EXHAUSTED)\b/.test(msg)
      ? 429
      : /\b(403|PERMISSION_DENIED)\b/.test(msg)
        ? 403
        : 502;
    const cleanMsg = status === 429
      ? "Gemini quota exceeded — try again in a minute, or pick a model with available quota."
      : status === 403
        ? "Gemini API key rejected (403). Check the key and that the Generative Language API is enabled."
        : `Gemini error: ${msg.slice(0, 200)}`;
    return NextResponse.json({ error: cleanMsg }, { status });
  }

  let parsed: { title?: string; description?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Could not parse model output", raw },
      { status: 502 },
    );
  }

  return NextResponse.json({
    title: parsed.title ?? "",
    description: parsed.description ?? "",
  });
}
