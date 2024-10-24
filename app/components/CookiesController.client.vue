<script setup lang="ts">
import type { Locale } from "#cookie-control/types";

const { moduleOptions } = useCookieControl();
const locale = t("lang_code") as Locale;

moduleOptions.localeTexts = {
  [locale]: {
    accept: t("accept"),
    acceptAll: t("accept_all"),
    bannerDescription: t("cookies_banner_description"),
    bannerTitle: "Cookies",
    close: t("close"),
    cookiesNecessary: t("cookies_necessary"),
    cookiesOptional: t("cookies_optional"),
    decline: t("decline"),
    declineAll: t("decline_all"),
    here: t("here"),
    manageCookies: t("cookies_learn_more"),
    save: t("save"),
    settingsUnsaved: t("settings_unsaved")
  }
};

moduleOptions.cookies.necessary[0]!.name = t("cookies_necessary_title");
moduleOptions.cookies.necessary[0]!.description = t("cookies_necessary_description");
moduleOptions.cookies.necessary[0]!.links = {
  "/legal/cookies": t("cookie_policy"),
  "/legal/privacy": t("privacy_policy"),
  "/legal/terms": t("terms_of_use")
};
</script>

<template>
  <CookieControl :locale="locale" />
</template>
