import { v2 as cloudinary, ConfigOptions } from "cloudinary";

export const uploadToCloudinary = (url: string, filename: string, config: ConfigOptions) => {
  cloudinary.config({
    cloud_name: config.name,
    api_key: config.key,
    api_secret: config.secret
  });

  cloudinary.uploader.upload(url, { public_id: filename }, (error, result) => {
    console.warn(result);
  });
};
