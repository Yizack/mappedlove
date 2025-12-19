<script setup lang="ts">
definePageMeta({ layout: "access" });

onBeforeRouteLeave((to, from, next) => {
  if (to.name === "login") to.meta.email = from.meta.email;
  next();
});

const loaded = ref(false);
const verified = ref(false);

const { params, meta } = useRoute("verify-emailCode-token");
const emailCode = ref(params.emailCode);
const token = ref(params.token);
const email = ref("");
try {
  email.value = fromBase64URL(emailCode.value);
}
catch (e) {
  console.warn(e);
  throw createError({
    status: ErrorCode.BAD_REQUEST,
    message: t("invalid_email_code")
  });
}

const verifyEmail = async () => {
  if (!email.value) return;
  $fetch("/api/verify", {
    method: "POST",
    body: { email: email.value, token: token.value }
  }).then(() => {
    verified.value = true;
    meta.email = email;
  }).catch(() => {}).finally(() => {
    loaded.value = true;
  });
};

onMounted(async () => {
  if (!(emailCode.value && token.value)) return;
  await verifyEmail();
});

useSeo({
  title: `${t("verify_email")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="col-md-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow text-center" :style="{ textWrap: 'balance' }">
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
