<template>
  <h3 :id="sanitizedId">
    <a v-if="sanitizedId && generate" :href="`#${sanitizedId}`">
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>

<script setup lang="ts">
const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === "boolean" && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h3)));

const sanitizedId = computed(() => props.id?.replace(/^_\d+-/, ""));
</script>
