export default defineNuxtRouteMiddleware(async (to, from) => {
  const language = to.query.lang as typeof localization["code"];
  localization.setLanguage(language);

  if (from.query.lang && !language) {
    return navigateTo({ path: to.path, query: { lang: from.query.lang } });
  }
});
