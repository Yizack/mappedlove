<script setup lang="ts">
const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === "boolean" && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h3)));

const sanitizedId = computed(() => props.id?.replace(/^_\d+-/, ""));
const showTag = ref(false);
</script>

<template>
  <h3 :id="sanitizedId" class="position-relative" @mouseenter="showTag = true" @mouseleave="showTag = false">
    <Transition name="fade" mode="out-in">
      <a v-if="sanitizedId && generate && showTag" class="position-absolute end-100" :href="`#${sanitizedId}`">
        <span>#</span>
      </a>
    </Transition>
    <slot />
  </h3>
</template>
