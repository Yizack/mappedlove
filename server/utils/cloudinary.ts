import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { SITE } from "../../utils/site";

export const uploadToCloudinary = (filename: string, config: ConfigOptions) => {
  const uploadedUrl = process.dev ? `public/uploads/${filename}` : `${SITE.cdn}/uploads/${filename}`;
  cloudinary.config({
    cloud_name: config.name,
    api_key: config.key,
    api_secret: config.secret
  });

  cloudinary.uploader.upload(uploadedUrl, { public_id: filename }, (error, result) => {
    console.warn(result);
  });
};
