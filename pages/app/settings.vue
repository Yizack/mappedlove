<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });
const { user } = useUserSession();
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-3">
          <h3 class="mb-4">{{ t("account") }}</h3>
          <div class="form-floating mb-3">
            <input class="form-control" :value="user.name">
            <label>{{ t("name") }}</label>
          </div>
          <div class="form-floating mb-3">
            <input class="form-control" :value="user.email">
            <label>{{ t("email") }}</label>
          </div>
          <div class="form-floating mb-3">
            <input class="form-control" :value="user.country">
            <label>{{ t("country") }}</label>
          </div>
          <div class="form-floating mb-3">
            <input class="form-control" :value="user.birthDate">
            <label>{{ t("birth_date") }}</label>
          </div>
        </div>
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <h3 class="mb-4">{{ t("preferences") }}</h3>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input class="form-check-input" type="checkbox" role="switch">
            <label class="form-check-label">{{ t("show_avatar") }}</label>
          </div>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input class="form-check-input" type="checkbox" role="switch">
            <label class="form-check-label">{{ t("dark_mode") }}</label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
