<script setup lang="ts">
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, NavigationGuardNext } from "vue-router";

definePageMeta({ layout: "access" });

onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
  if (to.name === "login") to.meta.email = from.meta.email;
  next();
});

const loaded = ref(false);
const verified = ref(false);

const { params, meta } = useRoute("verify-email-code");
const emailCode = ref(params.email);
const code = ref(params.code);
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

const verifyEmail = async () => {
  if (!email.value) return;
  const user = await $fetch("/api/verify", {
    method: "POST",
    body: {
      email: email.value,
      code: code.value
    }
  }).catch(() => null);

  if (!user) return;
  verified.value = true;
  meta.email = email;
};

onMounted(async () => {
  if (!(emailCode.value && code.value)) return;
  await verifyEmail();
  loaded.value = true;
});

useSeo({
  title: `${t("verify_email")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow text-center">
      <Transition name="tab" mode="out-in">
        <div v-if="!loaded">
          <SpinnerCircle />
          <h3 class="mb-0 mt-1">{{ t("verifying_email") }}</h3>
        </div>
        <div v-else-if="verified">
          <Icon name="solar:check-circle-bold" class="text-success" size="5rem" />
          <h1>{{ t("welcome") }}!</h1>
          <p class="m-0">{{ t("email_verified") }}</p>
          <NuxtLink to="/login">{{ t("signin") }}</NuxtLink>
        </div>
        <div v-else>
          <Icon name="solar:close-circle-bold" class="text-danger" size="5rem" />
          <h1>{{ t("error_any") }}!</h1>
          <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
        </div>
      </Transition>
    </div>
  </main>
</template>
