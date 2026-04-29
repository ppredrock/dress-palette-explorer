import type { SessionOptions } from "iron-session";

export type SessionData = {
  userId?: string;
  role?: "user" | "admin";
};

export const sessionOptions: SessionOptions = {
  cookieName: "dp_session",
  password:
    process.env.SESSION_SECRET ??
    "dev-only-insecure-32-character-secret-change-me-in-production-please",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
