export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const form = ref({ ...initialState }) as Ref<T>;

  function formReset () {
    form.value = { ...initialState };
  }

  return { form, formReset };
};

export const useModalController = async (id: string, show?: (value: boolean) => void, callback?: () => void) => {
  const { $bootstrap } = useNuxtApp();
  if (show) show(true);
  await sleep(100);
  const element = $bootstrap.showModal(id);
  if (!element) return;
  if (show) {
    if (callback) callback();
    const hideEvent = () => {
      show(false);
      element.removeEventListener("hidden.bs.modal", hideEvent);
    };
    element.addEventListener("hidden.bs.modal", hideEvent);
  }
};

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
    ogImage: options.image || SITE.cover,
    ogImageWidth: options.imageWidth || 750,
    ogImageHeight: options.imageHeight || 375,
    ogImageAlt: options.imageAlt || t("motto"),
    // Twitter
    twitterCard: "summary_large_image",
    // twitterSite: `@${SITE.twitter}`,
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: options.image || SITE.cover
  });

  options.robots = options.robots === undefined ? true : options.robots;
  useHead({
    meta: options.robots ? [] : [{ name: "robots", content: "noindex, nofollow" }],
    link: [
      { rel: "canonical", href: SITE.host + path }
    ]
  });
};
