<script setup>
definePageMeta({ middleware: "authenticated" });
</script>

<template>
  <main>
    <section class="banner banner-login d-flex align-items-center justify-content-center wh-100 vh-100">
      <div class="col-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
        <form class="mb-2" @submit.prevent="signIn()">
          <div class="text-center mb-4">
            <h2>{{ SITE.name }}</h2>
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
              <Transition name="fade" mode="out-in">
                <SpinnerCircle v-if="submit.loading" />
                <span v-else>{{ t("signin") }}</span>
              </Transition>
            </button>
          </div>
        </form>
        <p class="m-0">{{ t("no_account") }} <NuxtLink to="/signup">{{ t("create_one") }}</NuxtLink></p>
        <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
      </div>
    </section>
    {{ $route.meta.email }}
    <ToastMessage v-if="submit.error" :name="SITE.name" :text="t('signin_error')" />
    <ToastMessage v-if="$route.meta.email" :name="SITE.name" :text="t('registered')" success />
  </main>
</template>

<script>
export default {
  data () {
    return {
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
      this.submit.loading = true;
      this.submit.error = false;
      const login = await $fetch("/api/session", {
        method: "POST",
        body: this.form
      }).catch(() => ({}));
      this.submit.loading = false;
      if (!login.user) {
        this.submit.error = true;
        return;
      }
      await useUserSession().fetch();
      this.$router.replace("/app");
    }
  }
};
</script>
