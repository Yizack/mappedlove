<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user, fetch: sessionFetch } = useUserSession() as MappedLoveSessionComposable;

if (!user.value.bond?.id) {
  throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: t("bond_not_found"),
    fatal: true
  });
}

const loading = ref(false);
const paid = ref(false);

const { query } = useRoute("app-premium-subscribe");
const isPtxnValid = ref(false);
if (query._ptxn) loading.value = true;

const { $paddle, $toasts } = useNuxtApp();
const initialized = ref(false);

const checkout = async () => {
  if (user.value.bond?.premium) return;
  $paddle.Checkout({
    customer: {
      email: user.value.email
    },
    customData: {
      userId: user.value.id,
      bondId: user.value.bond?.id ?? "",
      bondCode: user.value.bond?.code ?? ""
    }
  });
};

onMounted(async () => {
  await $paddle.initialize({
    onCompleted: async (data) => {
      loading.value = true;
      if (!data) return;
      isPtxnValid.value = true;
      const subscribe = await $fetch("/api/billing/subscribe", {
        method: "POST",
        body: {
          bondId: user.value.bond?.id,
          transactionId: data.transaction_id
        }
      }).catch(() => null);
      loading.value = false;
      if (!subscribe) return;
      paid.value = true;
      await sessionFetch();
      if (query._ptxn) return;
      $toasts.add({ message: t("subscribed") });
      $paddle.close();
    },
    onError: () => {
      isPtxnValid.value = false;
      loading.value = false;
    }
  });
  initialized.value = true;
});

useSeo({
  title: `${t("subscribe")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <SpinnerCircle v-if="loading" />
          <template v-else-if="query._ptxn">
            <div v-if="isPtxnValid" class="text-center">
              <Icon name="solar:check-circle-bold" class="text-success" size="5rem" />
              <h1>{{ t("transaction_completed") }}!</h1>
              <p class="m-0">{{ t("transaction_completed_info") }}</p>
              <NuxtLink to="/app/premium/billing">{{ t("billing_information") }}</NuxtLink>
            </div>
            <div v-else class="text-center">
              <Icon name="solar:close-circle-bold" class="text-danger" size="5rem" />
              <h1>{{ t("transaction_failed") }}!</h1>
              <p class="m-0">{{ t("error_any") }}</p>
              <NuxtLink to="/app/premium/billing">{{ t("billing_information") }}</NuxtLink>
            </div>
          </template>
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
                    <p class="m-0">${{ SUBSCRIPTION.pricing.plans.premium.price }}<span class="text-body-secondary">/{{ t("month").toLowerCase() }}</span></p>
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
                  <p class="m-0">{{ t("premium_subscription") }}</p>
                  <p class="m-0">${{ SUBSCRIPTION.pricing.plans.premium.price.toFixed(2) }}</p>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                  <p class="m-0">{{ t("pay_now") }}</p>
                  <p class="m-0">${{ SUBSCRIPTION.pricing.plans.premium.price.toFixed(2) }}</p>
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
