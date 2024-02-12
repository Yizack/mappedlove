<script setup lang="ts">
useNuxtApp();

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  lg: { type: Boolean, default: false },
});
</script>

<template>
  <div :id="id" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': lg }">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ title }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
