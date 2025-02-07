export default defineNuxtRouteMiddleware(async (to) => {
  const language = to.query.lang as typeof localization["code"];
  if (language) localization.setLanguage(language);
});
