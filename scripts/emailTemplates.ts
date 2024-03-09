import { readFileSync, writeFileSync, readdirSync } from "fs";

const path = "./server/email-templates";
const templates : { [key: string] : string } = {};

for (const file of readdirSync(path)) {
  const name = file.replace(".html", "");
  templates[name] = readFileSync(`${path}/${file}`, "utf8").replace(/\r\n/g, "").replace(/\s+/g, " ");
}

let content;
try {
  content = readFileSync("./server/utils/emails.ts", "utf8");
}
catch {
  content = "";
}

const keys = Object.keys(templates);
const values = Object.values(templates);
let result = "";
for (let i = 0; i < keys.length; i++) {
  result += ` ${keys[i]}: ${JSON.stringify(values[i])}` + (i < keys.length - 1 ? "," : " ");
}

const write_content = `export const templates = {${result}};`;

if (content !== write_content) writeFileSync("./server/utils/emails.ts", write_content, "utf8");
console.info("Email templates loaded to server.");
