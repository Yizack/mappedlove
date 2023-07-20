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
    <div id="page" class="flex-fill">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
