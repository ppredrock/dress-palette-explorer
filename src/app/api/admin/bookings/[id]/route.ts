import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { dress_bookings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;
type BookingStatus = (typeof BOOKING_STATUSES)[number];

function isStatus(value: unknown): value is BookingStatus {
  return (
    typeof value === "string" &&
    (BOOKING_STATUSES as readonly string[]).includes(value)
  );
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

  if (!isStatus(body?.status)) {
    return NextResponse.json(
      { error: "Invalid or missing status" },
      { status: 400 },
    );
  }

  await db
    .update(dress_bookings)
    .set({ status: body.status, updated_at: new Date().toISOString() })
    .where(eq(dress_bookings.id, id));

  return NextResponse.json({ ok: true });
}
