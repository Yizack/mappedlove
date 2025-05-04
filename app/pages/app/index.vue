<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: bond } = await useFetch("/api/bond", {
  key: "bond",
  getCachedData: setupCachedData
});

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
    case "leave":
      message = t("bond_left");
      break;
  }
  useNuxtApp().$toasts.add({ message });
  if (bondEvent.value === "joined") navigateTo("/app", { external: true, replace: true });
};

const isBonded = computed((): boolean => {
  return Boolean(bond.value && bond.value.partner1 && bond.value.partner2);
});

useSeo({
  title: `${t("bond")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main class="h-100">
    <Transition name="tab" mode="out-in">
      <BondStart v-if="!bond" @bond="setBond" />
      <BondPending v-else-if="!isBonded || (bond && !bond.partner2)" :bond="bond" @bond="setBond" />
      <BondPage v-else-if="isBonded" :bond="bond" @bond="setBond" />
    </Transition>
  </main>
</template>
