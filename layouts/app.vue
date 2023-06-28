<script setup>
const { name } = useRoute();
</script>

<template>
  <div id="layout" class="position-fixed h-100 w-100 d-flex flex-column bg-secondary overflow-auto">
    <AppNavbar />
    <div class="container-fluid py-3 my-auto">
      <slot />
    </div>
  </div>
</template>
