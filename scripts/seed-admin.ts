import { createClient } from "@libsql/client";
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { randomUUID, randomBytes } from "node:crypto";

loadEnv({ path: ".env.local" });

const email = process.argv[2] ?? "admin@dresspaletteexplorer.com";
const password = process.argv[3] ?? randomBytes(12).toString("base64url");
const fullName = process.argv[4] ?? "Admin";

(async () => {
  const c = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const existing = await c.execute({
    sql: "SELECT id FROM profiles WHERE email = ?",
    args: [email.toLowerCase()],
  });
  if (existing.rows.length > 0) {
    console.log("Admin already exists for", email, "— promoting role to 'admin'.");
    await c.execute({
      sql: "UPDATE profiles SET role = 'admin', updated_at = ? WHERE email = ?",
      args: [new Date().toISOString(), email.toLowerCase()],
    });
    console.log("Done. (Password unchanged.)");
    return;
  }

  const id = randomUUID();
  const hash = await bcrypt.hash(password, 10);
  await c.execute({
    sql: `INSERT INTO profiles (id, email, password_hash, full_name, role)
          VALUES (?, ?, ?, ?, 'admin')`,
    args: [id, email.toLowerCase(), hash, fullName],
  });

  console.log("Admin created:");
  console.log("  email:    ", email.toLowerCase());
  console.log("  password: ", password);
  console.log("  full_name:", fullName);
  console.log("  role:     ", "admin");
})();
