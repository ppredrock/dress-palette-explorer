"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

export function StatusSelect({
  appointmentId,
  initial,
}: {
  appointmentId: string;
  initial: Status;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Status>(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Status;
    const prev = value;
    setValue(next);
    setSaving(true);
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (!res.ok) {
      alert("Failed to update status");
      setValue(prev);
      return;
    }
    router.refresh();
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-white capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-gray-800 text-white">
          {s}
        </option>
      ))}
    </select>
  );
}
