import type { MultiPartData, H3Event } from "h3";

export const isValidFileSize = (bytes: number) => {
  const MBsize = bytes / 1024 / 1024;
  return MBsize <= 8;
};

const validTypes = ["image/jpeg", "image/x-png", "image/png", "image/gif", "image/webp"];
export const isValidFileType = (type: string) => {
  return validTypes.includes(type);
};

export const getFileFromUpload = (body: MultiPartData[] | undefined) => {
  const file = body?.find((item) => item.name === "file");
  if (!body || !body.length || !file) return;
  const { type } = file;
  if (!isValidFileType(type || "")) throw createError({ statusCode: 415, statusMessage: "Unsupported Media Type" });
  return file;
};

export const uploadImage = (async (event: H3Event, file: MultiPartData | undefined, outputName?: string) : Promise<string | undefined> => {
  if (!file) return;
  const { type, filename, data } = file;
  if(!isValidFileSize(data.byteLength)) return undefined;
  const finalName = outputName ? `${outputName}` : filename;
  if (process.dev) {
    const { writeFileSync, existsSync, mkdirSync } = await import("fs");
    if (!existsSync("./public/uploads")) mkdirSync("./public/uploads");
    writeFileSync(`./public/uploads/${finalName}`, data);
    return `${finalName}`;
  }
  else if (process.env.CDN) {
    const { cloudflare } = event.context;
    const headers = new Headers({ "Content-Type": type || "" });
    await cloudflare.env.CDN.put(`uploads/${finalName}`, data, { httpMetadata: headers });
    return `${finalName}`;
  }
});

export const deleteImage = (async (event: H3Event, filename: string) : Promise<void> => {
  if (process.dev) {
    const { unlinkSync } = await import("fs");
    unlinkSync(`./public/uploads/${filename}`);
  }
  else if (process.env.CDN) {
    const { cloudflare } = event.context;
    await cloudflare.env.CDN.delete(`uploads/${filename}`);
  }
});
