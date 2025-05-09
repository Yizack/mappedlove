<script setup lang="ts">
definePageMeta({ layout: "access", middleware: "authenticated" });

const { query } = useRoute("signup");

const form = useFormState({
  name: "",
  email: "",
  password: "",
  passwordCheck: "",
  turnstile: ""
});

const turnstile = useTemplateRef("turnstile");
const theme = useColorMode().preference as "light" | "dark";
const submit = ref({ loading: false, exists: false });
const needsConfirm = ref(false);
const passwordFocus = ref(false);
const isValidPass = ref(false);

const signUp = async () => {
  if (!(isValidName(form.value.name)
    && isValidEmail(form.value.email)
    && isValidPass.value
    && isValidPasswordCheck(form.value.password, form.value.passwordCheck)
  )) return;

  submit.value.loading = true;
  $fetch("/api/signup", { method: "POST", body: form.value }).then(() => {
    needsConfirm.value = true;
  }).catch((response) => {
    if (response.data.message === "user_exists") {
      submit.value.exists = true;
    }
  }).finally(() => {
    submit.value.loading = false;
    form.reset();
    turnstile.value?.reset();
  });
};

onMounted(() => {
  if (!query.error) return;
  const { $toasts } = useNuxtApp();
  $toasts.add({ message: t(query.error.toString()), success: false });
});

useSeo({
  title: `${t("signup")} | ${SITE.name}`,
  name: t("signup"),
  description: t("seo_signup_description")
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <Transition name="tab" mode="out-in">
        <div v-if="!needsConfirm">
          <form class="mb-2" @submit.prevent="signUp">
            <div class="text-center mb-4">
              <h2 class="d-flex align-items-center gap-1 justify-content-center fw-bold">
                <Icon class="text-primary" name="solar:map-point-favourite-bold" />
                {{ SITE.name }}
              </h2>
              <p class="m-0">{{ t("create_account") }}</p>
            </div>
            <div class="form-floating mb-2">
              <input v-model.trim="form.name" type="text" class="form-control" :class="{ 'is-valid': isValidName(form.name) }" :placeholder="t('name')" autocomplete="given-name" required>
              <label class="form-label">{{ t("name") }}</label>
            </div>
            <div class="form-floating mb-2 position-relative">
              <input v-model="form.email" type="email" class="form-control" :class="{ 'is-valid': isValidEmail(form.email), 'is-invalid': submit.exists }" :placeholder="t('email')" autocomplete="email" required @input="submit.exists = false">
              <label class="form-label">{{ t("email") }}</label>
              <div v-if="submit.exists" class="invalid-tooltip">
                {{ t("email_conflict") }}
              </div>
            </div>
            <div class="form-floating mb-2">
              <input v-model="form.password" type="password" class="form-control" :class="passwordClass(isValidPass, form.password)" :placeholder="t('password')" autocomplete="new-password" required @focus="passwordFocus = true" @blur="passwordFocus = false">
              <label class="form-label">{{ t("password") }}</label>
              <Transition name="tab" mode="out-in">
                <PasswordRequirements v-if="passwordFocus" v-model="isValidPass" :password="form.password" />
              </Transition>
            </div>
            <div class="form-floating mb-2">
              <input v-model="form.passwordCheck" type="password" class="form-control" :class="passwordCheckClass(isValidPass, form.password, form.passwordCheck)" :placeholder="t('password_confirm')" autocomplete="new-password" required>
              <label class="form-label">{{ t("password_confirm") }}</label>
            </div>
            <div class="form-check mb-2">
              <input id="legal" class="form-check-input" type="checkbox" required>
              <label class="form-check-label" for="legal">{{ t("read_legal") }} {{ SITE.name }}'s <NuxtLink to="/legal/terms" target="_blank">{{ t("terms_of_use") }}</NuxtLink> & <NuxtLink to="/legal/privacy" target="_blank">{{ t("privacy_policy") }}</NuxtLink></label>
            </div>
            <div class="text-center my-3 my-md-0">
              <NuxtTurnstile ref="turnstile" v-model="form.turnstile" :options="{ theme, size: 'flexible' }" />
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading || !form.turnstile">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("signup") }}</span>
                </Transition>
              </button>
              <span class="text-center fw-semibold">{{ t("or") }}</span>
              <NuxtLink external to="/auth/google/signup" class="btn btn-outline-dark btn-lg rounded-pill d-flex align-items-center justify-content-center gap-2">
                <Icon name="logos:google-icon" />
                <span>{{ t("signup_google") }}</span>
              </NuxtLink>
            </div>
          </form>
          <p class="m-0">{{ t("has_account") }} <NuxtLink to="/login">{{ t("signin") }}</NuxtLink></p>
          <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
        </div>
        <div v-else class="text-center">
          <Icon name="solar:mailbox-bold" class="text-primary" size="5rem" />
          <h1>{{ t("verify_email") }}!</h1>
          <p class="m-0">{{ t("verify_email_info") }}</p>
        </div>
      </Transition>
    </div>
  </main>
</template>
