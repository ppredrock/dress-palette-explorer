import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Calendar, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { dress_bookings, dresses, profiles } from "@/db/schema";
import StatusSelect from "./StatusSelect";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Bookings" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await db
    .select({
      booking: dress_bookings,
      dressTitle: dresses.title,
      dressImages: dresses.images,
      userFullName: profiles.full_name,
      userEmail: profiles.email,
    })
    .from(dress_bookings)
    .leftJoin(dresses, eq(dress_bookings.dress_id, dresses.id))
    .leftJoin(profiles, eq(dress_bookings.user_id, profiles.id))
    .orderBy(desc(dress_bookings.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dress Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">{rows.length} total bookings</p>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row) => {
            const cover = row.dressImages?.[0];
            return (
              <Card key={row.booking.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{row.dressTitle ?? "Dress"}</p>
                        <StatusSelect
                          bookingId={row.booking.id}
                          initialStatus={row.booking.status}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {row.userFullName ?? row.userEmail ?? "User"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(row.booking.start_date)} → {formatDate(row.booking.end_date)}
                        </div>
                        {row.booking.total_amount && (
                          <span className="text-brand-400 font-medium">
                            {formatCurrency(row.booking.total_amount)}
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
