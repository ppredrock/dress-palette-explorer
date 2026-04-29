import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const rows = await db
    .select()
    .from(dresses)
    .where(eq(dresses.id, id))
    .limit(1);
  const dress = rows[0];
  if (!dress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ dress });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }
    update.title = title;
  }

  if ("description" in body) {
    update.description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;
  }

  const priceVal = toOptionalNumber(body.price);
  if (priceVal !== undefined) update.price = priceVal;

  const rentalPriceVal = toOptionalNumber(body.rental_price);
  if (rentalPriceVal !== undefined) update.rental_price = rentalPriceVal;

  if ("category" in body) {
    if (!isCategory(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }
    update.category = body.category;
  }

  if ("images" in body) {
    const arr = toStringArray(body.images);
    if (arr === null) {
      return NextResponse.json(
        { error: "images must be an array of strings" },
        { status: 400 },
      );
    }
    update.images = arr;
  }
  if ("sizes" in body) {
    const arr = toStringArray(body.sizes);
    if (arr === null) {
      return NextResponse.json(
        { error: "sizes must be an array of strings" },
        { status: 400 },
      );
    }
    update.sizes = arr;
  }
  if ("colors" in body) {
    const arr = toStringArray(body.colors);
    if (arr === null) {
      return NextResponse.json(
        { error: "colors must be an array of strings" },
        { status: 400 },
      );
    }
    update.colors = arr;
  }

  if (typeof body.available === "boolean") update.available = body.available;
  if (typeof body.featured === "boolean") update.featured = body.featured;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  update.updated_at = new Date().toISOString();

  await db.update(dresses).set(update).where(eq(dresses.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(dresses).where(eq(dresses.id, id));
  return NextResponse.json({ ok: true });
}
