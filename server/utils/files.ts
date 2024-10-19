import type { BlobSize } from "@nuxthub/core";

export const uploadImage = async (file: File, options: { name?: string, folder: string, customMetadata?: Record<string, string> }) => {
  const { name, folder, customMetadata } = options;
  if (!file) return;
  const finalName = name ? name : file.name;

  await hubBlob().put(`/${folder}/${finalName}`, file, {
    addRandomSuffix: false,
    contentType: file.type,
    prefix: "uploads",
    customMetadata
  });

  return finalName;
};

export const deleteImage = async (filepath: string) => {
  return hubBlob().delete(`uploads/${filepath}`);
};

export const isValidFileSize = (file: File, size: BlobSize) => {
  const [value, unit] = size.split(/(?<=\d)(?=[A-Z])/);
  if (!value) return false;
  const bytes = parseInt(value) * (2 ** (["B", "KB", "MB", "GB"].indexOf(unit || "") * 10));
  return file.size <= bytes;
};
