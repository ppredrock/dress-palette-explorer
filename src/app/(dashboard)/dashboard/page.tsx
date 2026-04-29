import { redirect } from "next/navigation";
import Link from "next/link";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { ShoppingBag, Calendar, MessageSquare, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  dress_bookings, dresses, makeup_appointments, makeup_services, messages,
} from "@/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [bookingRows, appointmentRows, msgRows] = await Promise.all([
    db
      .select({
        booking: dress_bookings,
        dressTitle: dresses.title,
        dressImages: dresses.images,
      })
      .from(dress_bookings)
      .leftJoin(dresses, eq(dress_bookings.dress_id, dresses.id))
      .where(eq(dress_bookings.user_id, user.id))
      .orderBy(desc(dress_bookings.created_at))
      .limit(3),
    db
      .select({
        appointment: makeup_appointments,
        serviceTitle: makeup_services.title,
      })
      .from(makeup_appointments)
      .leftJoin(makeup_services, eq(makeup_appointments.service_id, makeup_services.id))
      .where(eq(makeup_appointments.user_id, user.id))
      .orderBy(desc(makeup_appointments.created_at))
      .limit(3),
    db
      .select()
      .from(messages)
      .where(eq(messages.user_id, user.id))
      .orderBy(desc(messages.created_at))
      .limit(5),
  ]);

  const unreadMessages = msgRows.filter((m) => m.admin_reply && !m.read).length;

  const stats = [
    {
      label: "Dress Bookings",
      value: bookingRows.length,
      icon: ShoppingBag,
      href: "/dashboard/bookings",
      color: "bg-brand-50 text-brand-600",
    },
    {
      label: "Appointments",
      value: appointmentRows.length,
      icon: Calendar,
      href: "/dashboard/appointments",
      color: "bg-blush-50 text-blush-700",
    },
    {
      label: "Messages",
      value: msgRows.length,
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

  // suppress unused import warning while keeping isNotNull available for future filters
  void isNotNull; void and;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-blush-500 flex items-center justify-center shadow-sm">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Hello, {user.full_name?.split(" ")[0] ?? "there"}! ✨
          </h1>
          <p className="text-gray-500 text-sm">Your personal DressPalette dashboard</p>
        </div>
      </div>

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
            {bookingRows.length > 0 ? (
              <div className="space-y-3">
                {bookingRows.map((row) => (
                  <div key={row.booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {row.dressTitle ?? "Dress"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(row.booking.start_date)}
                      </div>
                    </div>
                    <Badge variant={statusColors[row.booking.status] as "warning" | "success" | "secondary" | "destructive"}>
                      {row.booking.status}
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
            {appointmentRows.length > 0 ? (
              <div className="space-y-3">
                {appointmentRows.map((row) => (
                  <div key={row.appointment.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blush-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blush-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blush-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {row.serviceTitle ?? "Service"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(row.appointment.appointment_date)} at {row.appointment.appointment_time}
                      </div>
                    </div>
                    <Badge variant={statusColors[row.appointment.status] as "warning" | "success" | "secondary" | "destructive"}>
                      {row.appointment.status}
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
