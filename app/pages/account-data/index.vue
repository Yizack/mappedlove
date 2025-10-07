<script setup lang="ts">
definePageMeta({ layout: "utils" });

const submit = ref({ loading: false, error: false });
const requested = ref(false);
const { query } = useRoute("account-data");

const form = useFormState({
  request: query.request || "download",
  email: "",
  turnstile: ""
});

const turnstile = useTemplateRef("turnstile");
const theme = useColorMode().preference as "light" | "dark";

const sendRequest = async () => {
  submit.value.loading = true;
  $fetch("/api/account/request", {
    method: "POST",
    body: form.value
  }).then(() => {
    form.reset();
    requested.value = true;
  }).catch(() => {}).finally(() => {
    submit.value.loading = false;
    turnstile.value?.reset();
  });
};

useSeo({
  title: `${t("account_data")} | ${SITE.name}`,
  name: t("account_data"),
  description: t("seo_account_data_description")
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <Transition name="tab" mode="out-in">
        <div v-if="!requested">
          <h2>{{ t("account_data_title") }}</h2>
          <p>{{ t("account_data_description") }}</p>
          <form @submit.prevent="sendRequest">
            <div class="form-floating mb-2">
              <select v-model="form.request" class="form-select" :placeholder="t('account_data_request_download')">
                <option value="download">{{ t("account_data_request_download") }}</option>
                <option value="delete">{{ t("delete_account") }}</option>
              </select>
              <label>{{ t("request") }}</label>
            </div>
            <div class="form-floating mb-2">
              <input v-model="form.email" type="email" class="form-control" :placeholder="t('email')" autocomplete="email" required>
              <label>{{ t("email") }}</label>
            </div>
            <div class="text-center my-3 my-md-0">
              <NuxtTurnstile ref="turnstile" v-model="form.turnstile" :options="{ theme, size: 'flexible' }" />
            </div>
            <div class="d-grid mb-2">
              <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading || !form.turnstile">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("continue") }}</span>
                </Transition>
              </button>
            </div>
          </form>
          <p class="m-0">
            {{ t("account_data_access") }}
            <NuxtLink to="/login">{{ t("signin") }}</NuxtLink>
          </p>
        </div>
        <div v-else class="text-center" :style="{ textWrap: 'balance' }">
          <Icon name="solar:mailbox-bold" class="text-primary" size="5rem" />
          <h1>{{ t("account_data_email") }}!</h1>
          <p class="m-0">{{ t("account_data_email_info") }}</p>
        </div>
      </Transition>
    </div>
  </main>
</template>
