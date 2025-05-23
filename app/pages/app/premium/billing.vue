<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { $toasts } = useNuxtApp();

const { user } = useUserSession();
const isValidSubscription = computed(() => Boolean(user.value?.bond?.subscriptionId));
const isPremium = computed(() => user.value?.bond?.premium);

const { data: billing } = await useFetch(`/api/billing/subscription/${user.value?.bond?.subscriptionId}`, {
  immediate: isValidSubscription.value
});

if (!billing.value) {
  throw createError({
    statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: t("error_any"),
    fatal: true
  });
}

const loading = ref(false);

const refundForm = useFormState({
  reason: ""
});

const refundModal = useModal("refund");

const requestRefund = async () => {
  if (!confirm(t("refund_confirm"))) return;
  loading.value = true;
  $fetch("/api/billing/refund", {
    method: "POST",
    body: refundForm.value
  }).then(() => {
    $toasts.add({ message: t("refund_requested") });
    refundModal.value.hide();
    refundForm.value.reason = "";
  }).catch(() => {}).finally(() => {
    loading.value = false;
  });
};

// Transactions pagination
const tPagination = usePagination(billing.value.transactions.data, {
  pageSize: billing.value.transactions.meta?.pagination.per_page || 30,
  total: billing.value.transactions.meta?.pagination.estimated_total
});

const isFetchingTransactions = ref(false);

const transactionsPagesMap = ref<{ page: number, id?: string | null }[]>([]);
const lastTransaction = computed(() => billing.value?.transactions.data[billing.value?.transactions.data.length - 1]?.id);
if (lastTransaction.value) {
  transactionsPagesMap.value.push({ page: 1, id: lastTransaction.value });
}

const fetchTransactions = async (data: { currentPage: number }) => {
  isFetchingTransactions.value = true;
  const transactions = await $fetch(`/api/billing/subscription/${user.value?.bond?.subscriptionId}/transactions`, {
    query: {
      after: data.currentPage > 1 ? transactionsPagesMap.value.find(page => page.page === data.currentPage - 1)?.id : undefined
    }
  }).catch(() => {});
  isFetchingTransactions.value = false;
  if (!transactions || !billing.value) return;
  billing.value = { ...billing.value, transactions };
  if (transactionsPagesMap.value.find(page => page.page === data.currentPage)) return;
  transactionsPagesMap.value.push({ page: data.currentPage, id: lastTransaction.value });
};

