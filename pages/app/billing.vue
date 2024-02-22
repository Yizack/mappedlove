<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user } = useUserSession();

if (!user.value.bond?.id) {
  throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: t("bond_not_found"),
    fatal: true
  });
}

const planId = ref("");
const buttonId = ref("");

onMounted(async () => {
  const { $paypal } = useNuxtApp();
  planId.value = $paypal.planId;
  buttonId.value = `paypal-button-container-${planId.value}`;
  const paypal = await $paypal.loadScript();
  if (!paypal.Buttons) return;

  const button = paypal.Buttons({
    style: {
      shape: "pill",
      color: "gold",
      layout: "vertical",
      label: "paypal"
    },
    createSubscription: (data, actions) => {
      return actions.subscription.create({
        plan_id: planId.value,
        custom_id: String(user.value.bond?.id)
      });
    },
    onApprove: (data): Promise<void> => {
      console.info(data);
      return Promise.resolve();
    }
  });

  button.render("#" + buttonId.value);
});
</script>

<template>
  <main>
    <div :id="buttonId" />
  </main>
</template>
