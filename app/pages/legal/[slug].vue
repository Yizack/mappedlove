<script setup lang="ts">
import type { MDCParserResult } from "@nuxtjs/mdc";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";

definePageMeta({ layout: "utils" });

const route = useRoute("legal-slug");
const slug = route.params.slug;
const ast = ref<MDCParserResult>();

try {
  const { default: content } = await import(`./${slug}.md?raw`);
  const { data } = await useAsyncData(`md:legal-${slug}`, () => parseMarkdown(content));
  ast.value = data.value;

  useSeo({
    title: `${t(ast.value?.data.title as LocaleKeys)} | ${SITE.name}`,
    name: t(ast.value?.data.title as LocaleKeys),
    description: t(ast.value?.data.description as LocaleKeys)
  });
}
catch {
  throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: `Page not found: ${route.path}`
  });
}

if (slug === "cookies") {
  onMounted(() => {
    const { isModalActive } = useCookieControl();

    const cookieManager = () => {
      isModalActive.value = true;
    };

    const cookieConsentManager = document.querySelector<HTMLAnchorElement>("#cookie-consent-manager");
    if (!cookieConsentManager) return;

    cookieConsentManager.addEventListener("click", cookieManager);
    onUnmounted(() => {
      cookieConsentManager.removeEventListener("click", cookieManager);
    });
  });
}
</script>

<template>
  <main>
    <div v-if="ast" class="col-lg-8 col-xl-9 mx-auto bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
      <MDCRenderer :body="ast.body" :data="ast.data" />
    </div>
  </main>
</template>
