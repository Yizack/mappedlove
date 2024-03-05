import type { MultiPartData, H3Event } from "h3";

export const isValidFileSize = (bytes: number, sizeMB: number) => {
  const MBsize = bytes / 1024 / 1024;
  return MBsize <= sizeMB;
};

const validTypes = ["image/jpeg", "image/x-png", "image/png", "image/gif", "image/webp"];
export const isValidFileType = (type: string) => {
  return validTypes.includes(type);
};

export const getFileFromUpload = (body: MultiPartData[] | undefined) => {
  const file = body?.find((item) => item.name === "file");
  if (!body || !body.length || !file) return;
  const { type } = file;
  if (!isValidFileType(type || "")) throw createError({ statusCode: ErrorCode.UNSUPPORTED_FILE, message: "unsupported_file" });
  return file;
};

export const uploadImage = (async (file: MultiPartData | undefined, outputName: string, folder: string, sizeMB: number, event: H3Event) : Promise<string | undefined> => {
  if (!file) return;
  const { type, filename, data } = file;
  if(!isValidFileSize(data.byteLength, sizeMB)) return undefined;
  const finalName = outputName ? `${outputName}` : filename;
  if (import.meta.dev) {
    const { writeFileSync, existsSync, mkdirSync } = await import("fs");
    if (!existsSync(`./public/uploads/${folder}`)) mkdirSync(`./public/uploads/${folder}`, { recursive: true });
    writeFileSync(`./public/uploads/${folder}/${finalName}`, data);
    return finalName;
  }
  else if (process.env.CDN) {
    const { cloudflare } = event.context;
    const headers = new Headers({ "Content-Type": type || "" });
    await cloudflare.env.CDN.put(`uploads/${folder}/${finalName}`, data, { httpMetadata: headers });
    return finalName;
  }
});

export const deleteImage = (async (filename: string, event: H3Event) : Promise<void> => {
  if (import.meta.dev) {
    const { unlinkSync } = await import("fs");
    unlinkSync(`./public/uploads/${filename}`);
  }
  else if (process.env.CDN) {
    const { cloudflare } = event.context;
    await cloudflare.env.CDN.delete(`uploads/${filename}`);
  }
});
