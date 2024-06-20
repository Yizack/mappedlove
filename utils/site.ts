export const SITE = {
  name: "MappedLove",
  author: "Yizack Rangel",
  domain: "mappedlove.com",
  host: "https://mappedlove.com",
  cdn: "https://cdn.mappedlove.com",
  dev: "http://localhost:5173",
  donate: "https://ko-fi.com/yizack",
  cover: "https://mappedlove.com/images/promo-cover.jpg",
  github: {
    author: "Yizack",
    repo: "https://github.com/Yizack/mappedlove"
  },
  pages: {
    main: [
      { name: "home", path: "/" },
      { name: "about_us", path: "/about" },
      { name: "try", path: "/login", button: true }
    ],
    app: [
      { name: "map", path: "/app/map", icon: "solar:streets-map-point-bold-duotone", button: false },
      { name: "bond", path: "/app", icon: "solar:hearts-bold-duotone", button: false }
    ],
    user: [
      { name: "settings", path: "/app/settings" },
      { name: "premium", path: "/app/premium" },
      { name: "billing", path: "/app/premium/billing" },
      { name: "logout", path: "/logout", icon: "solar:exit-linear" }
    ]
  }
};
