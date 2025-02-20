export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession();
  const languageFromQuery = to.query.lang?.toString().toLowerCase() as MappedLoveLocales;
  const languageFromUser = user.value?.language;

  if (languageFromQuery) {
    localization.setLanguage(languageFromQuery);
  }
  else {
    localization.setLanguage(languageFromUser);
  }

  if (from.query.lang && !languageFromQuery) {
    return navigateTo({ path: to.path, query: { lang: from.query.lang } });
  }
});
