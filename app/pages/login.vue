<script setup lang="ts">
definePageMeta({ layout: "access", middleware: "authenticated" });

const { query, meta } = useRoute("login");

const needsConfirm = ref(query.error === "verify_needed" ? true : false);
const resent = ref(false);
const submit = ref({ loading: false, error: false });

const { $toasts } = useNuxtApp();

const form = useFormState({
  email: meta.email || "",
  password: ""
});

const signIn = async () => {
  resent.value = false;
  submit.value.loading = true;
  const login = await $fetch("/api/session", {
    method: "POST",
    body: form.value
  }).catch(() => null);

  if (!login) {
    submit.value.error = true;
    submit.value.loading = false;
    return;
  }

  const { confirmed } = login;
  needsConfirm.value = Boolean(!confirmed);

  if (needsConfirm.value) {
    submit.value.loading = false;
    return;
  }

  navigateTo("/app", { external: true, replace: true });
};

const resendVerification = async () => {
  resent.value = true;
  $toasts.add({ message: t("resent_verification") });
  const resend = await $fetch("/api/verify/resend", {
    method: "POST",
    body: { email: form.value.email }
  }).catch(() => null);

  if (!resend) return;
};

onMounted(() => {
  if (query.error) $toasts.add({ message: t(query.error.toString()), success: false });
  if (!meta.email) return;
  $toasts.add({ message: t("registered") });
});

useSeo({
  title: `${t("signin")} | ${SITE.name}`,
  name: t("signin"),
  description: t("seo_login_description")
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
      <form class="mb-2" @submit.prevent="signIn">
        <div class="text-center mb-4">
          <h2 class="d-flex align-items-center gap-1 justify-content-center fw-bold">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" />
            {{ SITE.name }}
          </h2>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.email" type="email" class="form-control" :placeholder="t('email')" autocomplete="email" :class="{ 'is-invalid': submit.error }" required>
          <label class="form-label">{{ t("email") }}</label>
        </div>
        <div class="form-floating mb-2">
          <input v-model="form.password" type="password" class="form-control" :placeholder="t('password')" autocomplete="current-password" :class="{ 'is-invalid': submit.error }" required>
          <label class="form-label">{{ t("password") }}</label>
        </div>
        <div class="mb-2">
          <NuxtLink to="/recovery">{{ t("forgot_password") }}</NuxtLink>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
            <Transition name="tab" mode="out-in">
              <SpinnerCircle v-if="submit.loading" class="text-white" />
              <span v-else>{{ t("signin") }}</span>
            </Transition>
          </button>
          <NuxtLink external to="/auth/google" class="btn btn-outline-dark btn-lg rounded-pill d-flex align-items-center justify-content-center gap-2">
            <Icon name="logos:google-icon" />
            <span>{{ t("signin_google") }}</span>
          </NuxtLink>
        </div>
      </form>
      <div v-if="needsConfirm && !resent" class="alert alert-warning" role="alert">
        <p class="m-0">{{ t("verify_needed") }}</p>
        <a class="text-decoration-underline text-body" role="button" @click="resendVerification">{{ t("resend_verification") }}</a>
      </div>
      <p class="m-0">
        {{ t("no_account") }}
        <NuxtLink to="/signup">{{ t("create_one") }}</NuxtLink>
      </p>
      <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
    </div>
  </main>
</template>
