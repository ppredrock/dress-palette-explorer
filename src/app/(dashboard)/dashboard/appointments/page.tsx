import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Plus, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Appointments" };

const statusColors: Record<string, "warning" | "success" | "secondary" | "destructive" | "default"> = {
  pending: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: appointments } = await supabase
    .from("makeup_appointments")
    .select("*, service:makeup_services(title, price, category, duration_minutes)")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: false });

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

      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const service = appt.service as {
              title: string; price: number; category: string; duration_minutes: number;
            } | null;
            return (
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
                        {service?.price && (
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
            );
          })}
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
