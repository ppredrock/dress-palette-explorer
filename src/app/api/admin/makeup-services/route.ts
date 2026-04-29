import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { makeup_services } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const CATEGORIES = [
  "bridal",
  "party",
  "editorial",
  "natural",
  "special_effects",
  "other",
] as const;
type Category = (typeof CATEGORIES)[number];

function isCategory(v: unknown): v is Category {
  return typeof v === "string" && (CATEGORIES as readonly string[]).includes(v);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description =
    typeof body?.description === "string" && body.description.trim().length > 0
      ? body.description.trim()
      : null;
  const priceRaw = body?.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string" && priceRaw.trim() !== ""
        ? Number(priceRaw)
        : NaN;
  const durationRaw = body?.duration_minutes;
  const duration_minutes =
    typeof durationRaw === "number"
      ? Math.round(durationRaw)
      : typeof durationRaw === "string" && durationRaw.trim() !== ""
        ? Math.round(Number(durationRaw))
        : 60;
  const category: Category = isCategory(body?.category) ? body.category : "other";
  const image_url =
    typeof body?.image_url === "string" && body.image_url.trim().length > 0
      ? body.image_url.trim()
      : null;
  const available = typeof body?.available === "boolean" ? body.available : true;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }
  if (!Number.isFinite(duration_minutes) || duration_minutes <= 0) {
    return NextResponse.json(
      { error: "Duration must be a positive number" },
      { status: 400 },
    );
  }

  const id = randomUUID();
  await db.insert(makeup_services).values({
    id,
    title,
    description,
    price,
    duration_minutes,
    category,
    image_url,
    available,
  });

  return NextResponse.json({ ok: true, id });
}
