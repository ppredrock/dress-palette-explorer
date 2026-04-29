"use client";

import { useState, useEffect, type FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Dress } from "@/db/schema";

const CATEGORIES = [
  "bridal",
  "party",
  "casual",
  "ethnic",
  "western",
  "fusion",
  "other",
] as const;

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditDressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("other");
  const [images, setImages] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/admin/dresses/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      if (cancelled) return;
      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as { dress?: Dress };
        const d = data.dress;
        if (d) {
          setTitle(d.title ?? "");
          setDescription(d.description ?? "");
          setPrice(d.price == null ? "" : String(d.price));
          setRentalPrice(
            d.rental_price == null ? "" : String(d.rental_price),
          );
          setCategory(d.category as (typeof CATEGORIES)[number]);
          setImages((d.images ?? []).join(", "));
          setSizes((d.sizes ?? []).join(", "));
          setColors((d.colors ?? []).join(", "));
          setAvailable(d.available);
          setFeatured(d.featured);
          setLoading(false);
          return;
        }
      }
      // Fallback: try to find via list endpoint isn't available; just show empty form
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      price: price === "" ? null : Number(price),
      rental_price: rentalPrice === "" ? null : Number(rentalPrice),
      category,
      images: splitCsv(images),
      sizes: splitCsv(sizes),
      colors: splitCsv(colors),
      available,
      featured,
    };

    const res = await fetch(`/api/admin/dresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to update dress");
      setSubmitting(false);
      return;
    }

    router.push("/admin/dresses");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dresses"
            className="text-gray-400 hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">
            Dress not found
          </h1>
        </div>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <p className="text-gray-400">
              The dress you&apos;re trying to edit doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/dresses"
          className="text-gray-400 hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Edit Dress
          </h1>
          <p className="text-gray-400 text-sm mt-1">Update collection details</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-200">
                Title <span className="text-brand-400">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-200">
                  Purchase Price (INR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rental_price" className="text-gray-200">
                  Rental Price (INR/day)
                </Label>
                <Input
                  id="rental_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-200">
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as (typeof CATEGORIES)[number])
                }
                className="flex h-10 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-gray-200">
                Image URLs{" "}
                <span className="text-gray-500 text-xs">(comma-separated)</span>
              </Label>
              <Input
                id="images"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sizes" className="text-gray-200">
                  Sizes{" "}
                  <span className="text-gray-500 text-xs">(comma-separated)</span>
                </Label>
                <Input
                  id="sizes"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colors" className="text-gray-200">
                  Colors{" "}
                  <span className="text-gray-500 text-xs">(comma-separated)</span>
                </Label>
                <Input
                  id="colors"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                Featured
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/admin/dresses">
                <Button type="button" variant="ghost" className="text-gray-300">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
