import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

// Find the file using glob pattern to handle the hash in the path
const pattern = "node_modules/.pnpm/@nuxt+test-utils@3.19.2_*/node_modules/@nuxt/test-utils/dist/shared/test-utils.CT3RJOY3.mjs";
const files = await glob(pattern);

if (files.length === 0) {
  console.info("⚠️ Test utils file not found, skipping patch");
  process.exit(0);
}

const filePath = files[0];
let content = readFileSync(filePath, "utf8");

const newReplace = "existsSync(resolve(dir, \"nuxt.config.ts\"))) || existsSync(resolve(dir, \".config\", \"nuxt.ts\"));";
const originalReplace = "existsSync(resolve(dir, \"nuxt.config.ts\")));";

if (content.includes(originalReplace)) {
  content = content.replace(originalReplace, newReplace);
  writeFileSync(filePath, content, "utf8");
  console.info("✅ Successfully patched @nuxt/test-utils");
}
else {
  console.info("⚠️ Function already patched or not found");
}
