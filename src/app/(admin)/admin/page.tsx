import { redirect } from "next/navigation";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { ShoppingBag, Calendar, Users, MessageSquare, FileText, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  dresses, dress_bookings, makeup_appointments, messages, profiles,
} from "@/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [
    [{ c: totalDresses }],
    [{ c: totalBookings }],
    [{ c: pendingBookings }],
    [{ c: totalUsers }],
    [{ c: unreadMessages }],
    [{ c: totalAppointments }],
    [{ c: pendingAppointments }],
    recentBookingsRows,
    recentMessagesRows,
  ] = await Promise.all([
    db.select({ c: count() }).from(dresses),
    db.select({ c: count() }).from(dress_bookings),
    db.select({ c: count() }).from(dress_bookings).where(eq(dress_bookings.status, "pending")),
    db.select({ c: count() }).from(profiles).where(eq(profiles.role, "user")),
    db.select({ c: count() }).from(messages).where(eq(messages.read, false)),
    db.select({ c: count() }).from(makeup_appointments),
    db.select({ c: count() }).from(makeup_appointments).where(eq(makeup_appointments.status, "pending")),
    db
      .select({
        booking: dress_bookings,
        dressTitle: dresses.title,
        userFullName: profiles.full_name,
        userEmail: profiles.email,
      })
      .from(dress_bookings)
      .leftJoin(dresses, eq(dress_bookings.dress_id, dresses.id))
      .leftJoin(profiles, eq(dress_bookings.user_id, profiles.id))
      .orderBy(desc(dress_bookings.created_at))
      .limit(5),
    db
      .select({
        message: messages,
        userFullName: profiles.full_name,
        userEmail: profiles.email,
      })
      .from(messages)
      .leftJoin(profiles, eq(messages.user_id, profiles.id))
      .orderBy(desc(messages.created_at))
      .limit(5),
  ]);

  const stats = [
    { label: "Total Dresses", value: totalDresses, icon: ShoppingBag, href: "/admin/dresses", color: "text-brand-400" },
    { label: "Dress Bookings", value: totalBookings, icon: Calendar, href: "/admin/bookings", color: "text-blush-400", badge: pendingBookings },
    { label: "Appointments", value: totalAppointments, icon: Sparkles, href: "/admin/appointments", color: "text-purple-400", badge: pendingAppointments },
    { label: "Members", value: totalUsers, icon: Users, href: "/admin/users", color: "text-sky-400" },
    { label: "Unread Messages", value: unreadMessages, icon: MessageSquare, href: "/admin/messages", color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Overview</h1>
        <p className="text-gray-400 text-sm">Manage your boutique from one place</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  {stat.badge !== undefined && stat.badge > 0 && (
                    <Badge variant="warning" className="text-xs">{stat.badge}</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-white">Recent Bookings</CardTitle>
            <Link href="/admin/bookings" className="text-xs text-brand-400 hover:text-brand-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookingsRows.length > 0 ? (
              <div className="space-y-3">
                {recentBookingsRows.map((row) => (
                  <div key={row.booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {row.dressTitle ?? "Dress"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {row.userFullName ?? row.userEmail ?? "User"} · {formatDate(row.booking.start_date)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        row.booking.status === "confirmed" ? "success" :
                        row.booking.status === "pending" ? "warning" :
                        row.booking.status === "cancelled" ? "destructive" : "secondary"
                      }
                      className="text-xs shrink-0"
                    >
                      {row.booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-white">Recent Messages</CardTitle>
            <Link href="/admin/messages" className="text-xs text-brand-400 hover:text-brand-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentMessagesRows.length > 0 ? (
              <div className="space-y-3">
                {recentMessagesRows.map((row) => (
                  <Link key={row.message.id} href="/admin/messages">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{row.message.subject}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {row.userFullName ?? row.userEmail ?? "User"}
                        </p>
                      </div>
                      {!row.message.read && (
                        <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No messages yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: "/admin/dresses", label: "Add Dress", icon: ShoppingBag },
              { href: "/admin/makeup", label: "Add Service", icon: Sparkles },
              { href: "/admin/posts", label: "New Post", icon: FileText },
              { href: "/admin/messages", label: "Reply Messages", icon: MessageSquare },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-xl p-3 text-sm text-gray-300 hover:text-white transition-all cursor-pointer">
                  <Icon className="w-4 h-4 text-brand-400" />
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
