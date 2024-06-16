<script setup lang="ts">
definePageMeta({ layout: "utils" });

useSeo({
  title: `${t("about_us")} | ${SITE.name}`,
  name: t("about_us"),
  description: t("seo_about_description"),
  path: "/about",
});
</script>

<template>
  <UnderConstruction />
</template>
