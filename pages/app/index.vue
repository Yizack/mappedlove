<script setup>
definePageMeta({ layout: "app", middleware: "session" });
const { data: bond } = useFetch("/api/bond");

const setBond = (bonded) => {
  bond.value = bonded;
};
</script>

<template>
  <main>
    <BondStart v-if="!bond" @bond="setBond($event)" />
    {{ bond }}
  </main>
</template>
