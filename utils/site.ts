export const SITE = {
  name: "MappedLove",
  host: process.dev ? "http://localhost:5173" : "https://mappedlove.com",
  cdn: process.dev ? "http://localhost:5173" : "https://cdn.mappedlove.com",
  pages: {
    main: [
      { name: "home", path: "/" },
      { name: "about", path: "/about"},
      { name: "try", path: "/login", button: true }
    ],
    app: [
      { name: "bond", path: "/app", icon: "solar:hearts-bold-duotone", button: false },
      { name: "map", path: "/app/map", icon: "solar:streets-map-point-bold-duotone", button: false }
    ]
  }
};
