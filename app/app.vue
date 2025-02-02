<script setup lang="ts">
import type { Locale } from "#cookie-control/types";

const locale = t("lang_code") as Locale;
const { moduleOptions } = useCookieControl();
moduleOptions.localeTexts[locale]!.bannerDescription = t("cookies_banner_description");
moduleOptions.cookies.necessary = [{
  id: "n",
  name: t("cookies_necessary_title"),
  description: t("cookies_necessary_description"),
  targetCookieIds: ["nuxt-session", "nuxt-color-mode"],
  links: {
    "/legal/cookies": t("cookie_policy"),
    "/legal/privacy": t("privacy_policy"),
    "/legal/terms": t("terms_of_use")
  }
}];

setScrollBehavior();

const { $bootstrap, $toasts } = useNuxtApp();

onBeforeMount(() => {
  // eslint-disable-next-line no-global-assign
  $fetch = $fetch.create({
    onResponseError: ({ response }) => {
      const message = response.status === 500 ? t("error_any") : t(response._data.message);
      $toasts.add({ message, success: false });
    }
  });

  $bootstrap.hideModalEscEvent();
});

useSeo({
  title: SITE.name,
  name: SITE.name,
  description: t("seo_home_description")
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastsController />
    <ClientOnly>
      <CookieControl :locale="locale" />
    </ClientOnly>
  </div>
</template>
