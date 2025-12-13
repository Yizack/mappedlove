import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const targetFile = join(process.cwd(), "node_modules/@nuxthub/core/dist/module.mjs");
let content = await readFile(targetFile, "utf8");

const drizzleConfigRegex = /drizzle\s*\(\s*(?:([a-zA-Z0-9_$]+)\s*,\s*)?(\{[\s\S]*?schema[\s\S]*?\})(\s*\))/gm;

let patched = false;
content = content.replace(drizzleConfigRegex, (match, firstArg, configObj, closingParen) => {
  if (configObj.includes("casing:")) return match;
  patched = true;
  const patchedConfig = configObj.replace(/}$/, ", casing: 'snake_case' }");
  if (firstArg) {
    return `drizzle(${firstArg}, ${patchedConfig}${closingParen}`;
  }
  else {
    return `drizzle(${patchedConfig}${closingParen}`;
  }
});

if (patched) {
  await writeFile(targetFile, content, "utf8");
  console.info("Patched all drizzle configs with casing: 'snake_case'");
}
else {
  console.info("Patch already applied or drizzle configs not found.");
}
