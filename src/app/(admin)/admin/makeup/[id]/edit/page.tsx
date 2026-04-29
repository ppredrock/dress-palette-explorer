import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { makeup_services } from "@/db/schema";
import { ServiceForm } from "../../_components/service-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Edit Makeup Service" };
export const dynamic = "force-dynamic";

export default async function EditMakeupServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const { id } = await params;
  const rows = await db
    .select()
    .from(makeup_services)
    .where(eq(makeup_services.id, id))
    .limit(1);
  const service = rows[0];
  if (!service) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Link
          href="/admin/makeup"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to services
        </Link>
        <h1 className="font-display text-2xl font-bold text-white">
          Edit Service
        </h1>
        <p className="text-gray-400 text-sm">{service.title}</p>
      </div>

      <ServiceForm
        mode="edit"
        serviceId={service.id}
        initial={{
          title: service.title,
          description: service.description ?? "",
          price: String(service.price),
          duration_minutes: String(service.duration_minutes),
          category: service.category,
          image_url: service.image_url ?? "",
          available: service.available,
        }}
      />
    </div>
  );
}
