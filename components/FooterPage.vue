<template>
  <div class="bg-body-tertiary border-top">
    <div class="container">
      <footer class="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5">
        <div class="col mb-3">
          <NuxtLink class="navbar-brand d-flex align-items-center gap-1 text-body" to="/">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" size="1.3rem" />
            <h4 class="m-0">{{ SITE.name }}</h4>
          </NuxtLink>
          <p class="text-secondary-emphasis mb-0">© {{ new Date().getFullYear() }}, {{ SITE.author }}.</p>
        </div>

        <div class="col mb-3" />

        <div class="col mb-3">
          <h5>{{ t("about") }}</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="/" class="nav-link p-0 text-body-secondary">{{ t("home") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/about" class="nav-link p-0 text-body-secondary">{{ t("about_us") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/pricing" class="nav-link p-0 text-body-secondary">{{ t("pricing") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="#" class="nav-link p-0 text-body-secondary">{{ t("faqs") }}</NuxtLink></li>
          </ul>
        </div>

        <div class="col mb-3">
          <h5>{{ t("help") }}</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="/contact" class="nav-link p-0 text-body-secondary">{{ t("contact") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/terms" class="nav-link p-0 text-body-secondary">{{ t("terms_of_use") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/privacy" class="nav-link p-0 text-body-secondary">{{ t("privacy_policy") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/legal/refund" class="nav-link p-0 text-body-secondary">{{ t("refund_policy") }}</NuxtLink></li>
            <li class="nav-item mb-2"><NuxtLink to="/support" class="nav-link p-0 text-body-secondary">{{ t("support") }}</NuxtLink></li>
          </ul>
        </div>

        <div class="col mb-3">
          <h5>{{ t("contribute") }}</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><NuxtLink to="#" class="nav-link p-0 text-body-secondary">{{ t("donate") }}</NuxtLink></li>
            <li class="nav-item mb-2"><a :href="SITE.github.repo" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("github_repository") }}</a></li>
            <li class="nav-item mb-2"><a :href="`${SITE.github.repo}/issues/new?assignees=${SITE.github.author}&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D`" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("report_bug") }}</a></li>
            <li class="nav-item mb-2"><a :href="`${SITE.github.repo}/issues/new?assignees=${SITE.github.author}&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE%5D`" class="nav-link p-0 text-body-secondary" target="_blank">{{ t("request_feature") }}</a></li>
            <li class="nav-item mb-2"><NuxtLink to="#" class="nav-link p-0 text-body-secondary">{{ t("translate_help") }}</NuxtLink></li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
</template>
