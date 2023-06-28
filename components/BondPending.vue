<template>
  <section>
    <div class="text-center h-100">
      <div class="col-lg-6 mx-auto">
        <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
          <div class="mb-4">
            <h1><strong>{{ t("your_bond_code") }}</strong></h1>
            <h5>{{ t("send_code") }}</h5>
          </div>
          <div class="input-group">
            <input :value="code" type="text" class="form-control form-control-lg fw-bold text-uppercase" :placeholder="t('code')" readonly>
            <button class="btn btn-primary btn-lg px-4" type="submit">{{ t("copy") }}</button>
          </div>
        </div>
        <div class="mt-3">
          <p>{{ t("cancel_code") }}. <span class="text-primary fw-bold" role="button" @click="cancelBond()">{{ t("cancel") }}</span></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    code: {
      type: String,
      required: true
    }
  },
  emits: ["bond"],
  methods: {
    async cancelBond () {
      await $fetch("/api/bond", { method: "DELETE" });
      this.$emit("bond", { bond: null, type: "cancel" });
    }
  }
};
</script>
