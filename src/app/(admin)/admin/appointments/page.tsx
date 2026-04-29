import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { makeup_appointments, makeup_services, profiles } from "@/db/schema";
import { StatusSelect } from "./_components/status-select";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Appointments" };
export const dynamic = "force-dynamic";

const statusColors: Record<
  string,
  "warning" | "success" | "secondary" | "destructive"
> = {
  pending: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export default async function AdminAppointmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await db
    .select({
      appointment: makeup_appointments,
      serviceTitle: makeup_services.title,
      serviceImage: makeup_services.image_url,
      servicePrice: makeup_services.price,
      serviceDuration: makeup_services.duration_minutes,
      userFullName: profiles.full_name,
      userEmail: profiles.email,
    })
    .from(makeup_appointments)
    .leftJoin(
      makeup_services,
      eq(makeup_appointments.service_id, makeup_services.id),
    )
    .leftJoin(profiles, eq(makeup_appointments.user_id, profiles.id))
    .orderBy(desc(makeup_appointments.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Makeup Appointments
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {rows.length} total appointment{rows.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row) => {
            const cover = row.serviceImage;
            return (
              <Card
                key={row.appointment.id}
                className="bg-gray-900 border-gray-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">
                          {row.serviceTitle ?? "Service"}
                        </p>
                        <Badge variant={statusColors[row.appointment.status]}>
                          {row.appointment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {row.userFullName ?? row.userEmail ?? "User"}
                        {row.userFullName && row.userEmail
                          ? ` · ${row.userEmail}`
                          : ""}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(row.appointment.appointment_date)} at{" "}
                          {row.appointment.appointment_time}
                        </div>
                        {row.serviceDuration != null && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {row.serviceDuration}m
                          </div>
                        )}
                        {row.servicePrice != null && (
                          <span className="text-brand-400 font-medium">
                            {formatCurrency(row.servicePrice)}
                          </span>
                        )}
                      </div>
                      {row.appointment.notes && (
                        <p className="text-xs text-gray-500 mb-3 italic">
                          “{row.appointment.notes}”
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Status:</span>
                        <StatusSelect
                          appointmentId={row.appointment.id}
                          initial={row.appointment.status}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No appointments yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
