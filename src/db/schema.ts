import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

const userRoles = ["user", "admin"] as const;
const dressCategories = [
  "bridal", "party", "casual", "ethnic", "western", "fusion", "other",
] as const;
const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
const makeupCategories = [
  "bridal", "party", "editorial", "natural", "special_effects", "other",
] as const;
const appointmentStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
const postCategories = [
  "fashion", "makeup", "skincare", "lifestyle", "travel", "food", "other",
] as const;

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  phone: text("phone"),
  role: text("role", { enum: userRoles }).notNull().default("user"),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const dresses = sqliteTable("dresses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price"),
  rental_price: real("rental_price"),
  category: text("category", { enum: dressCategories }).notNull().default("other"),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  sizes: text("sizes", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  colors: text("colors", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const dress_bookings = sqliteTable("dress_bookings", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  dress_id: text("dress_id").notNull().references(() => dresses.id, { onDelete: "restrict" }),
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(),
  status: text("status", { enum: bookingStatuses }).notNull().default("pending"),
  notes: text("notes"),
  total_amount: real("total_amount"),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const makeup_services = sqliteTable("makeup_services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  duration_minutes: integer("duration_minutes").notNull().default(60),
  category: text("category", { enum: makeupCategories }).notNull().default("other"),
  image_url: text("image_url"),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const makeup_appointments = sqliteTable("makeup_appointments", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  service_id: text("service_id").notNull().references(() => makeup_services.id, { onDelete: "restrict" }),
  appointment_date: text("appointment_date").notNull(),
  appointment_time: text("appointment_time").notNull(),
  status: text("status", { enum: appointmentStatuses }).notNull().default("pending"),
  notes: text("notes"),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const lifestyle_posts = sqliteTable("lifestyle_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  cover_image: text("cover_image"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  category: text("category", { enum: postCategories }).notNull().default("other"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  published_at: text("published_at"),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
  updated_at: text("updated_at").notNull().default(sql`(current_timestamp)`),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  admin_reply: text("admin_reply"),
  replied_at: text("replied_at"),
  created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Dress = typeof dresses.$inferSelect;
export type NewDress = typeof dresses.$inferInsert;
export type DressBooking = typeof dress_bookings.$inferSelect;
export type NewDressBooking = typeof dress_bookings.$inferInsert;
export type MakeupService = typeof makeup_services.$inferSelect;
export type NewMakeupService = typeof makeup_services.$inferInsert;
export type MakeupAppointment = typeof makeup_appointments.$inferSelect;
export type NewMakeupAppointment = typeof makeup_appointments.$inferInsert;
export type LifestylePost = typeof lifestyle_posts.$inferSelect;
export type NewLifestylePost = typeof lifestyle_posts.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
