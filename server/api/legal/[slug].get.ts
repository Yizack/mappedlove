import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { parseMarkdown } from "comark";

export default defineEventHandler(async (event) => {
  if (!import.meta.dev && !import.meta.prerender) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "Page not found"
    });
  }

  const slug = getRouterParam(event, "slug");
  const filePath = join(process.cwd(), "content", "legal", `${slug}.md`);
  try {
    const content = await readFile(filePath, "utf-8");
    return parseMarkdown(content);
  }
  catch {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: `Content not found: ${slug}`
    });
  }
});
