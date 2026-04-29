import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { dresses } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const DRESS_CATEGORIES = [
  "bridal",
  "party",
  "casual",
  "ethnic",
  "western",
  "fusion",
  "other",
] as const;
type DressCategory = (typeof DRESS_CATEGORIES)[number];

function isCategory(value: unknown): value is DressCategory {
  return (
    typeof value === "string" &&
    (DRESS_CATEGORIES as readonly string[]).includes(value)
  );
}

function toStringArray(value: unknown): string[] | null {
  if (value === undefined || value === null) return null;
  if (!Array.isArray(value)) return null;
  return value
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toOptionalNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const description =
    typeof body?.description === "string" ? body.description.trim() : null;

  const price = toOptionalNumber(body?.price);
  const rental_price = toOptionalNumber(body?.rental_price);

  const category: DressCategory = isCategory(body?.category)
    ? body.category
    : "other";

  const images = toStringArray(body?.images) ?? [];
  const sizes = toStringArray(body?.sizes) ?? [];
  const colors = toStringArray(body?.colors) ?? [];

  const available =
    typeof body?.available === "boolean" ? body.available : true;
  const featured =
    typeof body?.featured === "boolean" ? body.featured : false;

  const id = randomUUID();
  await db.insert(dresses).values({
    id,
    title,
    description,
    price: price ?? null,
    rental_price: rental_price ?? null,
    category,
    images,
    sizes,
    colors,
    available,
    featured,
  });

  return NextResponse.json({ ok: true, id });
}
