<script setup lang="ts">
defineProps({
  code: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["bond"]);

const cancelBond = async () => {
  const bond = await $fetch("/api/bond", { method: "DELETE" }).catch(() => null);
  if (!bond) return;
  emit("bond", { bond: null, type: "cancel" });
};
</script>

<template>
  <div class="text-center d-flex flex-column h-100 justify-content-center">
    <div class="col-lg-6 mx-auto">
      <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
        <div class="mb-4">
          <h1><strong>{{ t("your_bond_code") }}</strong></h1>
          <h5>{{ t("send_code") }}</h5>
        </div>
        <CopyText :text="code" :placeholder="t('code')" lg uppercase bold />
      </div>
      <div class="mt-3">
        <p>{{ t("cancel_code") }}. <span class="text-primary fw-bold" role="button" @click="cancelBond">{{ t("cancel_bond") }}</span></p>
      </div>
    </div>
  </div>
</template>
