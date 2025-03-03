import type { BlobSize } from "@nuxthub/core";

export const uploadImage = async (
  body: File | Blob,
  options: { name?: string, folder: string, type?: string, customMetadata?: Record<string, string> }
) => {
  const { name, folder, customMetadata, type } = options;

  if (!body) return;
  const finalName = name ? name : body instanceof File ? body.name : "";
  if (!finalName) return;
  const contentType = type || (body instanceof File ? body.type : undefined);

  await hubBlob().put(`/${folder}/${finalName}`, body, {
    addRandomSuffix: false,
    contentType: contentType,
    prefix: "uploads",
    customMetadata
  });

  return finalName;
};

export const deleteImage = async (filepath: string | string[]) => {
  const uploadsPath = Array.isArray(filepath) ? filepath.map(path => `uploads/${path}`) : `uploads/${filepath}`;
  return hubBlob().delete(uploadsPath).catch(() => null);
};

export const isValidFileSize = (file: File, size: BlobSize) => {
  const [value, unit] = size.split(/(?<=\d)(?=[A-Z])/);
  if (!value) return false;
  const bytes = parseInt(value) * (2 ** (["B", "KB", "MB", "GB"].indexOf(unit || "") * 10));
  return file.size <= bytes;
};
