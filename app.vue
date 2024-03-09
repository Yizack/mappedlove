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
  <div>
    <NuxtLoadingIndicator :throttle="0" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastsController />
    <CookiesController />
  </div>
</template>
