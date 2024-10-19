export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const data = ref<T>({ ...initialState });
  const methods = {
    /**
     * Reset all fields or specific fields
     * @param fields
     */
    reset (...fields: (keyof T)[]) {
      if (!fields.length) {
        data.value = { ...initialState };
        return;
      }
      for (const field of fields) {
        data.value[field] = initialState[field];
      }
    }
  };
  Object.assign(data, methods);
  return data as Ref<T> & typeof methods;
};

export const useModalController = (id: string) => {
  const { $bootstrap } = useNuxtApp();
  return ref({
    isVisible: false,
    show: async function (callback?: () => void) {
      if (!this.isVisible) this.isVisible = true;
      await sleep(100);
      const element = $bootstrap.showModal(id);
      if (!element) return;
      if (this.isVisible) {
        if (typeof callback === "function") callback();
        const hideEvent = () => {
          this.isVisible = false;
        };
        element.addEventListener("hidden.bs.modal", hideEvent, { once: true });
      }
    },
    hide: () => $bootstrap.hideModal(id)
  });
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
