import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Bookings" };

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("dress_bookings")
    .select("*, dress:dresses(title, images), user:profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const statusColors: Record<string, "warning" | "success" | "secondary" | "destructive"> = {
    pending: "warning",
    confirmed: "success",
    completed: "secondary",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dress Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">{bookings?.length ?? 0} total bookings</p>
        </div>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const dress = booking.dress as { title: string; images: string[] } | null;
            const bUser = booking.user as { full_name: string; email: string } | null;
            return (
              <Card key={booking.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                      {dress?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={dress.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{dress?.title ?? "Dress"}</p>
                        <Badge variant={statusColors[booking.status]}>{booking.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {bUser?.full_name ?? bUser?.email ?? "User"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                        </div>
                        {booking.total_amount && (
                          <span className="text-brand-400 font-medium">
                            {formatCurrency(booking.total_amount)}
                          </span>
                        )}
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
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No bookings yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
