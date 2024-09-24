<script setup lang="ts">
definePageMeta({ layout: "utils", middleware: "authenticated" });

const submit = ref({ loading: false, error: false });
const needsRecovery = ref(false);

const form = useFormState({
  email: ""
});

const sendRecovery = async () => {
  submit.value.loading = true;
  const req = await $fetch("/api/recovery/request", {
    method: "POST",
    body: form.value
  }).catch(() => null);
  submit.value.loading = false;
  if (!req) return;
  form.reset();
  needsRecovery.value = true;
};

useSeo({
  title: `${t("forgot_password")} | ${SITE.name}`,
  name: t("forgot_password"),
  description: t("seo_recovery_description")
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <Transition name="tab" mode="out-in">
        <div v-if="!needsRecovery">
          <h2>{{ t("recovery_title") }}</h2>
          <p>{{ t("recovery_description") }}</p>
          <form @submit.prevent="sendRecovery">
            <div class="form-floating mb-2">
              <input v-model="form.email" type="email" class="form-control" :placeholder="t('email')" autocomplete="email">
              <label>{{ t("email") }}</label>
            </div>
            <div class="d-grid mb-2">
              <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("continue") }}</span>
                </Transition>
              </button>
            </div>
          </form>
          <p class="m-0">
            {{ t("remembered_password") }}
            <NuxtLink to="/login">{{ t("signin") }}</NuxtLink>
          </p>
        </div>
        <div v-else class="text-center">
          <Icon name="solar:mailbox-bold" class="text-primary" size="5rem" />
          <h1>{{ t("recovery_email") }}!</h1>
          <p class="m-0">{{ t("recovery_email_info") }}</p>
        </div>
      </Transition>
    </div>
  </main>
</template>
