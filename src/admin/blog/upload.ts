import { ApiError } from "../api";

// Reduz a imagem no navegador (até 1600px, WebP) antes de enviar, para o site ficar leve.
async function shrink(file: File, maxSide = 1600): Promise<Blob> {
  if (file.type === "image/gif") return file; // mantém animação
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  return blob && blob.size < file.size ? blob : file;
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  const blob = await shrink(file);
  const res = await fetch("/api/admin/media", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": blob.type || file.type },
    body: blob,
  });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new ApiError(data.error ?? "Falha no envio da imagem.", res.status);
  return data.url;
}
