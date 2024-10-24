<script setup lang="ts">
definePageMeta({ layout: "utils" });

const { params } = useRoute("recovery-email-code");
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
  code: code.value,
  password: "",
  password_check: ""
});

const resetPassword = async () => {
  if (!(isEmailValid(form.value.email) && isPasswordValid(form.value.password) && isPasswordCheckValid(form.value.password, form.value.password_check))) return;
  submit.value.loading = true;
  const req = await $fetch("/api/recovery", {
    method: "POST",
    body: form.value
  }).catch(() => null);
  submit.value.loading = false;
  if (!req) return;
  $toasts.add({ message: t("reset_success") });
  form.reset();
};

useSeo({
  title: `${t("account_recovery")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <h2>{{ t("account_recovery") }}</h2>
      <p>{{ t("account_recovery_info") }}</p>
      <form @submit.prevent="resetPassword">
        <div class="form-floating mb-2">
          <input type="email" class="form-control" :placeholder="t('email')" autocomplete="email" :value="email" readonly>
          <label>{{ t("email") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input type="text" class="form-control" :placeholder="t('recovery_code')" :value="code" readonly>
          <label>{{ t("recovery_code") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.password" type="password" class="form-control" :class="isPasswordValid(form.password) ? 'is-valid' : form.password.length ? 'is-invalid' : ''" :placeholder="t('new_password')" autocomplete="new-password" required>
          <label>{{ t("new_password") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.password_check" type="password" class="form-control" :class="isPasswordCheckValid(form.password, form.password_check) ? 'is-valid' : form.password_check ? 'is-invalid' : ''" :placeholder="t('password_confirm')" autocomplete="off" required>
          <label>{{ t("password_confirm") }}</label>
        </div>
        <div class="d-grid mb-2">
          <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
            <Transition name="tab" mode="out-in">
              <SpinnerCircle v-if="submit.loading" class="text-white" />
              <span v-else>{{ t("reset_password") }}</span>
            </Transition>
          </button>
        </div>
      </form>
      <p class="m-0">{{ t("recovery_info") }}</p>
    </div>
  </main>
</template>
