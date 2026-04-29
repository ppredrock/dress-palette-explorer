import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ServiceForm } from "../_components/service-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — New Makeup Service" };
export const dynamic = "force-dynamic";

export default async function NewMakeupServicePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

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
          New Makeup Service
        </h1>
        <p className="text-gray-400 text-sm">
          Add a new service to your offerings.
        </p>
      </div>

      <ServiceForm
        mode="create"
        initial={{
          title: "",
          description: "",
          price: "",
          duration_minutes: "60",
          category: "other",
          image_url: "",
          available: true,
        }}
      />
    </div>
  );
}
