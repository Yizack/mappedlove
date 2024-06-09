import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  outDir: "../public/docs",
  base: "/docs/",
  lang: "en-US",
  title: "MappedLove Docs",
  description: "Find all the information you need about MappedLove",
  cleanUrls: true,
  themeConfig: {
    nav: [

    ],
    sidebar: [
      {
        text: "Troubleshooting",
        collapsed: false,
        items: [
          {
            text: "Technical Support",
            items: [
              { text: "I want to report a bug", link: "/troubleshooting/bug-report" },
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
              { text: "Create an account", link: "/using-the-app/sign-up" },
              { text: "Change password", link: "/using-the-app/change-password" },
            ]
          },
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
