"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  "bridal",
  "party",
  "editorial",
  "natural",
  "special_effects",
  "other",
] as const;

export type ServiceFormValues = {
  title: string;
  description: string;
  price: string;
  duration_minutes: string;
  category: (typeof CATEGORIES)[number];
  image_url: string;
  available: boolean;
};

const FIELD_CLS =
  "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-brand-500";

export function ServiceForm({
  mode,
  serviceId,
  initial,
}: {
  mode: "create" | "edit";
  serviceId?: string;
  initial: ServiceFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ServiceFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ServiceFormValues>(
    key: K,
    val: ServiceFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.title.trim()) {
      setError("Title is required");
      return;
    }
    const priceNum = Number(values.price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Valid price is required");
      return;
    }
    const durationNum = Number(values.duration_minutes);
    if (!Number.isFinite(durationNum) || durationNum <= 0) {
      setError("Duration must be a positive number");
      return;
    }

    setLoading(true);
    const url =
      mode === "create"
        ? "/api/admin/makeup-services"
        : `/api/admin/makeup-services/${serviceId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title.trim(),
        description: values.description.trim() || null,
        price: priceNum,
        duration_minutes: durationNum,
        category: values.category,
        image_url: values.image_url.trim() || null,
        available: values.available,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to save service");
      setLoading(false);
      return;
    }

    router.push("/admin/makeup");
    router.refresh();
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-gray-300">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Bridal Makeup"
              required
              className={FIELD_CLS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe what's included in this service..."
              rows={4}
              className={FIELD_CLS}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-gray-300">
                Price (INR) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={values.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="3500"
                required
                className={FIELD_CLS}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration_minutes" className="text-gray-300">
                Duration (minutes) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="duration_minutes"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={values.duration_minutes}
                onChange={(e) => update("duration_minutes", e.target.value)}
                placeholder="60"
                required
                className={FIELD_CLS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <select
              id="category"
              value={values.category}
              onChange={(e) =>
                update(
                  "category",
                  e.target.value as ServiceFormValues["category"],
                )
              }
              className="flex h-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-800 text-white">
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image_url" className="text-gray-300">
              Image URL
            </Label>
            <Input
              id="image_url"
              type="url"
              value={values.image_url}
              onChange={(e) => update("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={FIELD_CLS}
            />
            <p className="text-xs text-gray-500">
              Paste a public image URL. Leave blank for a placeholder.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={values.available}
              onChange={(e) => update("available", e.target.checked)}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-brand-500"
            />
            <Label htmlFor="available" className="text-gray-300 cursor-pointer">
              Available for booking
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Service"
                  : "Save Changes"}
            </Button>
            <Link href="/admin/makeup">
              <Button
                type="button"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
