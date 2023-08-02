import { readFileSync, writeFileSync, readdirSync } from "fs";

export default defineNitroPlugin(() => {
  const path = "./assets/email-templates";
  const templates : { [key: string]: string } = {};
  readdirSync(path).forEach((file) => {
    const name = file.replace(".html", "");
    templates[name] = readFileSync(`${path}/${file}`, "utf8").replace(/\r\n/g, "").replace(/\s+/g, " ");
  });

  const content = readFileSync("./server/utils/mustache.ts", "utf8");
  const write_content = `export const templates = ${JSON.stringify(templates)};`;

  if (content !== write_content) writeFileSync("./server/utils/mustache.ts", write_content, "utf8");
  console.info("Email templates loaded to server.");
});
