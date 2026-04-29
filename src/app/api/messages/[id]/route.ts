import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

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
  const update: Record<string, unknown> = {};
  if (typeof body?.read === "boolean") update.read = body.read;
  if (typeof body?.admin_reply === "string") {
    update.admin_reply = body.admin_reply;
    update.replied_at = new Date().toISOString();
    update.read = true;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await db.update(messages).set(update).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}
