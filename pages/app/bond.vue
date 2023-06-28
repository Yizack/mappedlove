<script setup>
definePageMeta({ layout: "app", middleware: "session" });
const { data: bond } = await useFetch("/api/bond");

const bondEvent = ref("");
const setBond = async (event) => {
  bond.value = event.bond;
  bondEvent.value = event.type;
  await useUserSession().fetch();
};
</script>

<template>
  <main>
    <Transition name="tab" mode="out-in">
      <BondStart v-if="!bond" @bond="setBond($event)" />
      <BondPending v-else-if="bond && !bond.partner2" :code="bond.code" @bond="setBond($event)" />
    </Transition>
    <ToastMessage v-if="bond && bondEvent === 'created'" :name="SITE.name" :text="t('bond_code_created')" success />
    <ToastMessage v-if="bond && bondEvent === 'joined'" :name="SITE.name" :text="t('bond_joined')" success />
  </main>
</template>
