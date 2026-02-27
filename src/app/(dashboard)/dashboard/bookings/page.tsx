import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Plus, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Bookings" };

const statusColors: Record<string, "warning" | "success" | "secondary" | "destructive" | "default"> = {
  pending: "warning",
  confirmed: "success",
  completed: "secondary",
  cancelled: "destructive",
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("dress_bookings")
    .select("*, dress:dresses(id, title, images, rental_price, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Dress Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Your rental history and upcoming bookings</p>
        </div>
        <Link href="/dresses">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Book a Dress
          </Button>
        </Link>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const dress = booking.dress as {
              id: string; title: string; images: string[]; rental_price: number; category: string;
            } | null;
            return (
              <Card key={booking.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {dress?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={dress.images[0]} alt={dress.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-brand-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{dress?.title ?? "Dress"}</p>
                          <p className="text-xs text-gray-400 capitalize">{dress?.category}</p>
                        </div>
                        <Badge variant={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                          </span>
                        </div>
                        {booking.total_amount && (
                          <span className="font-medium text-brand-600">
                            {formatCurrency(booking.total_amount)}
                          </span>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-gray-400 mt-2 italic">&ldquo;{booking.notes}&rdquo;</p>
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
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Browse Neha&apos;s curated collection and rent your perfect dress.
            </p>
            <Link href="/dresses">
              <Button>Browse Dresses</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
