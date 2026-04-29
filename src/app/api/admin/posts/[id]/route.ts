import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lifestyle_posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const POST_CATEGORIES = [
  "fashion",
  "makeup",
  "skincare",
  "lifestyle",
  "travel",
  "food",
  "other",
] as const;
type PostCategory = (typeof POST_CATEGORIES)[number];

function isCategory(value: unknown): value is PostCategory {
  return (
    typeof value === "string" &&
    (POST_CATEGORIES as readonly string[]).includes(value)
  );
}

function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  const existingRows = await db
    .select()
    .from(lifestyle_posts)
    .where(eq(lifestyle_posts.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  if (typeof body.slug === "string") {
    const slug = slugifyTitle(body.slug.trim());
    if (!slug) {
      return NextResponse.json(
        { error: "Slug cannot be empty" },
        { status: 400 },
      );
    }
    update.slug = slug;
  }

  if ("excerpt" in body) {
    update.excerpt =
      typeof body.excerpt === "string" ? body.excerpt.trim() || null : null;
  }

  if ("content" in body) {
    update.content = typeof body.content === "string" ? body.content : null;
  }

  if ("cover_image" in body) {
    update.cover_image =
      typeof body.cover_image === "string"
        ? body.cover_image.trim() || null
        : null;
  }

  if ("tags" in body) {
    const arr = toStringArray(body.tags);
    if (arr === null) {
      return NextResponse.json(
        { error: "tags must be an array of strings" },
        { status: 400 },
      );
    }
    update.tags = arr;
  }

  if ("category" in body) {
    if (!isCategory(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }
    update.category = body.category;
  }

  if (typeof body.published === "boolean") {
    update.published = body.published;
    if (body.published && !existing.published_at) {
      update.published_at = new Date().toISOString();
    }
    if (!body.published) {
      // Keep existing published_at on unpublish; do nothing.
    }
  }

  if ("published_at" in body) {
    if (body.published_at === null) {
      update.published_at = null;
    } else if (typeof body.published_at === "string" && body.published_at) {
      update.published_at = body.published_at;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  update.updated_at = new Date().toISOString();

  await db
    .update(lifestyle_posts)
    .set(update)
    .where(eq(lifestyle_posts.id, id));
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
  await db.delete(lifestyle_posts).where(eq(lifestyle_posts.id, id));
  return NextResponse.json({ ok: true });
}
