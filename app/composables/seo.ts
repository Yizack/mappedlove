export const useSeo = (options: MappedLoveSeoOptions) => {
  const path = useRoute().path.replace(/\/$/, "");
  useSeoMeta({
    title: options.title,
    description: options.description,
    // Open Graph
    ogUrl: SITE.host + path,
    ogType: "website",
    ogTitle: options.title,
    ogSiteName: options.name,
    ogDescription: options.description,
    ogImage: options.image || `${SITE.host}/${SITE.cover}`,
    ogImageWidth: options.imageWidth || 750,
    ogImageHeight: options.imageHeight || 375,
    ogImageAlt: options.imageAlt || t("motto"),
    // Twitter
    twitterCard: "summary_large_image",
    // twitterSite: `@${SITE.twitter}`,
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: options.image || `${SITE.host}/${SITE.cover}`
  });

  options.robots = options.robots === undefined ? true : options.robots;
  useHead({
    meta: options.robots ? [] : [{ name: "robots", content: "noindex, nofollow" }],
    link: [
      { rel: "canonical", href: SITE.host + path },
      { rel: "alternate", hreflang: "x-default", href: SITE.host + path },
      ...localization.getLocales().map(locale => ({
        rel: "alternate",
        hreflang: locale.code,
        href: SITE.host + (path || "/") + `?lang=${locale.code}`
      }))
    ]
  });
};
