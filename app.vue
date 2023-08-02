<script setup>
setScrollBehavior();

onMounted(() => {
  const { $bootstrap } = useNuxtApp();
  $bootstrap.hideModalEscEvent();
});
</script>

<template>
  <NuxtLoadingIndicator :throttle="0" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
