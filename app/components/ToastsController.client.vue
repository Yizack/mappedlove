<script setup lang="ts">
const { $toasts, $bootstrap } = useNuxtApp();
const toasts = $toasts?.getAll();
const refToasts = ref<HTMLElement[]>();

watch(toasts, () => {
  nextTick(() => {
    if (!refToasts.value) return;
    for (let i = 0; i < refToasts.value.length; i++) {
      const toast = $bootstrap.showToast(refToasts.value[i]!);
      if (!toast) continue;
      toast.addEventListener("hidden.bs.toast", () => {
        if (i + 1 === refToasts.value?.length) $toasts.removeAll();
      });
    }
  });
});
</script>

<template>
  <div class="toast-container position-fixed bottom-0 start-0 p-3">
    <div v-for="toast of toasts" :key="toast.id" ref="refToasts" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto d-flex gap-1 align-items-center">
          <Icon class="text-primary" name="solar:map-point-favourite-bold" />
          {{ SITE.name }}
        </strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" />
      </div>
      <div class="toast-body">
        <div class="d-flex align-items-center gap-2">
          <Icon v-if="toast.success" name="solar:check-circle-bold" size="1.5em" class="text-success flex-shrink-0" />
          <Icon v-else name="solar:close-circle-bold" size="1.5em" class="text-danger flex-shrink-0" />
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
