import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { makeup_appointments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

function isStatus(v: unknown): v is Status {
  return typeof v === "string" && (STATUSES as readonly string[]).includes(v);
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

  if (!body || !isStatus(body.status)) {
    return NextResponse.json(
      { error: "Valid status is required" },
      { status: 400 },
    );
  }

  await db
    .update(makeup_appointments)
    .set({ status: body.status, updated_at: new Date().toISOString() })
    .where(eq(makeup_appointments.id, id));

  return NextResponse.json({ ok: true });
}
