<script setup lang="ts">
definePageMeta({ layout: "utils" });

const { params } = useRoute("recovery-emailCode-token");
const { $toasts } = useNuxtApp();

const emailCode = ref(params.emailCode);
const token = ref(params.token);
const submit = ref({ loading: false, error: false });
const passwordFocus = ref(false);
const isValidPass = ref(false);

const email = ref("");
try {
  email.value = fromBase64URL(emailCode.value);
}
catch (e) {
  console.warn(e);
  throw createError({
    statusCode: ErrorCode.BAD_REQUEST,
    message: t("invalid_email_code")
  });
}

const form = useFormState({
  email: email.value,
  token: token.value,
  password: "",
  passwordCheck: ""
});

const resetPassword = async () => {
  if (!(isValidEmail(form.value.email) && isValidPass.value && isValidPasswordCheck(form.value.password, form.value.passwordCheck))) return;
  submit.value.loading = true;
  $fetch("/api/recovery", {
    method: "POST",
    body: form.value
  }).then(() => {
    form.reset();
    $toasts.add({ message: t("reset_success") });
  }).catch(() => {}).finally(() => {
    submit.value.loading = false;
  });
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
          <input type="text" class="form-control" :placeholder="t('recovery_token')" :value="token" readonly>
          <label>{{ t("recovery_token") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.password" type="password" class="form-control" :class="passwordClass(isValidPass, form.password)" :placeholder="t('new_password')" autocomplete="new-password" required @focus="passwordFocus = true" @blur="passwordFocus = false">
          <label>{{ t("new_password") }}</label>
          <Transition name="tab" mode="out-in">
            <PasswordRequirements v-if="passwordFocus" v-model="isValidPass" :password="form.password" />
          </Transition>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.passwordCheck" type="password" class="form-control" :class="passwordCheckClass(isValidPass, form.password, form.passwordCheck)" :placeholder="t('password_confirm')" autocomplete="new-password" required>
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
