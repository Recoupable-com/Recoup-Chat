export type FileVisual = { icon: "plain" | "image" | "pdf" | "word" | "csv" | "json" | "audio" | "video"; color: string };

export default function getFileVisual(fileName: string, mime?: string | null): FileVisual {
  const lower = fileName.toLowerCase();
  const type = mime || "";

  if (type.startsWith("image/") || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(lower)) {
    return { icon: "image", color: "text-blue-500" };
  }
  if (type.startsWith("audio/") || /\.(mp3|wav|m4a|flac|aac|ogg)$/.test(lower)) {
    return { icon: "audio", color: "text-pink-500" };
  }
  if (type.startsWith("video/") || /\.(mp4|mov|webm|mkv)$/.test(lower)) {
    return { icon: "video", color: "text-rose-500" };
  }
  if (/\.pdf$/.test(lower)) {
    return { icon: "pdf", color: "text-red-500" };
  }
  if (/\.(doc|docx)$/.test(lower)) {
    return { icon: "word", color: "text-blue-600" };
  }
  if (/\.(csv)$/.test(lower)) {
    return { icon: "csv", color: "text-emerald-600" };
  }
  if (/\.(json)$/.test(lower)) {
    return { icon: "json", color: "text-amber-600" };
  }
  return { icon: "plain", color: "text-muted-foreground" };
}


