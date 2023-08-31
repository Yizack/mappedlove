import { v2 as cloudinary } from "cloudinary";
import type { H3Event } from "h3";

export const uploadToCloudinary = (filename: string, event: H3Event) => {
  const { cloudinary: config } = useRuntimeConfig(event);
  const uploadedUrl = process.dev ? `public/uploads/${filename}` : `${SITE.cdn}/uploads/${filename}`;
  cloudinary.config({
    cloud_name: config.name,
    api_key: config.key,
    api_secret: config.secret
  });
  const response = cloudinary.uploader.upload(uploadedUrl, { public_id: filename, invalidate: true }, (error, result) => {
    console.warn(result);
  });
  return response;
};

export const deleteCloudinary = (filename: string, event: H3Event) => {
  const { cloudinary: config } = useRuntimeConfig(event);
  cloudinary.config({
    cloud_name: config.name,
    api_key: config.key,
    api_secret: config.secret
  });
  cloudinary.uploader.destroy(filename, { invalidate: true } , (error, result) => {
    console.warn(result);
  });
};
