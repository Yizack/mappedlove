import { SITE } from "./utils/site";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      bodyAttrs: {
        "data-bs-theme": "light"
      },
      link: [
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#ff6969" },
        { rel: "preconnect", href: SITE.cdn },
        { rel: "prefetch", href: SITE.cdn },
      ],
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#ff6969" },
        { name: "apple-mobile-web-app-title", content: SITE.name },
        { name: "application-name", content: SITE.name },
        { name: "msapplication-TileColor", content: "#ff6969" },
        { name: "theme-color", content: "#ffffff" },
        { name: "apple-mobile-web-app-capable", content: SITE.name },
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "leaflet/dist/leaflet.css",
    "~/assets/css/main.css",
    "~/assets/css/theme-light.css",
    "~/assets/css/theme-dark.css",
    "~/assets/css/transitions.css",
    "~/assets/css/backgrounds.css",
    "~/assets/css/buttons.css",
    "~/assets/css/navbar.css",
    "~/assets/css/form.css",
    "~/assets/css/markers.css"
  ],
  modules: [
    "nuxt-icon",
    "@nuxtjs/turnstile",
    "nuxt-twemoji"
  ],
  turnstile: {
    siteKey: "0x4AAAAAAAGmhM7sxmb8brsQ",
    addValidateEndpoint: true
  },
  runtimeConfig: {
    secure: {
      salt: ""
    },
    turnstile: {
      secretKey: ""
    },
    session: {
      name: "nuxt-session",
      password: ""
    },
    mail: {
      from: "",
      fromName: "",
      host: "",
      port: "",
      login: "",
      password: "",
    }
  },
  experimental: {
    inlineSSRStyles: false
  },
  nitro: {
    preset: "cloudflare-pages"
  }
});
