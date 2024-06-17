import { defineConfig } from "vitepress";
import { SITE } from "./../../utils/site";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  outDir: "../public/docs",
  base: "/docs/",
  lang: "en-US",
  title:  `${SITE.name} Support`,
  titleTemplate: SITE.name,
  description: "Find all the information you need about MappedLove",
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    resolve: {
      alias: {
        "~": "."
      }
    }
  },
  themeConfig: {
    nav: [
      { text: SITE.domain, link: SITE.host },
    ],
    sidebar: [
      {
        text: "Troubleshooting",
        collapsed: false,
        items: [
          {
            text: "Technical Support",
            items: [
              { text: "🚩 I want to report a bug", link: "/support/bug-report" },
            ]
          }
        ]
      },
      {
        text: "Using the App",
        collapsed: false,
        items: [
          {
            text: "Account",
            items: [
              { text: "😎 Create an account", link: "/account/sign-up" },
              { text: "🗝️ Change password", link: "/account/change-password" },
              { text: "💟 Link our accounts", link: "/account/link-accounts" }
            ]
          },
          {
            text: "Mapping",
            items: [
              { text: "📍 Add markers", link: "/mapping/add-markers" },
              { text: "📝 Add stories", link: "/mapping/add-stories" },
              { text: "🗺️ Share our map", link: "/mapping/share-our-map" }
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Yizack/mappedlove" }
    ],
    editLink: {
      pattern: "https://github.com/Yizack/mappedlove/edit/main/docs/:path",
      text: "Edit this page on GitHub"
    },
    search: {
      provider: "local"
    }
  }
});
