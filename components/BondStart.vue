<template>
  <section>
    <div class="text-center h-100">
      <div class="col-lg-6 mx-auto">
        <div class="rounded-3 bg-body shadow px-3 py-4">
          <h1>
            <strong>{{ t("not_bonded") }}</strong>
          </h1>
          <p>{{ t("bond_start") }}</p>
          <button class="btn btn-primary btn-lg rounded-pill px-4" @click="createBond()">{{ t("create_bond") }}</button>
        </div>
      </div>
      <div class="mt-2 mb-3 display-6">
        <span>{{ t("or") }}</span>
      </div>
      <div class="col-lg-6 mx-auto">
        <div class="rounded-3 shadow bg-body px-3 py-4 p-lg-4">
          <form @submit.prevent="joinBond()">
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
  </section>
</template>

<script>
export default {
  emits: ["bond"],
  data () {
    return {
      created: false,
      joined: false,
      code: ""
    };
  },
  methods: {
    async createBond () {
      const bond = await $fetch("/api/bond", { method: "POST" }).catch(() => null);
      this.$emit("bond", {
        bond,
        type: "created"
      });
    },
    async joinBond () {
      const bond = await $fetch("/api/bond", {
        method: "PUT",
        body: {
          code: this.code
        }
      }).catch(() => null);
      this.$emit("bond", {
        bond,
        type: "joined"
      });
    }
  }
};
</script>
