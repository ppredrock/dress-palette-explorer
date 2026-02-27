import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Calendar, MessageSquare, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const [{ data: bookings }, { data: appointments }, { data: messages }] = await Promise.all([
    supabase
      .from("dress_bookings")
      .select("*, dress:dresses(title, images)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("makeup_appointments")
      .select("*, service:makeup_services(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const unreadMessages = messages?.filter((m) => m.admin_reply && !m.read).length ?? 0;

  const stats = [
    {
      label: "Dress Bookings",
      value: bookings?.length ?? 0,
      icon: ShoppingBag,
      href: "/dashboard/bookings",
      color: "bg-brand-50 text-brand-600",
    },
    {
      label: "Appointments",
      value: appointments?.length ?? 0,
      icon: Calendar,
      href: "/dashboard/appointments",
      color: "bg-blush-50 text-blush-700",
    },
    {
      label: "Messages",
      value: messages?.length ?? 0,
      icon: MessageSquare,
      href: "/dashboard/messages",
      color: "bg-purple-50 text-purple-600",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
  ];

  const statusColors: Record<string, string> = {
    pending: "warning",
    confirmed: "success",
    completed: "secondary",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center shadow-sm">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hello, {profile?.full_name?.split(" ")[0] ?? "there"}! ✨
          </h1>
          <p className="text-gray-500 text-sm">Your personal DressPalette dashboard</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                {stat.badge !== undefined && (
                  <Badge variant="destructive" className="text-xs">{stat.badge} new</Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {(booking.dress as { title?: string })?.title ?? "Dress"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(booking.start_date)}
                      </div>
                    </div>
                    <Badge variant={statusColors[booking.status] as "warning" | "success" | "secondary" | "destructive"}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No bookings yet</p>
                <Link href="/dresses">
                  <Button size="sm">Browse Dresses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent appointments */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Upcoming Appointments</CardTitle>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-brand-600 hover:text-brand-700">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blush-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blush-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blush-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {(appt.service as { title?: string })?.title ?? "Service"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(appt.appointment_date)} at {appt.appointment_time}
                      </div>
                    </div>
                    <Badge variant={statusColors[appt.status] as "warning" | "success" | "secondary" | "destructive"}>
                      {appt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No appointments yet</p>
                <Link href="/makeup">
                  <Button size="sm">Book Makeup</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-brand-50 to-blush-50">
        <CardContent className="p-6">
          <h3 className="font-display font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/dresses", label: "Browse Dresses", icon: ShoppingBag },
              { href: "/makeup", label: "Book Makeup", icon: Sparkles },
              { href: "/lifestyle", label: "Read Blog", icon: ArrowRight },
              { href: "/dashboard/messages", label: "Message Neha", icon: MessageSquare },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-2 bg-white rounded-xl p-3 text-sm font-medium text-gray-700 hover:text-brand-600 hover:shadow-sm transition-all cursor-pointer">
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
