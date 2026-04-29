export type CompressOptions = {
  maxWidth?: number;
  quality?: number;
  type?: "image/webp" | "image/jpeg";
};

async function encode(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export async function compressImage(
  file: File,
  opts: CompressOptions = {},
): Promise<Blob> {
  const { maxWidth = 1200, quality = 0.7 } = opts;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try WebP first (~30% smaller); fall back to JPEG on browsers that
  // don't encode WebP via canvas.toBlob (older iOS Safari).
  const preferred = opts.type ?? "image/webp";
  let blob = await encode(canvas, preferred, quality);
  if (!blob && preferred !== "image/jpeg") {
    blob = await encode(canvas, "image/jpeg", quality);
  }
  if (!blob) throw new Error("Image encoding failed");
  return blob;
}