useSeo({
  title: `${t("billing")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <div v-if="billing" class="row">
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
              <p v-else class="mb-0">
                <span class="badge border rounded-pill" :class="billing.subscription?.status === 'active' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'">{{ t(billing.subscription.status) }}</span>
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
              <p class="mb-0">{{ user?.bond?.code }}</p>
            </div>
            <div v-if="isPremium && billing.subscription?.current_billing_period" class="col-lg-6">
              <h5 v-if="billing.subscription.scheduled_change?.action === 'cancel'">{{ t("until") }}</h5>
              <h5 v-else>{{ t("next_payment") }}</h5>
              <p class="mb-0">
                <NuxtTime :datetime="billing.subscription.current_billing_period.ends_at" v-bind="timeOptions.full" />
              </p>
            </div>
          </div>
        </div>
        <template v-if="isPremium">
          <div v-if="isValidSubscription && !billing.subscription?.is_manageable" class="d-flex gap-2 align-items-center">
            <Icon name="solar:info-circle-bold" />
            <p class="mb-0"><strong>{{ t("billing_manageable") }}</strong></p>
          </div>
          <div v-else-if="billing.subscription?.scheduled_change?.action === 'cancel'" class="text-center">
            <button class="btn btn-lg btn-primary w-100 rounded-pill" @click="refundModal.show()">{{ t("request_refund") }}</button>
            <NuxtLink to="/legal/refund" target="_blank" class="small">{{ t("refund_info") }}</NuxtLink>
          </div>
          <div v-else-if="billing.subscription?.management_urls" class="d-flex flex-column flex-lg-row gap-2">
            <template v-if="billing.subscription.status !== 'canceled'">
              <NuxtLink v-if="billing.subscription.management_urls.update_payment_method" class="btn btn-lg btn-secondary w-100 rounded-pill" :to="billing.subscription.management_urls.update_payment_method" target="_blank">{{ t("update_payment_method") }}</NuxtLink>
              <NuxtLink v-if="billing.subscription.management_urls.cancel" class="btn btn-lg btn-danger w-100 rounded-pill" :to="billing.subscription.management_urls.cancel" target="_blank">{{ t("subscription_cancel") }}</NuxtLink>
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
        <div v-if="billing.transactions.data.length">
          <div class="table-responsive border rounded">
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
              <tbody v-if="isFetchingTransactions">
                <tr v-for="n of tPagination.config.pageSize" :key="n" class="placeholder-glow">
                  <td><span class="placeholder col-12" /></td>
                  <td><span class="placeholder col-12" /></td>
                  <td><span class="placeholder col-12" /></td>
                  <td><span class="placeholder col-12" /></td>
                  <td><span class="placeholder col-12" /></td>
                  <td><span class="placeholder col-12" /></td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="(transaction, i) in billing.transactions.data" :key="i">
                  <td>{{ t(transaction.origin === "web" ? "payment" : transaction.origin) }}</td>
                  <td>{{ transaction.invoice_number }}</td>
                  <td>
                    <NuxtTime :datetime="transaction.billed_at ? transaction.billed_at : transaction.created_at" v-bind="timeOptions.full" />
                  </td>
                  <td>
                    <span class="badge border rounded-pill" :class="transaction.status === 'completed' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'">{{ t(transaction.status) }}</span>
                  </td>
                  <td>
                    <span v-if="transaction.details?.totals">{{ paddleToCurrency(Number(transaction.details.totals.total), transaction.details.totals.currency_code) }}</span>
                  </td>
                  <td v-if="billing.subscription?.is_manageable">
                    <NuxtLink v-if="transaction.invoice_number" class="btn btn-sm btn-outline-dark rounded-pill" external :to="`/api/billing/invoice/${transaction.id}`">
                      <div class="d-flex align-items-center gap-1">
                        <Icon name="solar:download-minimalistic-bold" />
                        <span>{{ t("download") }}</span>
                      </div>
                    </NuxtLink>
                    <NuxtLink v-if="transaction.origin === 'subscription_payment_method_change' && transaction.status !== 'completed' && transaction.checkout?.url" class="btn btn-sm btn-outline-dark rounded-pill" :to="transaction.checkout.url">{{ t("complete") }}</NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="tPagination.config.total > tPagination.config.pageSize" class="d-flex justify-content-center mt-2">
            <BsPagination v-model="tPagination.config.currentPage" v-bind="tPagination.config" @page-change="fetchTransactions" />
          </div>
        </div>
        <div v-else class="text-center">
          <p class="m-0 text-primary"><i>{{ t("transactions_not_found") }}</i></p>
        </div>
      </div>
      <div v-if="billing.adjustments.data.length" class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
        <h3>{{ t("adjustments") }}</h3>
        <p>{{ t("adjustments_info") }}</p>
        <div class="table-responsive border rounded">
          <table class="table table-hover m-0">
            <thead>
              <tr>
                <th>{{ t("reason") }}</th>
                <th>{{ t("reference") }}</th>
                <th>{{ t("date") }}</th>
                <th>{{ t("status") }}</th>
                <th>{{ t("amount") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(adjustment, i) in billing.adjustments.data" :key="i">
                <td>{{ adjustment.reason }}</td>
                <td>{{ adjustment.invoice_number }}</td>
                <td>
                  <NuxtTime :datetime="adjustment.created_at" v-bind="timeOptions.full" />
                </td>
                <td>
                  <span class="badge border rounded-pill" :class="adjustment.status === 'approved' ? 'bg-success-subtle text-success border-success' : 'bg-secondary text-primary border-primary'">{{ t(adjustment.status) }}</span>
                </td>
                <td>
                  <span v-if="adjustment.totals.total">{{ paddleToCurrency(Number(adjustment.totals.total), adjustment.totals.currency_code) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <BsModal v-if="billing.subscription?.scheduled_change?.action === 'cancel' || billing.subscription?.status === 'canceled'" id="refund" v-model="refundModal" :title="t('request_refund')">
      <form @submit.prevent="requestRefund">
        <div class="d-flex align-items-center gap-2 mb-2">
          <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
          <p class="m-0">{{ t("refund_info") }}</p>
        </div>
        <div class="form-floating mb-2">
          <textarea v-model.trim="refundForm.reason" type="text" class="form-control" :placeholder="t('reason')" :style="{ height: '100px' }" required />
          <label>{{ t("reason") }} <span class="text-danger">*</span></label>
        </div>
        <button type="submit" class="btn btn-primary w-100 rounded-pill">
          <Transition name="tab" mode="out-in">
            <SpinnerCircle v-if="loading" class="text-white" />
            <span v-else>{{ t("request") }}</span>
          </Transition>
        </button>
      </form>
    </BsModal>
  </div>
</template>
