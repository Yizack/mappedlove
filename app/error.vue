<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="bg-body p-5 rounded-3 shadow">
      <h1>{{ t("error") }} <span class="text-primary">{{ error.statusCode }}</span></h1>
      <h5>{{ t("error_occurred") }}: {{ t(error.message || error.statusMessage || "error") }}</h5>
      <p>{{ t("go_back") }}: <NuxtLink to="/" class="text-decoration-underline">{{ SITE.domain }}</NuxtLink></p>
    </div>
  </div>
</template>
