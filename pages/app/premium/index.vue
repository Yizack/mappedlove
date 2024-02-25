<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user } = useUserSession();
</script>

<template>
  <main>
    <div class="container">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
        <h2 class="text-center">{{ t("pricing") }}</h2>
        <p class="text-center text-body-secondary">{{ t("available_plans") }}</p>
        <div class="row row-cols-1 row-cols-md-2 text-center">
          <div class="col" v-for="plan in SITE.pricing.plans">
            <div class="card rounded-3 shadow-sm mb-3 mb-lg-0">
              <div class="card-header py-3">
                <h3 class="my-0">{{ t(plan.name) }}</h3>
              </div>
              <div class="card-body">
                <h1 class="card-title pricing-card-title mb-0">${{ plan.price }}<small class="text-body-secondary fw-light">/{{ t("month").slice(0, 2).toLowerCase() }}</small></h1>
                <small class="text-body-secondary">{{ t("price_in_usd") }}</small>
                <ul class="list-unstyled mt-2 mb-4">
                  <li v-for="feature of plan.features">{{ t(feature) }}</li>
                </ul>
                <NuxtLink v-if="!user.bond?.premium && plan.name === 'premium'" to="/app/premium/subscribe" class="w-100 btn btn-lg btn-primary rounded-pill">{{ t("subscribe") }}</NuxtLink>
                <button v-else type="button" class="w-100 btn btn-lg btn-primary rounded-pill" disabled>
                  <span v-if="user.bond?.premium && plan.name === 'free'">{{ t("cancel_to_downgrade") }}</span>
                  <span v-else>{{ t("current_plan") }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
