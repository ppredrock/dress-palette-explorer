import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messages, profiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role === "admin") {
    const rows = await db
      .select({
        message: messages,
        user: {
          full_name: profiles.full_name,
          email: profiles.email,
          avatar_url: profiles.avatar_url,
        },
      })
      .from(messages)
      .leftJoin(profiles, eq(messages.user_id, profiles.id))
      .orderBy(desc(messages.created_at));
    return NextResponse.json({
      messages: rows.map((r) => ({ ...r.message, user: r.user })),
    });
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.user_id, user.id))
    .orderBy(desc(messages.created_at));
  return NextResponse.json({ messages: rows });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!subject || !content) {
    return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
  }

  const id = randomUUID();
  await db.insert(messages).values({
    id,
    user_id: user.id,
    subject,
    content,
    read: false,
  });
  return NextResponse.json({ ok: true, id });
}
