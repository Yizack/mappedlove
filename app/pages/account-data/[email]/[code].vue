<script setup lang="ts">
definePageMeta({ layout: "utils" });

const { params, query } = useRoute("account-data-email-code");
const { $toasts } = useNuxtApp();

const emailCode = ref(params.email);
const code = ref(params.code);
const submit = ref({ loading: false, error: false });

const email = ref("");
try {
  email.value = atob(emailCode.value);
}
catch (e) {
  console.warn(e);
  throw createError({
    statusCode: ErrorCode.BAD_REQUEST,
    message: t("invalid_email_code"),
    fatal: true
  });
}

const form = useFormState({
  email: email.value,
  code: code.value
});

const submitRequest = async () => {
  submit.value.loading = true;
  let message = "";
  if (query.request === "download") {
    message = t("account_data_request_download_success");
    navigateTo(`/api/account?code=${params.code}&email=${params.email}`, { external: true });
  }
  else if (query.request === "delete" && confirm(t("delete_account_confirm"))) {
    const req = await $fetch("/api/account", {
      method: "DELETE",
      body: form.value
    }).catch(() => null);
    if (!req) return;
    message = t("account_data_request_delete_success");
  }
  submit.value.loading = false;
  $toasts.add({ message: message || t("account_data_error"), success: Boolean(message) });
  form.reset();
};

useSeo({
  title: `${t("account_data")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <h2>{{ t("account_data_title") }}</h2>
      <p v-if="query.request === 'delete'">{{ t("delete_account_info") }}</p>
      <p>{{ t("account_data_info") }}</p>
      <form @submit.prevent="submitRequest">
        <div class="form-floating mb-2">
          <input type="email" class="form-control" :placeholder="t('email')" autocomplete="email" :value="email" readonly>
          <label>{{ t("email") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input type="text" class="form-control" :placeholder="t('account_data_request_code')" :value="code" readonly>
          <label>{{ t("account_data_request_code") }}</label>
        </div>
        <div class="d-grid mb-2">
          <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
            <Transition name="tab" mode="out-in">
              <SpinnerCircle v-if="submit.loading" class="text-white" />
              <span v-else-if="query.request === 'delete'">{{ t("account_data_request_delete") }}</span>
              <span v-else>{{ t("account_data_request_download") }}</span>
            </Transition>
          </button>
        </div>
      </form>
      <p class="m-0">{{ t("account_data_link_info") }}</p>
    </div>
  </main>
</template>
