<script setup lang="ts">
definePageMeta({ layout: "map" });

const { params } = useRoute();

const { data: map } = await useFetch(`/api/bond/public/${params.code}`);

if (!map.value) {
  throw createError({
    statusCode: 404,
    message: "Bond not found",
    fatal: true
  });
}

const selected = ref(0);
</script>

<template>
  <MapPublic v-if="map" ref="map" :bond="map" :select="selected" @select="selected = $event" />
</template>
