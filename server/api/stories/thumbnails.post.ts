import photonWasmModule from "@cf-wasm/photon/photon.wasm?module";
import ExifReader from "exifreader";
import { PhotonImage, initSync, resize, crop, SamplingFilter, rotate } from "~~/node_modules/@cf-wasm/photon/dist/esm/lib/photon_rs";

export default defineEventHandler(async (event) => {
  const { secure } = useRuntimeConfig(event);
  const secret = event.headers.get("Authorization")?.replace("Bearer ", "");
  if (secure.secret !== secret) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "unauthorized" });

  const body = await readValidatedBody(event, z.object({
    data: z.string(), // base64
    name: z.string(),
    folder: z.string(),
    metadata: z.any().optional()
  }).parse);

  initSync({ module: photonWasmModule });

  const buffer = Buffer.from(body.data, "base64");
  const inputBytes = new Uint8Array(buffer);

  const inputImage = PhotonImage.new_from_byteslice(inputBytes);

  const width = inputImage.get_width();
  const height = inputImage.get_height();

  const squareSize = Math.min(width, height);
  const x1 = Math.floor((width - squareSize) / 2);
  const y1 = Math.floor((height - squareSize) / 2);
  const x2 = x1 + squareSize;
  const y2 = y1 + squareSize;

  let outputImage = crop(inputImage, x1, y1, x2, y2);

  // Extract EXIF data to get orientation
  let orientation = 1; // Default orientation (no rotation)
  try {
    const tags = ExifReader.load(buffer);
    orientation = tags.Orientation ? Number(tags.Orientation.value) : 1;
  }
  catch {
    console.warn("No EXIF data found or error reading it");
  }

  switch (orientation) {
    case 3:
      outputImage = rotate(outputImage, 180);
      break;
    case 6:
      outputImage = rotate(outputImage, 90);
      break;
    case 8:
      outputImage = rotate(outputImage, 270);
      break;
    default:
  }

  outputImage = resize(outputImage, 75, 75, SamplingFilter.Gaussian);

  const outputBytes = outputImage.get_bytes_webp();

  inputImage.free();
  outputImage.free();

  await uploadImage(outputBytes, {
    name: body.name,
    folder: body.folder,
    type: "image/webp",
    customMetadata: body.metadata
  });

  setResponseStatus(event, 201);
  return;
});
