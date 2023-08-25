<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { data: bond } = await useFetch("/api/bond");

const bondEvent = ref("");
const setBond = async (event: any) => {
  bond.value = event.bond;
  bondEvent.value = event.type;
  if (bondEvent.value === "joined") navigateTo("/app", { external: true, replace: true });
};

const isBonded = computed((): Boolean => {
  return Boolean(bond.value && bond.value.partner1 && bond.value.partner2);
});
</script>

<template>
  <main class="h-100">
    <Transition name="tab" mode="out-in">
      <BondStart v-if="!bond" @bond="setBond" />
      <BondPending v-else-if="bond && !bond.partner2" :code="bond.code" @bond="setBond" />
      <BondPage v-else-if="isBonded" :bond="bond" />
    </Transition>
    <ToastMessage v-if="bond && bondEvent === 'created'" :name="SITE.name" :text="t('bond_code_created')" success />
    <ToastMessage v-if="bond && bondEvent === 'joined'" :name="SITE.name" :text="t('bond_joined')" success />
  </main>
</template>
