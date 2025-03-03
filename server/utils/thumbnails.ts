export const createThumbnail = async (file: File, options: { name: string, metadata?: Record<string, string> }) => {
  if (import.meta.dev) return;
  const formData = new FormData();
  formData.append("file", file);

  const image = await $fetch<Blob>("/api/stories/thumbnails", {
    method: "POST",
    body: formData,
    responseType: "blob"
  }).catch((e) => {
    console.warn(e);
    return null;
  });

  if (!image) return;

  await uploadImage(image, {
    name: options.name,
    folder: "thumbnails",
    type: "image/webp",
    customMetadata: options.metadata
  });
};
