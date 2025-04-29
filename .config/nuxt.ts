import vue from "@vitejs/plugin-vue";
import { SITE } from "../shared/utils/site";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  compatibilityDate: "2024-07-02",
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#c25050" },
        { rel: "preconnect", href: SITE.cdn }
      ],
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "apple-mobile-web-app-title", content: SITE.name },
        { name: "application-name", content: SITE.name },
        { name: "msapplication-TileColor", content: "#ffffff" },
        { name: "theme-color", content: "#c25050" },
        { name: "apple-mobile-web-app-capable", content: SITE.name }
      ]
    }
  },
  css: [
    "~/assets/scss/app.scss"
  ],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/turnstile",
    "nuxt-twemoji",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@dargmuesli/nuxt-cookie-control",
    "nuxt-auth-utils",
    "nuxt-webhook-validators",
    "@nuxthub/core",
    "nuxt-mailchannels"
  ],
  hub: { database: true, blob: true, cache: true },
  icon: {
    mode: "svg",
    clientBundle: { scan: true, sizeLimitKb: 2048 }
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  turnstile: {
    siteKey: "0x4AAAAAAAGmhM7sxmb8brsQ",
    addValidateEndpoint: false
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  cookieControl: {
    isControlButtonEnabled: false,
    locales: ["en", "es"]
  },
  mailchannels: {
    from: {
      email: `support@${SITE.domain}`,
      name: `${SITE.name} Support`
    }
  },
  runtimeConfig: {
    secure: {
      salt: "",
      secret: ""
    },
    turnstile: {
      secretKey: ""
    },
    session: {
      password: ""
    },
    oauth: {
      google: {
        clientId: "",
        clientSecret: ""
      }
    },
    mailchannels: {
      apiKey: "",
      dkim: {
        domain: SITE.domain,
        privateKey: "",
        selector: ""
      }
    },
    paddle: {
      secret: "",
      webhookId: ""
    },
    webhook: {
      paddle: {
        webhookId: process.env.NUXT_PADDLE_WEBHOOK_ID || ""
      }
    },
    public: {
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
      routes: ["/sitemap.xml"]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/docs/*", "/images/*", "/fonts/*"]
        }
      }
    },
    rollupConfig: {
      // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
      plugins: [vue()]
    },
    experimental: {
      tasks: true,
      wasm: true
    }
  },
  sitemap: {
    exclude: ["/app/**"],
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/": { sitemap: { priority: 1 } },
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() } },
    "/api/_nuxt_icon/**": { cache: { maxAge: 1.577e+7 } }
  },
  features: {
    inlineStyles: false
  },
  experimental: {
    typedPages: true,
    // TODO: remove this when `getCachedData` issue is fixed in nuxt
    granularCachedData: false,
    purgeCachedData: false
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ["mixed-decls", "color-functions", "import", "global-builtin"]
        }
      }
    }
  }
});
