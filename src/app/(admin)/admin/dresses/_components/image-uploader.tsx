"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { compressImage } from "@/lib/image-compress";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
};

type SignResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

async function uploadToCloudinary(
  blob: Blob,
  filename: string,
  folder: string | undefined,
): Promise<string> {
  const sigRes = await fetch("/api/admin/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!sigRes.ok) {
    const body = await sigRes.json().catch(() => null);
    throw new Error(body?.error ?? `Could not sign upload (${sigRes.status})`);
  }
  const sig: SignResponse = await sigRes.json();

  const fd = new FormData();
  fd.append("file", blob, filename);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: fd },
  );
  if (!upRes.ok) {
    const body = await upRes.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? `Cloudinary upload failed (${upRes.status})`,
    );
  }
  const result = (await upRes.json()) as { secure_url: string };
  return result.secure_url;
}

export function ImageUploader({ value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    const newUrls: string[] = [];
    try {
      for (const [idx, file] of Array.from(files).entries()) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} isn't an image`);
        }
        const compressed = await compressImage(file, { maxWidth: 1200, quality: 0.7 });
        const isWebp = compressed.type === "image/webp";
        const ext = isWebp ? ".webp" : ".jpg";
        const filename = file.name.replace(/\.[^.]+$/, ext);
        const url = await uploadToCloudinary(compressed, filename, folder);
        newUrls.push(url);
        setProgress({ done: idx + 1, total: files.length });
      }
      onChange([...value, ...newUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-800 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                aria-label="Remove image"
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed text-sm cursor-pointer transition-colors ${
          uploading
            ? "border-gray-700 bg-gray-800/50 text-gray-400 cursor-wait"
            : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-brand-500 hover:text-white"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {progress
              ? `Uploading ${progress.done}/${progress.total}...`
              : "Uploading..."}
          </>
        ) : value.length === 0 ? (
          <>
            <ImagePlus className="w-4 h-4" />
            Tap to upload images
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Add more
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {value.length === 0 && !uploading && !error && (
        <p className="text-xs text-gray-500">
          Images are auto-resized to 1200px and compressed before upload.
        </p>
      )}
    </div>
  );
}
