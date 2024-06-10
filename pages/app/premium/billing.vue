<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { user } = useUserSession();
const { data: billing } = await useFetch(`/api/billing/${user.value.bond?.subscriptionId}`);
</script>

<template>
  <div class="row">
    <div class="col-lg-8 col-xl-6 mx-auto">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
        <h3>{{ t("billing_information") }}</h3>
        <p>{{ t("billing_info") }}</p>
        <div class="row">
          <div class="col-lg-6">
            <h5>{{ t("plan") }}</h5>
            <p v-if="user.bond?.premium">{{ SITE.name }} {{ t(SUBSCRIPTION.pricing.plans.premium.name) }}</p>
            <p v-else>{{ SITE.name }} {{ t(SUBSCRIPTION.pricing.plans.free.name) }}</p>
          </div>
          <div v-if="user.bond?.premium && billing?.subscription" class="col-lg-6">
            <h5>{{ t("status") }}</h5>
            <p v-if="billing.subscription.scheduled_change?.action === 'cancel'">
              <span class="badge border rounded-pill bg-secondary text-primary border-primary">
                {{ t("canceled") }}
              </span>
            </p>
            <p v-else><span :class="`badge border rounded-pill ${billing.subscription?.status === 'active' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'}`">{{ t(billing.subscription.status) }}</span>
            </p>
          </div>
          <div v-if="user.bond?.premium && billing?.subscription" class="col-lg-6">
            <h5>{{ t("subscription") }}</h5>
            <p>{{ billing.subscription.id }}</p>
          </div>
          <div v-if="user.bond?.premium " class="col-lg-6">
            <h5>{{ t("amount") }}</h5>
            <p>${{ SUBSCRIPTION.pricing.plans.premium.price }} / {{ t("month") }}</p>
          </div>
          <div class="col-lg-6">
            <h5>{{ t("bond") }}</h5>
            <p>{{ user.bond?.code }}</p>
          </div>
          <div v-if="user.bond?.premium && billing?.subscription?.current_billing_period" class="col-lg-6">
            <h5 v-if="billing.subscription.scheduled_change?.action === 'cancel'">{{t("until") }}</h5>
            <h5 v-else>{{ t("next_payment") }}</h5>
            <p>{{ billing.subscription.current_billing_period.ends_at ? formatDate(new Date(billing.subscription.current_billing_period.ends_at).getTime(), true) : null }}</p>
          </div>
        </div>
        <div v-if="user.bond?.premium && billing?.subscription?.management_urls" class="gap-2 d-flex flex-column flex-lg-row">
          <template v-if="billing.subscription.scheduled_change?.action !== 'cancel' && billing.subscription.status !== 'canceled'">
            <a v-if="billing.subscription.management_urls.update_payment_method" class="btn btn-lg btn-secondary w-100 rounded-pill" :href="billing.subscription.management_urls.update_payment_method">{{ t("update_payment_method") }}</a>
            <a v-if="billing.subscription.management_urls.cancel" class="btn btn-lg btn-danger w-100 rounded-pill" :href="billing.subscription.management_urls.cancel">{{ t("subscription_cancel") }}</a>
          </template>
        </div>
        <div v-else class="d-grid">
          <NuxtLink class="btn btn-lg btn-primary rounded-pill" to="/app/premium">{{ t("upgrade") }}</NuxtLink>
        </div>
      </div>
      <div v-if="billing?.transactions" class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
        <h3>{{ t("transactions") }}</h3>
        <p>{{ t("invoices_info") }}</p>
        <div class="table-responsive border rounded">
          <table class="table table-hover m-0">
            <thead>
              <tr>
                <th>{{ t("origin") }}</th>
                <th>{{ t("reference") }}</th>
                <th>{{ t("date") }}</th>
                <th>{{ t("status") }}</th>
                <th>{{ t("amount") }}</th>
                <th>{{ t("action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in billing.transactions" :key="transaction.id">
                <td>{{ t(transaction.origin === "web" ? "payment" : transaction.origin) }}</td>
                <td>{{ transaction.invoice_number }}</td>
                <td>{{ formatDate(new Date(transaction.billed_at ? transaction.billed_at : transaction.created_at).getTime(), true) }}</td>
                <td>
                  <span :class="`badge border rounded-pill ${transaction.status === 'completed' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'}`">
                    {{ t(transaction.status) }}
                  </span>
                </td>
                <td>
                  <span v-if="transaction.details?.totals">{{ paddleToCurrency(Number(transaction.details.totals.total), transaction.details.totals.currency_code) }}</span>
                </td>
                <td>
                  <a v-if="transaction.invoice_number" :href="`/api/billing/invoice/${transaction.id}`" class="btn btn-sm btn-outline-dark rounded-pill">{{ t("download") }}</a>
                  <a v-if="transaction.origin === 'subscription_payment_method_change' && transaction.status !== 'completed' && transaction.checkout?.url" class="btn btn-sm btn-outline-dark rounded-pill" :href="transaction.checkout.url">{{ t("complete") }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
