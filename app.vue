<script setup lang="ts">
setScrollBehavior();

const { $bootstrap, $toasts } = useNuxtApp();

onMounted(() => {
  $fetch = $fetch.create({
    onResponseError: ({ response }) => {
      const message = response.status === 500 ? t("error") : t(response._data.message);
      $toasts.add({ message, success: false });
    }
  });

  $bootstrap.hideModalEscEvent();
});
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <ToastsController />
</template>
