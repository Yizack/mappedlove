import type { MultiPartData, H3Event } from "h3";

const jsonToQueryString = (json: Record<string, any>) => {
  return Object.keys(json).map((key) => encodeURIComponent(key) + "=" + json[key]).join("&");
};

const bufferToBaase64URI = (buffer: Buffer, type: string | undefined) => {
  return `data:${type || "jpeg"};base64,${buffer.toString("base64")}`;
};

export const uploadToCloudinary = async (file: MultiPartData, filename: string, folder: string, event: H3Event) => {
  if (import.meta.dev) return;
  const { type, data: fileData } = file;
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
      file: bufferToBaase64URI(fileData, type),
      ...data,
      signature
    }
  }).catch((error) => error);
};


export const deleteCloudinary = async (filename: string, event: H3Event) => {
  const time = Date.now();
  const { cloudinary } = useRuntimeConfig(event);

  const data = {
    invalidate: true,
    public_id: filename,
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
  }).catch((error) => error);
};
