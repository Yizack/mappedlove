<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user, fetch: sessionFetch } = useUserSession();

if (!user.value.bond?.id) {
  throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: t("bond_not_found"),
    fatal: true
  });
}

const loading = ref(false);
const paid = ref(false);

const { $paddle, $toasts } = useNuxtApp();
const initialized = ref(false);

const checkout = async () => {
  if (user.value.bond?.premium) return;
  $paddle.Checkout({
    bondId: user.value.bond?.id ?? "",
    bondCode: user.value.bond?.code ?? "",
  });
};

onMounted(() => {
  const paddle = $paddle.initialize({
    onCompleted: async (data) => {
      if (!data) return;
      paid.value = true;
      loading.value = true;
      const subscribe = await $fetch("/api/bond/subscribe", {
        method: "POST",
        body: {
          bondId: user.value.bond?.id,
          transactionId: data.transaction_id
        }
      });
      loading.value = false;
      if (!subscribe) return;
      await sessionFetch();
      $toasts.add({ message: t("subscribed"), success: true });
      $paddle.close();
      return;
    }
  });
  if (!paddle) return;
  initialized.value = true;
});
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <SpinnerCircle v-if="loading" />
          <template v-else-if="user.bond?.premium">
            <div class="text-center">
              <Icon name="solar:check-circle-bold" class="text-success" size="5rem" />
              <h1>{{ t("subscribed") }}!</h1>
              <p class="m-0">{{ t("subscribed_info") }}</p>
              <NuxtLink to="/app">{{ t("subscribed_start") }}</NuxtLink>
            </div>
          </template>
          <template v-else-if="!paid">
            <h2 class="mb-4 text-center">{{ t("complete_subscription") }}</h2>
            <div class="mb-4">
              <h4 class="d-flex align-items-center gap-1">
                <Icon class="text-primary" name="solar:map-point-favourite-bold" />
                {{ SITE.name }}: {{ t("premium") }}
              </h4>
              <div class="row row-gap-2">
                <div class="col-lg-6">
                  <div class="bg-body-secondary p-3 rounded border" role="button">
                    <div class="d-flex justify-content-between gap-2">
                      <strong>{{ t("bill_monthly") }}</strong>
                    </div>
                    <p class="m-0">${{ SITE.pricing.plans.premium.price }}<span class="text-body-secondary">/{{ t("month").toLowerCase() }}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <h4>{{ t("subscription_details") }}</h4>
              <p class="text-body-secondary">{{ t("subscription_description") }}</p>
              <div class="border p-3 rounded">
                <div class="row row-cols-1 row-cols-md-2">
                  <div class="col">
                    <div class="mb-3">
                      <label class="form-label">{{ t("bond_id") }}</label>
                      <input type="text" class="form-control" :value="user.bond?.id" readonly>
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-3">
                      <label class="form-label">{{ t("bond_code") }}</label>
                      <input type="text" class="form-control" :value="user.bond?.code" readonly>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4>{{ t("order_summary") }}</h4>
              <div class="border p-3 rounded">
                <div class="d-flex justify-content-between">
                  <p>{{ t("premium_subscription") }}</p>
                  <p>${{ SITE.pricing.plans.premium.price.toFixed(2) }}</p>
                </div>
                <div v-if="!user.bond?.nextPayment" class="d-flex justify-content-between">
                  <p>{{ t("free_trial") }}</p>
                  <p>$0.00</p>
                </div>
                <div v-if="!user.bond?.nextPayment" class="d-flex justify-content-between">
                  <p class="m-0">{{ t("payment_after_trial") }}</p>
                  <p class="m-0">${{ SITE.pricing.plans.premium.price.toFixed(2) }}</p>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="m-0">{{ t("pay_now") }}</p>
                  <p v-if="!user.bond?.nextPayment" class="m-0">$0.00</p>
                  <p v-else class="m-0">${{ SITE.pricing.plans.premium.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <hr>
            <div>
              <h4>{{ t("payment") }}</h4>
              <p class="text-body-secondary">{{ t("payment_description") }}</p>
              <div class="d-grid">
                <button class="btn btn-lg btn-primary rounded-pill" type="button" :disabled="!initialized" @click="checkout">
                  <Transition name="tab" mode="out-in">
                    <span v-if="initialized">{{ t("checkout") }}</span>
                    <SpinnerCircle v-else class="text-white" />
                  </Transition>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>
