<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user, fetch: sessionFetch } = useUserSession();

const bond = ref(user.value?.bond);

const bondEvent = ref("");
const setBond = async (event: { bond: MappedLoveBond, type: string }) => {
  bond.value = event.bond;
  bondEvent.value = event.type;
  let message = "";
  switch (bondEvent.value) {
    case "created":
      message = t("bond_code_created");
      break;
    case "joined":
      message = t("bond_joined");
      break;
    case "cancel":
      message = t("bond_cancelled");
      break;
  }
  useNuxtApp().$toasts.add({ message, success: true });
  if (bondEvent.value === "joined") navigateTo("/app", { external: true, replace: true });
};

const isBonded = computed((): boolean => {
  return Boolean(bond.value && bond.value.partner1 && bond.value.partner2);
});

onBeforeMount(async () => {
  await sessionFetch();
});
</script>

<template>
  <main class="h-100">
    <Transition name="tab" mode="out-in">
      <BondStart v-if="!bond" @bond="setBond" />
      <BondPending v-else-if="bond && !bond.partner2" :code="bond.code" @bond="setBond" />
      <BondPage v-else-if="isBonded" :bond="bond" />
    </Transition>
  </main>
</template>
