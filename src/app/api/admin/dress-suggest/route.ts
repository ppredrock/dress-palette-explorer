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

  // Fetch the image and base64-encode it for Gemini's inline_data input.
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
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
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

  const raw = result.text ?? "";
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
