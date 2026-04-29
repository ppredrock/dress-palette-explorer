"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      window.alert("Failed to delete post");
      return;
    }

    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={deleting}
      className="text-gray-400 hover:text-red-400"
      aria-label="Delete post"
    >
      {deleting ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
