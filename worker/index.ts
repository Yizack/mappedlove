import type { ImagesBinding, ReadableStream } from "@cloudflare/workers-types";

export interface Env {
  IMAGES: ImagesBinding;
  MAPPEDLOVE_SECRET: string;
}

export default {
  async fetch (request: Request, env: Env) {
    if (request.method !== "POST")
      return new Response("Only POST requests are allowed", { status: 405 });

    if (env.MAPPEDLOVE_SECRET !== request.headers.get("x-mappedlove-secret"))
      return new Response("Unauthorized", { status: 401 });

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data"))
      return new Response("Invalid content type", { status: 400 });

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File))
      return new Response("No image provided", { status: 400 });

    const stream = file.stream() as ReadableStream<Uint8Array>;

    const imageBinding = await env.IMAGES.input(stream)
      .transform({
        fit: "cover",
        height: 75,
        width: 75
      })
      .output({
        format: "image/webp"
      });

    return imageBinding.response();
  }
};
