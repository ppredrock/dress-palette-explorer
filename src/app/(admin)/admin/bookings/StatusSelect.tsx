"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

export default function StatusSelect({
  bookingId,
  initialStatus,
}: {
  bookingId: string;
  initialStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Status;
    const previous = status;
    setStatus(next);
    setSaving(true);
    setError(false);

    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus(previous);
      setError(true);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 capitalize"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-gray-800 capitalize">
            {s}
          </option>
        ))}
      </select>
      {saving && (
        <div className="w-3 h-3 border-2 border-gray-500/40 border-t-gray-200 rounded-full animate-spin" />
      )}
      {error && <span className="text-xs text-red-400">Failed</span>}
    </div>
  );
}
