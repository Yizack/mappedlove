<script setup>
definePageMeta({ layout: "app", middleware: "session" });
const { loggedIn, user: session } = useUserSession();
</script>

<template>
  {{ session }}
</template>
