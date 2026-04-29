import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { Sparkles, Plus, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { makeup_services } from "@/db/schema";
import { DeleteServiceButton } from "./_components/delete-service-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Makeup Services" };
export const dynamic = "force-dynamic";

export default async function AdminMakeupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await db
    .select()
    .from(makeup_services)
    .orderBy(desc(makeup_services.created_at));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Makeup Services
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {rows.length} service{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/makeup/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((service) => (
            <Card
              key={service.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:bg-gray-800 transition-colors"
            >
              <div className="relative h-48 bg-gray-800">
                {service.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <Badge
                    variant={service.available ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {service.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5 truncate">
                    {service.title}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {service.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-400 font-medium">
                    {formatCurrency(service.price)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    {service.duration_minutes}m
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/admin/makeup/${service.id}/edit`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                    >
                      Edit
                    </Button>
                  </Link>
                  <DeleteServiceButton id={service.id} title={service.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-16">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No makeup services yet</p>
            <Link href="/admin/makeup/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
