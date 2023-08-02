<script setup lang="ts">
definePageMeta({ layout: "access", middleware: "authenticated" });
</script>

<template>
  <main>
    <section>
      <div class="col-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
        <form class="mb-2" @submit.prevent="signIn()">
          <div class="text-center mb-4">
            <h2 class="d-flex align-items-center gap-1 justify-content-center">
              <Icon class="text-primary" name="solar:map-point-favourite-bold" />
              {{ SITE.name }}
            </h2>
          </div>
          <div class="form-floating mb-2">
            <input v-model="form.email" type="email" class="form-control" :placeholder="t('email')" autocomplete="email" :class="{'is-invalid': submit.error}" required>
            <label class="form-label">{{ t("email") }}</label>
          </div>
          <div class="form-floating mb-2">
            <input v-model="form.password" type="password" class="form-control" :placeholder="t('password')" autocomplete="current-password" :class="{'is-invalid': submit.error}" required>
            <label class="form-label">{{ t("password") }}</label>
          </div>
          <div class="mb-2">
            <NuxtLink to="/account">{{ t("forgot_password") }}</NuxtLink>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
              <Transition name="tab" mode="out-in">
                <SpinnerCircle v-if="submit.loading" class="text-white" />
                <span v-else>{{ t("signin") }}</span>
              </Transition>
            </button>
          </div>
        </form>
        <div v-if="needsConfirm && !resent" class="alert alert-warning" role="alert">
          <p class="m-0">{{ t("verify_needed") }}</p>
          <a class="text-decoration-underline text-body" role="button" @click="resendVerification">{{ t("resend_verification") }}</a>
        </div>
        <p class="m-0">
          {{ t("no_account") }}
          <NuxtLink to="/signup">{{ t("create_one") }}</NuxtLink>
        </p>
        <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
      </div>
    </section>
    <ToastMessage v-if="submit.error" :text="t('signin_error')" @dispose="submit.error = false" />
    <ToastMessage v-if="$route.meta.email" :text="t('registered')" success />
    <ToastMessage v-if="resent" :text="t('resent_verification')" success />
  </main>
</template>

<script lang="ts">
export default {
  data () {
    return {
      needsConfirm: false,
      resent: false,
      submit: {
        loading: false,
        error: false
      },
      form: {
        email: this.$route.meta.email || "",
        password: ""
      }
    };
  },
  methods: {
    async signIn () {
      this.resent = false;
      this.submit.loading = true;
      const login = await $fetch("/api/session", {
        method: "POST",
        body: this.form
      }).catch(() => null);
      this.submit.loading = false;
      if (!login) {
        this.submit.error = true;
        return;
      }

      const { confirmed } = login.user;
      this.needsConfirm = Boolean(!confirmed);
      if (!confirmed) return;
      await useUserSession().fetch();
      this.$router.replace("/app");
    },
    async resendVerification () {
      this.resent = true;
      const resend = await $fetch("/api/verify/resend", {
        method: "POST",
        body: { email: this.form.email }
      }).catch(() => null);

      if (!resend) return;
    }
  }
};
</script>
