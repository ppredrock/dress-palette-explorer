import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Calendar, Users, MessageSquare, FileText, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Overview" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { count: totalDresses },
    { count: totalBookings },
    { count: pendingBookings },
    { count: totalUsers },
    { count: unreadMessages },
    { count: totalAppointments },
    { count: pendingAppointments },
    { data: recentBookings },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("dresses").select("*", { count: "exact", head: true }),
    supabase.from("dress_bookings").select("*", { count: "exact", head: true }),
    supabase.from("dress_bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("makeup_appointments").select("*", { count: "exact", head: true }),
    supabase.from("makeup_appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("dress_bookings")
      .select("*, dress:dresses(title), user:profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("messages")
      .select("*, user:profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Total Dresses", value: totalDresses ?? 0, icon: ShoppingBag, href: "/admin/dresses", color: "text-brand-400" },
    { label: "Dress Bookings", value: totalBookings ?? 0, icon: Calendar, href: "/admin/bookings", color: "text-blush-400", badge: pendingBookings ?? 0 },
    { label: "Appointments", value: totalAppointments ?? 0, icon: Sparkles, href: "/admin/appointments", color: "text-purple-400", badge: pendingAppointments ?? 0 },
    { label: "Members", value: totalUsers ?? 0, icon: Users, href: "/admin/users", color: "text-sky-400" },
    { label: "Unread Messages", value: unreadMessages ?? 0, icon: MessageSquare, href: "/admin/messages", color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Overview</h1>
        <p className="text-gray-400 text-sm">Manage your boutique from one place</p>
      </div>

      {/* Stats */}
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
        {/* Recent bookings */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-white">Recent Bookings</CardTitle>
            <Link href="/admin/bookings" className="text-xs text-brand-400 hover:text-brand-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const dress = booking.dress as { title: string } | null;
                  const bUser = booking.user as { full_name: string; email: string } | null;
                  return (
                    <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {dress?.title ?? "Dress"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {bUser?.full_name ?? bUser?.email ?? "User"} · {formatDate(booking.start_date)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed" ? "success" :
                          booking.status === "pending" ? "warning" :
                          booking.status === "cancelled" ? "destructive" : "secondary"
                        }
                        className="text-xs shrink-0"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-white">Recent Messages</CardTitle>
            <Link href="/admin/messages" className="text-xs text-brand-400 hover:text-brand-300">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentMessages && recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((msg) => {
                  const msgUser = msg.user as { full_name: string; email: string } | null;
                  return (
                    <Link key={msg.id} href="/admin/messages">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-purple-900 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{msg.subject}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {msgUser?.full_name ?? msgUser?.email ?? "User"}
                          </p>
                        </div>
                        {!msg.read && (
                          <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No messages yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
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
