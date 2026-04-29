"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Dress } from "@/db/schema";

export function DressAdminCard({ dress }: { dress: Dress }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete "${dress.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/admin/dresses/${dress.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Failed to delete dress");
      setDeleting(false);
      return;
    }
    router.refresh();
  };

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:bg-gray-800 transition-colors">
      <div className="relative h-48 bg-gray-800">
        {dress.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dress.images[0]}
            alt={dress.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-600" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {dress.featured && (
            <Badge className="bg-brand-500 text-white border-0 text-xs">
              Featured
            </Badge>
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
        <p className="text-sm font-semibold text-white mb-0.5 truncate">
          {dress.title}
        </p>
        <p className="text-xs text-gray-400 capitalize mb-2">
          {dress.category}
        </p>
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-brand-400">
            {formatCurrency(dress.rental_price ?? 0)}/day
          </span>
          <span className="text-gray-500">{dress.sizes.length} sizes</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/dresses/${dress.id}/edit`}
            className="flex-1"
          >
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-1.5 border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            className="gap-1.5"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
