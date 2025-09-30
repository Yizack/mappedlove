<script setup lang="ts">
import { destr } from "destr";
import type { NuxtError } from "#app";
import type { ZodError } from "zod";

defineProps<{
  error: NuxtError;
}>();

const getErrorMessage = (error: NuxtError) => {
  const errors = destr<string | ZodError[] | undefined>(error.message);
  if (Array.isArray(errors)) {
    return errors.map(e => e.message).join(", ");
  }
  return errors || error.statusMessage;
};
</script>

<template>
  <div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="bg-body p-5 rounded-3 shadow">
      <h1>{{ t("error") }} <span class="text-primary">{{ error.statusCode }}</span></h1>
      <h5>{{ t("error_occurred") }}: {{ t(getErrorMessage(error) || "error") }}</h5>
      <p>{{ t("go_back") }}: <NuxtLink to="/" class="text-decoration-underline">{{ SITE.domain }}</NuxtLink></p>
    </div>
  </div>
</template>
