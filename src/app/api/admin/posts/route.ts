import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
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
  if (value === undefined || value === null) return null;
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

  const rawSlug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const slug = (rawSlug ? slugifyTitle(rawSlug) : slugifyTitle(title)) || randomUUID();

  const excerpt =
    typeof body?.excerpt === "string" ? body.excerpt.trim() || null : null;
  const content =
    typeof body?.content === "string" ? body.content : null;
  const cover_image =
    typeof body?.cover_image === "string"
      ? body.cover_image.trim() || null
      : null;

  const tags = toStringArray(body?.tags) ?? [];

  const category: PostCategory = isCategory(body?.category)
    ? body.category
    : "other";

  const published =
    typeof body?.published === "boolean" ? body.published : false;

  const published_at = published ? new Date().toISOString() : null;

  const id = randomUUID();
  await db.insert(lifestyle_posts).values({
    id,
    title,
    slug,
    excerpt,
    content,
    cover_image,
    tags,
    category,
    published,
    published_at,
  });

  return NextResponse.json({ ok: true, id });
}
