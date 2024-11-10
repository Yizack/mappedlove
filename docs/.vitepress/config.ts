import { defineConfig, type HeadConfig } from "vitepress";
import { SITE } from "./../../shared/utils/site";
import { sidebar } from "./theme/sidebar";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  outDir: "../public/docs",
  base: "/docs/",
  lang: "en-US",
  title: `${SITE.name} Support`,
  titleTemplate: SITE.name,
  description: "Find all the information you need about MappedLove",
  appearance: {
    // @ts-expect-error not fully supported yet
    initialValue: "light"
  },
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = [];
    const relativePath = pageData.relativePath.replace(/\.md$/, "").replace(/index$/, "");
    const path = relativePath === "index" ? "" : `/${relativePath}`;
    const tags: HeadConfig[] = [
      ["meta", { property: "og:url", content: `${SITE.host}/docs` + path }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: `${pageData.title} | ${SITE.name} Support` }],
      ["meta", { property: "og:description", content: "Find all the information you need about MappedLove" }],
      ["meta", { property: "og:image", content: SITE.cover }],
      ["meta", { property: "og:image:width", content: "750" }],
      ["meta", { property: "og:image:height", content: "375" }],
      ["meta", { property: "og:image:alt", content: "Mapping your love story" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: `${pageData.title} | ${SITE.name} Support` }],
      ["meta", { name: "twitter:image", content: SITE.cover }],
      ["link", { rel: "canonical", href: `${SITE.host}/docs` + path }]
    ];
    head.push(...tags);
    return head;
  },
  head: [
    ["meta", { name: "robots", content: "index, follow" }],
    ["meta", { name: "theme-color", content: "#c25050" }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    resolve: {
      alias: {
        "~": "./app"
      }
    }
  },
  themeConfig: {
    nav: [
      { text: SITE.domain, link: SITE.host }
    ],
    sidebar,
    socialLinks: [
      { icon: "github", link: SITE.github.repo }
    ],
    editLink: {
      pattern: `${SITE.github.repo}/edit/main/docs/:path`,
      text: "Edit this page on GitHub"
    },
    search: {
      provider: "local"
    }
  }
});
