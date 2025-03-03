export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    url: z.string()
  }).parse);

  const {
    PhotonImage, SamplingFilter, resize
  } = import.meta.preset === "cloudflare-pages" ? await import("@cf-wasm/photon") : await import("@cf-wasm/photon/node");

  /*
  const body = await readValidatedBody(event, z.object({
    filename: z.string(),
    data: z.string(),
    metadata: z.any().optional()
  }).parse);
*/
  const inputBytes = await fetch(query.url)
    .then(res => res.arrayBuffer())
    .then(buffer => new Uint8Array(buffer));

  const inputImage = PhotonImage.new_from_byteslice(inputBytes);

  const outputImage = resize(
    inputImage,
    inputImage.get_width() * 0.5,
    inputImage.get_height() * 0.5,
    SamplingFilter.Nearest
  );

  const outputBytes = outputImage.get_bytes_jpeg(75);

  inputImage.free();
  outputImage.free();

  return new Response(outputBytes, {
    headers: {
      "Content-Type": "image/jpg"
    }
  });
});
