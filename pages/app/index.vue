<script setup>
definePageMeta({ layout: "app", middleware: "session" });
const { user: session } = useUserSession();
const { data: bond } = useFetch("/api/bond");
</script>

<template>
  <main>
    <div v-if="!bond" class="text-center h-100">
      <div class="col-lg-6 rounded-3 bg-secondary p-3 mx-auto">
        <h1>
          <strong>{{ t("not_bonded") }}</strong>
        </h1>
        <p>{{ t("bond_start") }}</p>
        <button class="btn btn-primary btn-lg rounded-pill px-4">{{ t("create_bond") }}</button>
      </div>
      <div class="mt-2 mb-3 display-6">
        <span>{{ t("or") }}</span>
      </div>
      <div class="col-lg-6 rounded-3 bg-secondary px-3 py-4 p-lg-4 mx-auto">
        <form>
          <h1>
            <strong>{{ t("bond_code") }}</strong>
          </h1>
          <p>{{ t("ask_code") }}</p>
          <div class="input-group">
            <input type="text" class="form-control form-control-lg fw-bold" :placeholder="t('code')" required>
            <button class="btn btn-primary btn-lg px-4" type="submit">{{ t("bond") }}</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
