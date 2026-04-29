import { redirect } from "next/navigation";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Sparkles, Plus, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { makeup_appointments, makeup_services } from "@/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Appointments" };
export const dynamic = "force-dynamic";

const statusColors: Record<string, "warning" | "success" | "secondary" | "destructive" | "default"> = {
  pending: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await db
    .select({
      appointment: makeup_appointments,
      service: {
        title: makeup_services.title,
        price: makeup_services.price,
        category: makeup_services.category,
        duration_minutes: makeup_services.duration_minutes,
      },
    })
    .from(makeup_appointments)
    .leftJoin(makeup_services, eq(makeup_appointments.service_id, makeup_services.id))
    .where(eq(makeup_appointments.user_id, user.id))
    .orderBy(desc(makeup_appointments.appointment_date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Makeup Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Your scheduled sessions with Neha</p>
        </div>
        <Link href="/makeup">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Book Session
          </Button>
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map(({ appointment: appt, service }) => (
            <Card key={appt.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blush-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-blush-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{service?.title ?? "Makeup Service"}</p>
                        <p className="text-xs text-gray-400 capitalize">{service?.category}</p>
                      </div>
                      <Badge variant={statusColors[appt.status]}>
                        {appt.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(appt.appointment_date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.appointment_time}
                      </div>
                      {service?.price != null && (
                        <span className="font-medium text-brand-600">{formatCurrency(service.price)}</span>
                      )}
                    </div>
                    {appt.notes && (
                      <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{appt.notes}&rdquo;</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Book a makeup session with Neha and let her work her magic.
            </p>
            <Link href="/makeup">
              <Button>Book Makeup</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
