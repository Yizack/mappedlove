<script setup>
const { name } = useRoute();
</script>

<template>
  <div id="layout" class="vh-100 d-flex flex-column bg-secondary">
    <AppNavbar />
    <div class="container-fluid py-3 my-auto">
      <slot />
    </div>
  </div>
</template>
