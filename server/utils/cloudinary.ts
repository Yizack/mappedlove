import type { H3Event } from "h3";

const readLocalFileToBase64URL = async (filename: string) => {
  const { readFileSync } = await import("fs");
  const file = readFileSync(filename);
  const type = filename.split(".").pop();
  return `data:image/${type};base64,${file.toString("base64")}`;
};

export const uploadToCloudinary = async (filename: string, preset: string, event: H3Event) => {
  const time = Date.now();
  const file = process.dev ? await readLocalFileToBase64URL(`public/uploads/${filename}`) : `${SITE.cdn}/uploads/${filename}?updated=${time}`;
  const { cloudinary } = useRuntimeConfig(event);

  const data = {
    invalidate: String(true),
    public_id: filename,
    timestamp: time.toString(),
    upload_preset: preset,
  };

  const toSign = new URLSearchParams(data).toString();
  const signature = hash(toSign + cloudinary.secret);

  await $fetch(`https://api.cloudinary.com/v1_1/${cloudinary.name}/image/upload`, {
    method: "POST",
    body: {
      api_key: cloudinary.key,
      file,
      ...data,
      signature
    }
  }).catch((error) => error);
};


export const deleteCloudinary = async (filename: string, event: H3Event) => {
  const { cloudinary } = useRuntimeConfig(event);

  const data = {
    invalidate: String(true),
    public_id: filename,
    timestamp: Date.now().toString(),
  };

  const toSign = new URLSearchParams(data).toString();
  const signature = hash(toSign + cloudinary.secret);

  await $fetch(`https://api.cloudinary.com/v1_1/${cloudinary.name}/image/destroy`, {
    method: "POST",
    body: {
      api_key: cloudinary.key,
      ...data,
      signature
    }
  }).catch((error) => error);
};
