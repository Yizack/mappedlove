import type { MultiPartData, H3Event } from "h3";

const validTypes = ["image/jpeg", "image/x-png", "image/png", "image/gif", "image/webp"];
export const isValidFileType = (type: string) => {
  return validTypes.includes(type);
};

export const getFileFromUpload = (body: MultiPartData[] | undefined) => {
  const file = body?.find((item) => item.name === "file");
  if (!body || !body.length || !file) throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  const { type } = file;
  if (!isValidFileType(type || "")) throw createError({ statusCode: 415, statusMessage: "Unsupported Media Type" });
  return file;
};

export const uploadImage = (async (event: H3Event, file: MultiPartData | undefined, outputName?: string) : Promise<string | undefined> => {
  if (!file) return;
  const { type, filename, data } = file;
  const extention = filename?.split(".").pop()?.toLowerCase();
  const finalName = outputName ? `${outputName}.${extention}` : filename;
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
