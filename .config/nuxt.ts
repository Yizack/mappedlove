import icons from "./icons";
import { SITE } from "../shared/utils/site";

export default defineNuxtConfig({
  // future: { compatibilityVersion: 4 },
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
    "nuxt-mailchannels",
    "@nuxtjs/mdc",
    "nuxt-email-renderer",
    "@nuxt/test-utils"
  ],
  $env: {
    test: {
      test: true,
      hub: { dir: ".data/test" }
    }
  },
  $production: {
    nitro: {
      preset: "cloudflare-module"
    }
  },
  devtools: { enabled: true },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
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
  site: {
    url: SITE.host
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  mdc: {
    components: {
      prose: false,
      map: {
        h2: "ProseH2",
        table: "ProseTable"
      }
    },
    remarkPlugins: {
      "remark-emoji": false
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
      secret: ""
    },
    webhook: {
      paddle: {
        webhookId: ""
      }
    },
    public: {
      paddle: {
        clientId: "",
        planId: ""
      }
    }
  },
  routeRules: {
    "/api/_nuxt_icon/**": { cache: { maxAge: 1.577e+7 } }
  },
  features: {
    inlineStyles: false
  },
  experimental: {
    typedPages: true
  },
  compatibilityDate: "2025-07-16",
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
    experimental: {
      tasks: true,
      wasm: true
    }
  },
  hub: {
    db: {
      dialect: "sqlite",
      casing: "snake_case"
    },
    blob: true,
    cache: true
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["color-functions", "import", "global-builtin", "if-function"]
        }
      }
    }
  },
  typescript: {
    tsConfig: {
      include: [
        "../emails/**/*"
      ]
    },
    nodeTsConfig: {
      include: [
        "../test/**/*",
        "../shared/**/*.d.ts"
      ]
    }
  },
  cookieControl: {
    isControlButtonEnabled: false,
    locales: ["en", "es"]
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: { icons }
  },
  mailchannels: {
    from: {
      email: `support@${SITE.domain}`,
      name: `${SITE.name} Support`
    }
  },
  sitemap: {
    exclude: ["/app/**"],
    defaults: { priority: 0.8, lastmod: new Date().toISOString() },
    urls: [
      { loc: "/", priority: 1.0 }
    ],
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ],
    zeroRuntime: true
  },
  turnstile: {
    siteKey: "0x4AAAAAAAGmhM7sxmb8brsQ",
    addValidateEndpoint: false
  },
  twemoji: {
    mode: "png"
  }
});
