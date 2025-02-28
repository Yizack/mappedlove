export const htmlToText = (html: string) => {
  if (!html) return "";

  // Remove doctype, html, head elements and hidden content
  html = html.replace(/<!DOCTYPE[^>]*>/i, "");
  html = html.replace(/<html[^>]*>|<\/html>/gi, "");
  html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
  html = html.replace(/<div[^>]*style="display:none[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  // Handle common HTML entities
  html = html.replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "—")
    .replace(/&bull;/g, "•");

  // Handle links - preserve text and URL
  html = html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (_, url, text) => `${text.trim()} [${url.trim()}]`);

  // Convert strikethrough text
  html = html.replace(/<[^>]+style="text-decoration:line-through;[^"]*"[^>]*>(.*?)<\/[^>]+>/gi, "$1 (tachado)");

  // Handle headings with emphasis
  html = html.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi,
    (_, level, content) => `\n${"-".repeat(4)} ${content.toUpperCase()} ${"-".repeat(4)}\n\n`);

  // Handle lists with proper indentation

  html = html.replace(/<(ul|ol)[^>]*>|<\/(ul|ol)>/gi, "\n");

  // Replace common block elements with line breaks
  html = html.replace(/<(div|p|tr|td|table|br)[^>]*>/gi, "\n");
  html = html.replace(/<\/(div|p|tr|td|table)>/gi, "\n");

  // Handle special content like prices
  html = html.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "*$1*");

  // Remove all remaining HTML tags
  html = html.replace(/<[^>]*>/g, "");

  // Clean up whitespace
  html = html.replace(/\n{4,}/g, "\n\n\n"); // Max 2 consecutive newlines

  // Decode any remaining HTML entities
  html = html.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));

  return html.trim();
};
