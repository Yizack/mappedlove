<template>
  <div class="bg-body-tertiary border-top">
    <div class="container">
      <footer class="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5">
        <div class="col mb-3">
          <NuxtLink class="navbar-brand d-flex align-items-center gap-1 text-body" to="/">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" size="1.3rem" />
            <p class="m-0 h4">{{ SITE.name }}</p>
          </NuxtLink>
          <p class="text-secondary-emphasis mb-0">© {{ new Date().getFullYear() }}, {{ SITE.author }}.</p>
        </div>

        <div class="col mb-3">
          <p class="h5">{{ t("about_us") }}</p>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="/" class="nav-link p-0 text-body-secondary">{{ t("home") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/about" class="nav-link p-0 text-body-secondary">{{ t("about_us") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/pricing" class="nav-link p-0 text-body-secondary">{{ t("pricing") }}</NuxtLink></li>
          </ul>
        </div>

        <div class="col mb-3">
          <p class="h5">{{ t("help") }}</p>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="/contact" class="nav-link p-0 text-body-secondary">{{ t("contact") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/docs" external class="nav-link p-0 text-body-secondary">{{ t("support") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/account-data" class="nav-link p-0 text-body-secondary">{{ t("account_data") }}</NuxtLink></li>
          </ul>
        </div>

        <div class="col mb-3">
          <p class="h5">{{ t("legal") }}</p>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="/legal/terms" class="nav-link p-0 text-body-secondary">{{ t("terms_of_use") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/privacy" class="nav-link p-0 text-body-secondary">{{ t("privacy_policy") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/refund" class="nav-link p-0 text-body-secondary">{{ t("refund_policy") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/cookies" class="nav-link p-0 text-body-secondary">{{ t("cookie_policy") }}</NuxtLink></li>
          </ul>
        </div>

        <div class="col mb-3">
          <p class="h5">{{ t("contribute") }}</p>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink :to="SITE.donate" class="nav-link p-0 text-body-secondary">{{ t("donate") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink :to="SITE.github.repo" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("github_repository") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink :to="`${SITE.github.repo}/issues/new?assignees=${SITE.github.author}&labels=bug&projects=&template=1-bug_report.yml`" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("report_bug") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink :to="`${SITE.github.repo}/issues/new?assignees=${SITE.github.author}&labels=enhancement&projects=&template=2-feature_request.yml`" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("request_feature") }}</NuxtLink></li>
            <!-- <li class="nav-item mb-2"><NuxtLink to="#" class="nav-link p-0 text-body-secondary">{{ t("translate_help") }}</NuxtLink></li> -->
          </ul>
        </div>
      </footer>
    </div>
  </div>
</template>
