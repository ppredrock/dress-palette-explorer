import { redirect } from "next/navigation";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { ShoppingBag, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { dresses } from "@/db/schema";
import { DressAdminCard } from "./dress-admin-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Dresses" };
export const dynamic = "force-dynamic";

export default async function AdminDressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await db.select().from(dresses).orderBy(desc(dresses.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dress Collection</h1>
          <p className="text-gray-400 text-sm mt-1">{rows.length} dresses</p>
        </div>
        <Link href="/admin/dresses/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Dress
          </Button>
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((dress) => (
            <DressAdminCard key={dress.id} dress={dress} />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No dresses yet</p>
            <Link href="/admin/dresses/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Dress
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
