<script setup lang="ts">
defineProps({
  bond: {
    type: Object as () => MappedLoveBond,
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
  <div v-if="!bond.bonded" class="text-center d-flex flex-column h-100 justify-content-center">
    <div class="col-lg-6 mx-auto">
      <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
        <div class="mb-4">
          <h1><strong>{{ t("your_bond_code") }}</strong></h1>
          <h5>{{ t("send_code") }}</h5>
        </div>
        <CopyText :text="bond.code" :placeholder="t('code')" lg uppercase bold />
      </div>
      <div class="mt-3">
        <p>{{ t("cancel_code") }}. <span class="text-primary fw-bold" role="button" @click="cancelBond">{{ t("cancel_bond") }}</span></p>
      </div>
    </div>
  </div>
  <div v-else class="text-center d-flex flex-column h-100 justify-content-center">
    <div class="col-lg-6 mx-auto">
      <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
        <div class="mb-4">
          <h1><strong>{{ t("partner_left") }}</strong></h1>
          <p>{{ t("partner_left_info2") }}</p>
          <h5>{{ t("partner_left_info") }}</h5>
        </div>
        <CopyText :text="bond.code" :placeholder="t('code')" lg uppercase bold />
      </div>
      <div class="mt-3">
        <p>{{ t("cancel_code_left") }}. <span class="text-primary fw-bold" role="button" @click="cancelBond">{{ t("delete_bond") }}</span></p>
      </div>
    </div>
  </div>
</template>
