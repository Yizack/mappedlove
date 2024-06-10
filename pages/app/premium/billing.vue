<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { user } = useUserSession();
const isValidSubscription = computed(() => Boolean(user.value.bond?.subscriptionId));
const isPremium = computed(() => Boolean(user.value.bond?.premium));

const { data: billing } = await useFetch(`/api/billing/${user.value.bond?.subscriptionId}`, {
  immediate: isValidSubscription.value,
  default: () => ({
    subscription: null,
    transactions: []
  })
});

if (!billing.value) {
  throw createError({
    statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: t("error"),
    fatal: true
  });
}
</script>

<template>
  <div class="row">
    <div class="col-lg-8 col-xl-6 mx-auto">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
        <h3>{{ t("billing_information") }}</h3>
        <p>{{ t("billing_info") }}</p>
        <div class="border rounded p-4 mb-2">
          <div class="row row-gap-3">
            <div class="col-lg-6">
              <h5>{{ t("plan") }}</h5>
              <p v-if="isPremium" class="mb-0">{{ SITE.name }} {{ t(SUBSCRIPTION.pricing.plans.premium.name) }}</p>
              <p v-else class="mb-0">{{ SITE.name }} {{ t(SUBSCRIPTION.pricing.plans.free.name) }}</p>
            </div>
            <div v-if="isPremium && billing.subscription" class="col-lg-6">
              <h5>{{ t("status") }}</h5>
              <p v-if="billing.subscription.scheduled_change?.action === 'cancel'" class="mb-0">
                <span class="badge border rounded-pill bg-secondary text-primary border-primary">
                  {{ t("canceled") }}
                </span>
              </p>
              <p v-else class="mb-0"><span :class="`badge border rounded-pill ${billing.subscription?.status === 'active' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'}`">{{ t(billing.subscription.status) }}</span>
              </p>
            </div>
            <div v-if="isPremium && billing.subscription" class="col-lg-6">
              <h5>{{ t("subscription") }}</h5>
              <p class="mb-0">{{ billing.subscription.id }}</p>
            </div>
            <div v-if="isPremium" class="col-lg-6">
              <h5>{{ t("amount") }}</h5>
              <p class="mb-0">${{ SUBSCRIPTION.pricing.plans.premium.price }} / {{ t("month") }}</p>
            </div>
            <div class="col-lg-6">
              <h5>{{ t("bond") }}</h5>
              <p class="mb-0">{{ user.bond?.code }}</p>
            </div>
            <div v-if="isPremium && billing.subscription?.current_billing_period" class="col-lg-6">
              <h5 v-if="billing.subscription.scheduled_change?.action === 'cancel'">{{t("until") }}</h5>
              <h5 v-else>{{ t("next_payment") }}</h5>
              <p class="mb-0">{{ billing.subscription.current_billing_period.ends_at ? formatDate(new Date(billing.subscription.current_billing_period.ends_at).getTime(), true) : null }}</p>
            </div>
          </div>
        </div>
        <template v-if="isPremium">
          <div v-if="isValidSubscription && !billing.subscription?.is_manageable" class="d-flex gap-2 align-items-center">
            <Icon name="solar:info-circle-bold" />
            <p class="mb-0"><strong>{{ t("billing_manageable") }}</strong></p>
          </div>
          <div v-else-if="billing.subscription?.scheduled_change?.action === 'cancel'" class="text-center">
            <a class="btn btn-lg btn-primary w-100 rounded-pill">{{ t("request_refund") }}</a>
            <a href="/legal/refund" target="_blank" class="small">{{ t("refund_info") }}</a>
          </div>
          <div v-else-if="billing.subscription?.management_urls" class="d-flex flex-column flex-lg-row gap-2">
            <template v-if="billing.subscription.status !== 'canceled'">
              <a v-if="billing.subscription.management_urls.update_payment_method" class="btn btn-lg btn-secondary w-100 rounded-pill" :href="billing.subscription.management_urls.update_payment_method">{{ t("update_payment_method") }}</a>
              <a v-if="billing.subscription.management_urls.cancel" class="btn btn-lg btn-danger w-100 rounded-pill" :href="billing.subscription.management_urls.cancel">{{ t("subscription_cancel") }}</a>
            </template>
          </div>
        </template>
        <div v-else class="d-grid">
          <NuxtLink class="btn btn-lg btn-primary rounded-pill" to="/app/premium">{{ t("upgrade") }}</NuxtLink>
        </div>
      </div>
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
        <h3>{{ t("transactions") }}</h3>
        <p>{{ t("transactions_info") }}</p>
        <div v-if="billing.transactions.length" class="table-responsive border rounded">
          <table class="table table-hover m-0">
            <thead>
              <tr>
                <th>{{ t("origin") }}</th>
                <th>{{ t("reference") }}</th>
                <th>{{ t("date") }}</th>
                <th>{{ t("status") }}</th>
                <th>{{ t("amount") }}</th>
                <th v-if="billing.subscription?.is_manageable">{{ t("action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, i) in billing.transactions" :key="i">
                <td>{{ t(transaction.origin === "web" ? "payment" : transaction.origin) }}</td>
                <td>{{ transaction.invoice_number }}</td>
                <td>{{ formatDate(new Date(transaction.billed_at ? transaction.billed_at : transaction.created_at).getTime(), true) }}</td>
                <td>
                  <span :class="`badge border rounded-pill ${transaction.status === 'completed' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'}`">{{ t(transaction.status) }}</span>
                </td>
                <td>
                  <span v-if="transaction.details?.totals">{{ paddleToCurrency(Number(transaction.details.totals.total), transaction.details.totals.currency_code) }}</span>
                </td>
                <td v-if="billing.subscription?.is_manageable">
                  <a v-if="transaction.invoice_number" class="btn btn-sm btn-outline-dark rounded-pill" :href="`/api/billing/invoice/${transaction.id}`">
                    <div class="d-flex align-items-center gap-1">
                      <Icon name="solar:download-minimalistic-bold" />
                      <span>{{ t("download") }}</span>
                    </div>
                  </a>
                  <a v-if="transaction.origin === 'subscription_payment_method_change' && transaction.status !== 'completed' && transaction.checkout?.url" class="btn btn-sm btn-outline-dark rounded-pill" :href="transaction.checkout.url">{{ t("complete") }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center">
          <p class="m-0 text-primary"><i>{{ t("transactions_not_found") }}</i></p>
        </div>
      </div>
    </div>
  </div>
</template>
