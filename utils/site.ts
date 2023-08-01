export const SITE = {
  name: "MappedLove",
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
