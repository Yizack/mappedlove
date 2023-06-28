export default {
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "",
      htmlAttrs: {
        lang: "en"
      },
      bodyAttrs: {
        "data-bs-theme": "light"
      },
      meta: [
        { name: "robots", content: "index, follow" }
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
    encryption: {
      salt: ""
    },
    turnstile: {
      secretKey: ""
    },
    session: {
      name: "nuxt-session",
      password: ""
    }
  }
};
