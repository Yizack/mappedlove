<script setup lang="ts">
interface ControllerModalModel {
  isVisible: boolean;
  show: (callback?: () => void) => Promise<void>;
  hide: () => void;
}

defineProps({
  modelValue: { type: Object as () => ControllerModalModel, required: true },
  id: { type: String, required: true },
  title: { type: String, default: "" },
  lg: { type: Boolean, default: false },
  fullscreen: { type: Boolean, default: false },
  map: { type: Boolean, default: false }
});
</script>

<template>
  <div v-if="modelValue.isVisible" :id="id" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true" :class="{ 'modal-map': map }">
    <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': lg, 'modal-fullscreen': fullscreen }">
      <div class="modal-content">
        <div v-if="title" class="modal-header">
          <h1 id="modalLabel" class="modal-title fs-5">{{ title }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body" :class="{ 'p-0 d-flex align-items-center justify-content-center': map }">
          <slot />
          <div v-if="!title" class="position-absolute end-0 top-0 m-2">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
