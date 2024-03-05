export const SITE = {
  name: "MappedLove",
  author: "Yizack Rangel",
  host: "https://mappedlove.com",
  cdn: "https://cdn.mappedlove.com",
  dev: "http://localhost:5173",
  pages: {
    main: [
      { name: "home", path: "/" },
      { name: "about", path: "/about"},
      { name: "try", path: "/login", button: true }
    ],
    app: [
      { name: "map", path: "/app/map", icon: "solar:streets-map-point-bold-duotone", button: false },
      { name: "bond", path: "/app", icon: "solar:hearts-bold-duotone", button: false }
    ],
    user: [
      { name: "settings", path: "/app/settings" },
      { name: "premium", path: "/app/premium" },
      { name: "logout", path: "/logout", icon: "solar:exit-linear" }
    ]
  },
  pricing: {
    plans: {
      free: {
        name: "free",
        price: 0,
        features: [
          "share_public_map",
          "free_markers_quota",
          "free_image_upload_quota",
          "free_summary",
          "email_support"
        ],
      },
      premium: {
        name: "premium",
        price: 2,
        features: [
          "share_public_map",
          "premium_markers_quota",
          "premium_image_upload_quota",
          "premium_summary",
          "email_support"
        ]
      }
    }
  }
};
