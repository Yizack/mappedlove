<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user } = useUserSession();
</script>

<template>
  <main>
    <div class="container">
      <div class="row row-cols-1 row-cols-md-2 mb-3 text-center">
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm">
            <div class="card-header py-3">
              <h4 class="my-0 fw-normal">Free</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$0<small class="text-body-secondary fw-light">/mo</small></h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>Limited to 10 markers</li>
                <li>Upload images to stories</li>
                <li>2 GB per image upload</li>
                <li>No video uploads</li>
                <li>Share public map</li>
              </ul>
              <button type="button" class="w-100 btn btn-lg btn-primary rounded-pill" disabled>Sign up for free</button>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm border-primary">
            <div class="card-header py-3 text-bg-primary border-primary">
              <h4 class="my-0 fw-normal">Premium</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$2<small class="text-body-secondary fw-light">/mo</small></h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>Unlimited markers</li>
                <li>Upload images and videos to stories</li>
                <li>15 GB per image upload</li>
                <li>50 GB per video upload</li>
                <li>Share public map</li>
              </ul>
              <NuxtLink to="/app/premium/subscribe" class="w-100 btn btn-lg btn-primary rounded-pill">Subscribe</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <h2 class="display-6 text-center mb-4">Compare plans</h2>

      <div class="table-responsive">
        <table class="table text-center">
          <thead>
            <tr>
              <th class="text-start">Features</th>
              <th>Free</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feature, i) of SITE.pricing.features" :key="i">
              <th scope="row" class="text-start">{{ t(feature) }}</th>
              <td><Icon v-if="SITE.pricing.plans.free.features.includes(feature)" class="text-primary" name="bi:check-lg" size="1.3rem" /></td>
              <td><Icon v-if="SITE.pricing.plans.premium.features.includes(feature)" class="text-primary" name="bi:check-lg" size="1.3rem" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
