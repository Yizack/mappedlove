<script setup>
definePageMeta({ layout: "app", middleware: "session" });
const { user, bond } = useUserSession();
</script>

<template>
  {{ user }}
  {{ bond }}
</template>
