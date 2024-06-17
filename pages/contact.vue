<script setup lang="ts">
definePageMeta({ layout: "utils" });

useSeo({
  title: `${t("contact")} | ${SITE.name}`,
  name: t("contact"),
  description: t("seo_contact_description")
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <h2>Our emails</h2>
      <p class="mb-4">Please use the appropriate email for your inquiry.</p>
      <div class="row g-3">
        <div class="col-lg-3 text-center">
          <div class="bg-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" :style="{ height: '6rem', width: '6rem' }">
            <Icon name="solar:lightbulb-minimalistic-bold-duotone" class="text-secondary" size="4rem" />
          </div>
          <h4 class="m-0">Support</h4>
          <a :href="`mailto:support@${SITE.domain}`">support@{{ SITE.domain }}</a>
        </div>
        <div class="col-lg-3 text-center">
          <div class="bg-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" :style="{ height: '6rem', width: '6rem' }">
            <Icon name="solar:suitcase-bold-duotone" class="text-secondary" size="4rem" />
          </div>
          <h4 class="m-0">Legal</h4>
          <a :href="`mailto:legal@${SITE.domain}`">legal@{{ SITE.domain }}</a>
        </div>
      </div>
    </div>
  </main>
</template>
