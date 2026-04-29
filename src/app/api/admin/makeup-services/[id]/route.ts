import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
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
    const t = body.title.trim();
    if (!t) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }
    update.title = t;
  }
  if ("description" in body) {
    if (body.description === null) update.description = null;
    else if (typeof body.description === "string") {
      const d = body.description.trim();
      update.description = d.length > 0 ? d : null;
    }
  }
  if ("price" in body) {
    const raw = body.price;
    const n =
      typeof raw === "number"
        ? raw
        : typeof raw === "string" && raw.trim() !== ""
          ? Number(raw)
          : NaN;
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    update.price = n;
  }
  if ("duration_minutes" in body) {
    const raw = body.duration_minutes;
    const n =
      typeof raw === "number"
        ? Math.round(raw)
        : typeof raw === "string" && raw.trim() !== ""
          ? Math.round(Number(raw))
          : NaN;
    if (!Number.isFinite(n) || n <= 0) {
      return NextResponse.json(
        { error: "Invalid duration" },
        { status: 400 },
      );
    }
    update.duration_minutes = n;
  }
  if ("category" in body) {
    if (!isCategory(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    update.category = body.category;
  }
  if ("image_url" in body) {
    if (body.image_url === null) update.image_url = null;
    else if (typeof body.image_url === "string") {
      const u = body.image_url.trim();
      update.image_url = u.length > 0 ? u : null;
    }
  }
  if (typeof body.available === "boolean") {
    update.available = body.available;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();

  await db.update(makeup_services).set(update).where(eq(makeup_services.id, id));
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
  await db.delete(makeup_services).where(eq(makeup_services.id, id));
  return NextResponse.json({ ok: true });
}
