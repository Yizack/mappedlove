<script setup lang="ts">
definePageMeta({ middleware: "preload" });

useSeo({
  title: `${SITE.name} | ${t("motto")}`,
  name: `${SITE.name} | ${t("motto")}`,
  description: t("seo_home_description")
});
</script>

<template>
  <main>
    <section class="banner banner-home bg-secondary text-dark py-5">
      <div class="container text-center py-5">
        <h1 class="display-3"><strong>{{ t("motto") }}</strong></h1>
        <p class="display-6 m-0">{{ t("home_description") }}</p>
      </div>
    </section>
    <section class="py-5 bg-body">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 text-center">
            <img src="/images/demos/map-dashboard.jpg" class="img-fluid rounded shadow" width="720" height="405" :alt="t('strip1_title')">
          </div>
          <div class="col-lg-6 m-auto mt-4 mt-lg-auto">
            <h2>{{ t("strip1_title") }}</h2>
            <p>{{ t("strip1_p1") }}</p>
            <p>{{ t("strip1_p2") }}</p>
            <div class="d-flex gap-2 gap-lg-3 flex-wrap mb-3 mb-lg-0">
              <div class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon name="solar:map-point-favourite-bold" size="30px" class="text-primary" />
                  <strong class="small">{{ t("markers") }}</strong>
                </div>
              </div>
              <div class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon name="solar:chat-square-like-bold" size="30px" class="text-primary" />
                  <strong class="small">{{ t("stories") }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-5 bg-body-secondary">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 m-auto">
            <h2>{{ t("strip2_title") }}</h2>
            <p>{{ t("strip2_p1") }}</p>
            <p>{{ t("strip2_p2") }}</p>
            <div class="d-flex gap-2 gap-lg-3 flex-wrap mb-4 mb-lg-0">
              <div v-for="group in groups" :key="group.key" class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon :name="group.icon" size="30px" class="text-primary" />
                  <strong class="small">{{ t(group.key) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <img src="/images/demos/public-map.jpg" class="img-fluid rounded shadow" width="720" height="405" :alt="t('strip2_title')">
          </div>
        </div>
      </div>
    </section>
    <section class="py-5 bg-body">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 text-center">
            <img src="/images/demos/bond.jpg" class="img-fluid rounded shadow" width="720" height="405" :alt="t('strip3_title')">
          </div>
          <div class="col-lg-6 m-auto mt-4 mt-lg-auto">
            <h2>{{ t("strip3_title") }}</h2>
            <p>{{ t("strip3_p1") }}</p>
            <div class="d-flex gap-2 gap-lg-3 flex-wrap mb-3 mb-lg-0">
              <div class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon name="solar:hearts-bold-duotone" size="30px" class="text-primary" />
                  <strong class="small">{{ t("bond") }}</strong>
                </div>
              </div>
              <div class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon name="solar:heart-lock-outline" size="30px" class="text-primary" />
                  <strong class="small">{{ t("anniversary") }}</strong>
                </div>
              </div>
              <div class="text-center">
                <div class="d-flex gap-2 align-items-center border px-3 py-2 shadow-sm rounded-pill bg-body">
                  <Icon name="solar:streets-map-point-bold-duotone" size="30px" class="text-primary" />
                  <strong class="small">{{ t("public_map") }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
