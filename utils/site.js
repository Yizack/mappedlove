export const SITE = {
  name: "MappedLove",
  cdn: process.dev ? "http://localhost:5173" : "https://cdn.mappedlove.com",
  pages: [
    {
      name: t("home"),
      path: "/"
    },
    {
      name: t("about"),
      path: "/about"
    },
    {
      name: t("try"),
      path: "/login",
      button: true
    }
  ]
};
