import type { H3Event } from "h3";
import { SITE } from "~/utils/site";

const validTypes = ["image/jpeg", "image/x-png", "image/png", "image/svg+xml", "image/gif", "image/webp"];
export const checkFileType = (type: string) => {
  if (!validTypes.includes(type)) {
    throw createError({
      statusCode: 415,
      statusMessage: "Unsupported Media Type"
    });
  }
};

export const uploadImage = (async (event: H3Event) => {
  const file = await readMultipartFormData(event);

  if (!file || !file.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request"
    });
  }

  const { type, filename, data } = file[0];

  checkFileType(type || "");

  const dateTime = new Date().getTime();

  if (process.dev) {
    const { writeFileSync } = await import("fs");
    writeFileSync(`./public/uploads/${filename}`, data);
    return { url: `/uploads/${filename}?updated=${dateTime}` };
  }
  else if (process.env.CDN) {
    const { cloudflare } = event.context;
    const headers = new Headers({ "Content-Type": type || "" });
    await cloudflare.env.CDN.put(`uploads/${filename}`, data, { httpMetadata: headers });
    return { url: `${SITE.cdn}/uploads/${filename}?updated=${dateTime}` };
  }
});
