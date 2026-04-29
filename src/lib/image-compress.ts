export type CompressOptions = {
  maxWidth?: number;
  quality?: number;
  type?: "image/webp" | "image/jpeg";
};

export async function compressImage(
  file: File,
  opts: CompressOptions = {},
): Promise<Blob> {
  const { maxWidth = 1200, quality = 0.7, type = "image/webp" } = opts;

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

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Image encoding failed"));
      },
      type,
      quality,
    );
  });
}
