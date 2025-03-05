// @ts-expect-error no types from html-to-text
import { convert } from "html-to-text";

export const htmlToText = (html: string): string => {
  return convert(html, {
    selectors: [
      { selector: "img", format: "skip" }
    ]
  });
};
