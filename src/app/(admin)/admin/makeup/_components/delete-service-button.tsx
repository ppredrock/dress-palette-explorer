"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteServiceButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/makeup-services/${id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (!res.ok) {
      alert("Failed to delete service");
      return;
    }
    router.refresh();
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
      className="flex-1"
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
