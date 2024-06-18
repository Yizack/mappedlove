import { SITE } from "../utils/site";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [
        { rel: "preload", href: "/fonts/Fredoka-Regular.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/Fredoka-Medium.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/Fredoka-SemiBold.ttf", as: "font", type: "font/ttf", crossorigin: "anonymous" },
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
    "@vuepic/vue-datepicker/dist/main.css",
    "~/assets/css/main.css",
    "~/assets/css/theme-light.css",
    "~/assets/css/theme-dark.css",
    "~/assets/css/transitions.css",
    "~/assets/css/backgrounds.css",
    "~/assets/css/buttons.css",
    "~/assets/css/navbar.css",
    "~/assets/css/form.css",
    "~/assets/css/markers.css",
    "~/assets/css/leaflet.css",
    "~/assets/css/map.css"
  ],
  modules: [
    "@nuxt/eslint",
    "nuxt-icon",
    "@nuxtjs/turnstile",
    "nuxt-twemoji",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@dargmuesli/nuxt-cookie-control",
    "nuxt-auth-utils"
  ],
  eslint: {
    config: {
      autoInit: false
    }
  },
  turnstile: {
    siteKey: "0x4AAAAAAAGmhM7sxmb8brsQ",
    addValidateEndpoint: true
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  cookieControl: {
    isControlButtonEnabled: false,
    cookies: {
      necessary: [{
        id: "n",
        name: "cookies_necessary_title",
        targetCookieIds: ["nuxt-session", "nuxt-color-mode", "iconify-count", "iconify-version"]
      }],
      optional: []
    }
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
      dkimKey: "",
      dkimSelector: ""
    },
    cloudinary: {
      name: "",
      key: "",
      secret: ""
    },
    paypal: {
      secret: "",
      webhookId: ""
    },
    paddle: {
      secret: "",
      webhookId: ""
    },
    public: {
      paypal: {
        clientId: process.env.NUXT_PAYPAL_CLIENT_ID || "",
        planId: process.env.NUXT_PAYPAL_PLAN_ID || ""
      },
      paddle: {
        clientId: process.env.NUXT_PADDLE_CLIENT_ID || "",
        planId: process.env.NUXT_PADDLE_PLAN_ID || ""
      }
    }
  },
  site: {
    url: SITE.host
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml"],
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/docs/*"]
        }
      }
    }
  },
  sitemap: {
    dynamicUrlsApiEndpoint: "/__sitemap",
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/": { sitemap: { priority: 1 } },
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() } },
    "/app/**": { index: false }
  },
  features: {
    inlineStyles: false
  }
});
