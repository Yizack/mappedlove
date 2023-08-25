export const SITE = {
  name: "MappedLove",
  host: process.dev ? "http://localhost:5173" : "https://mappedlove.com",
  cdn: process.dev ? "http://localhost:5173" : "https://cdn.mappedlove.com",
  pages: [
    {
      name: "home",
      path: "/"
    },
    {
      name: "about",
      path: "/about"
    },
    {
      name: "try",
      path: "/login",
      button: true
    }
  ]
};
