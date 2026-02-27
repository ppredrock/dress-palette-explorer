import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShoppingBag, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Dresses" };

export default async function AdminDressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: dresses } = await supabase
    .from("dresses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dress Collection</h1>
          <p className="text-gray-400 text-sm mt-1">{dresses?.length ?? 0} dresses</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Dress
        </Button>
      </div>

      {dresses && dresses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dresses.map((dress) => (
            <Card key={dress.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:bg-gray-800 transition-colors">
              <div className="relative h-48 bg-gray-800">
                {dress.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dress.images[0]} alt={dress.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {dress.featured && (
                    <Badge className="bg-brand-500 text-white border-0 text-xs">Featured</Badge>
                  )}
                  <Badge
                    variant={dress.available ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {dress.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-white mb-0.5 truncate">{dress.title}</p>
                <p className="text-xs text-gray-400 capitalize mb-2">{dress.category}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-400">
                    {formatCurrency(dress.rental_price ?? 0)}/day
                  </span>
                  <span className="text-gray-500">
                    {dress.sizes.length} sizes
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No dresses yet</p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Dress
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
