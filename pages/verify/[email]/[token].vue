<script setup>
definePageMeta({ layout: "access" });
</script>

<template>
  <main>
    <section>
      <div class="col-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow text-center">
        <Transition name="tab" mode="out-in">
          <div v-if="!loaded">
            <SpinnerCircle />
            <h3 class="mb-0 mt-1">{{ t("verifying_email") }}...</h3>
          </div>
          <div v-else-if="verified">
            <Icon name="solar:check-circle-bold" class="text-success" size="5rem" />
            <h1>{{ t("welcome") }}!</h1>
            <p class="m-0">{{ t("email_verified") }}</p>
            <NuxtLink to="/login">{{ t("signin") }}</NuxtLink>
          </div>
          <div v-else>
            <Icon name="solar:close-circle-bold" class="text-danger" size="5rem" />
            <h1>{{ t("error") }}!</h1>
            <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
          </div>
        </Transition>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  beforeRouteLeave (to, from, next) {
    if (to.name === "login") to.meta = from.meta;
    next();
  },
  data () {
    return {
      loaded: false,
      verified: false,
      email: this.$route.params.email,
      token: this.$route.params.token
    };
  },
  async mounted () {
    if (!(this.email && this.token)) return;
    await this.verifyEmail();
    this.loaded = true;
  },
  methods: {
    async verifyEmail () {
      let email = "";
      try {
        email = atob(this.email);
      }
      catch (e) {
        return;
      }
      if (!email) return;
      const user = await $fetch("/api/verify", {
        method: "POST",
        body: {
          email: email,
          token: this.token
        }
      }).catch(() => null);
      if (!user) return;
      this.verified = true;
      this.$route.meta.email = email;
    }
  }
};
</script>
