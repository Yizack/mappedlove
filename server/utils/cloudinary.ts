import type { H3Event } from "h3";

const jsonToQueryString = (json: Record<string, unknown>) => {
  return Object.keys(json).map(key => encodeURIComponent(key) + "=" + json[key]).join("&");
};

const bufferToBase64URI = (buffer: Buffer, type: string | undefined) => {
  return `data:${type || "jpeg"};base64,${buffer.toString("base64")}`;
};

export const uploadToCloudinary = async (event: H3Event, file: File, options: { filename: string, folder: string }) => {
  const { filename, folder } = options;
  if (import.meta.dev) return;
  const { type } = file;
  const time = Date.now();

  const { cloudinary } = useRuntimeConfig(event);

  const data = {
    folder,
    invalidate: true,
    public_id: filename,
    timestamp: time,
    transformation: "c_thumb,h_75,w_75"
  };

  const toSign = jsonToQueryString(data);
  const signature = hash(toSign + cloudinary.secret);

  await $fetch(`https://api.cloudinary.com/v1_1/${cloudinary.name}/image/upload`, {
    method: "POST",
    body: {
      api_key: cloudinary.key,
      file: bufferToBase64URI(Buffer.from(await file.arrayBuffer()), type),
      ...data,
      signature
    }
  }).catch(error => error);
};

export const deleteCloudinary = async (event: H3Event, filepath: string) => {
  const time = Date.now();
  const { cloudinary } = useRuntimeConfig(event);

  const data = {
    invalidate: true,
    public_id: filepath,
    timestamp: time
  };

  const toSign = jsonToQueryString(data).toString();
  const signature = hash(toSign + cloudinary.secret);

  await $fetch(`https://api.cloudinary.com/v1_1/${cloudinary.name}/image/destroy`, {
    method: "POST",
    body: {
      api_key: cloudinary.key,
      ...data,
      signature
    }
  }).catch(error => error);
};
