<script setup lang="ts">
import type { MarkdownDocument } from "comark";

definePageMeta({ layout: "utils" });

const route = useRoute("legal-slug");
const slug = route.params.slug;

const { data: md } = await useFetch<MarkdownDocument>(`/api/legal/${slug}`);

if (!md.value) {
  throw createError({
    status: ErrorCode.NOT_FOUND,
    message: `Page not found: ${route.path}`
  });
}

useSeo({
  title: `${t(md.value?.frontmatter.title)} | ${SITE.name}`,
  name: t(md.value?.frontmatter.title),
  description: t(md.value?.frontmatter.description)
});

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
    <div v-if="md" class="col-lg-8 col-xl-9 mx-auto bg-body rounded-3 p-4 p-lg-5 mb-2">
      <MarkdownDocument :value="md" />
    </div>
  </main>
</template>
