<template>
  <div class="text-center d-flex flex-column h-100 justify-content-center">
    <div class="col-lg-6 mx-auto">
      <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
        <h1>
          <strong>{{ t("not_bonded") }}</strong>
        </h1>
        <p>{{ t("bond_start") }}</p>
        <button class="btn btn-primary btn-lg rounded-pill px-4" :disabled="submitted" @click="createBond">
          <Transition name="tab" mode="out-in">
            <SpinnerCircle v-if="submitted" class="text-white" />
            <span v-else>{{ t("create_bond") }}</span>
          </Transition>
        </button>
      </div>
    </div>
    <div class="mt-2 mb-3 display-6">
      <span>{{ t("or") }}</span>
    </div>
    <div class="col-lg-6 mx-auto">
      <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-5">
        <form @submit.prevent="joinBond">
          <h1>
            <strong>{{ t("bond_code") }}</strong>
          </h1>
          <p>{{ t("ask_code") }}</p>
          <div class="input-group">
            <input v-model="code" type="text" class="form-control form-control-lg fw-bold text-uppercase" :placeholder="t('code')" required>
            <button class="btn btn-primary btn-lg px-4" type="submit">{{ t("bond") }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["bond"],
  data () {
    return {
      submitted: false,
      joined: false,
      code: ""
    };
  },
  methods: {
    async createBond () {
      this.submitted = true;
      const bond = await $fetch("/api/bond", { method: "POST" }).catch(() => null);
      this.submitted = false;
      if (!bond) return;
      this.$emit("bond", { bond, type: "created" });
    },
    async joinBond () {
      const bond = await $fetch("/api/bond", {
        method: "PUT",
        body: {
          code: this.code
        }
      }).catch(() => null);
      if (!bond) return;
      this.$emit("bond", { bond, type: "joined" });
    }
  }
};
</script>
