import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, type Profile } from "@/db/schema";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function getSession() {
  const c = await cookies();
  return getIronSession<SessionData>(c, sessionOptions);
}

export async function getCurrentUser(): Promise<Profile | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
