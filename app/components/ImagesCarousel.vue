<script setup lang="ts">
defineProps<{
  id: string;
  items: string[];
  height?: string | number;
  width?: string | number;
  alt: string;
  lazy?: boolean;
}>();
</script>

<template>
  <div :id="id" class="carousel slide carousel-fade">
    <div class="carousel-indicators" :style="{ marginBottom: '-1.3rem' }">
      <button
        v-for="(src, index) in items"
        :key="index"
        class="bg-primary rounded-pill border-0 py-1 px-2"
        type="button"
        :data-bs-target="`#${id}`"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        aria-current="true"
      />
    </div>
    <div class="carousel-inner rounded shadow">
      <div v-for="(src, index) in items" :key="index" class="carousel-item" :class="{ active: index === 0 }">
        <img
          class="img-fluid"
          :src="src"
          :width="width"
          :height="height"
          :alt="`${alt} - ${index + 1}`"
          :loading="lazy ? 'lazy' : 'eager'"
        >
      </div>
    </div>
  </div>
</template>
