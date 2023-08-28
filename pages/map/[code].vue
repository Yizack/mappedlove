<script setup lang="ts">
definePageMeta({ layout: "map" });

const { data: bondMap } = await useFetch("/api/bond/map");

const markers = ref(bondMap.value?.markers || []);
const stories = ref(bondMap.value?.stories || []);
</script>

<template>
  <MapPublic ref="map" size="100vh" />
</template>
