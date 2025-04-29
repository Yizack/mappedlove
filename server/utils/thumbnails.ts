import type { H3Event } from "h3";
import type { ReadableStream } from "@cloudflare/workers-types";

export const createThumbnail = async (event: H3Event, file: File, options: { name: string, metadata?: Record<string, string> }) => {
  if (import.meta.dev) return;
  const formData = new FormData();
  formData.append("file", file);

  const stream = file.stream() as ReadableStream<Uint8Array>;

  const imageBinding = await event.context.cloudflare.env.IMAGES.input(stream)
    .transform({
      fit: "cover",
      height: 75,
      width: 75
    })
    .output({
      format: "image/webp"
    }).catch(() => null);

  if (!imageBinding) return;

  const blob = await imageBinding.response().blob() as Blob;

  return uploadImage(blob, {
    name: options.name,
    folder: "thumbnails",
    type: "image/webp",
    customMetadata: options.metadata
  });
};
