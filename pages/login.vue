<template>
  <main>
    <section class="banner banner-login d-flex align-items-center justify-content-center wh-100 vh-100">
      <div class="col-11 col-lg-8 m-auto p-3 p-lg-4 bg-body rounded-3 shadow">
        <form class="mb-2">
          <div class="text-center mb-4">
            <h2>{{ SITE.name }}</h2>
          </div>
          <div class="form-floating mb-2">
            <input v-model="form.email" type="email" class="form-control" :placeholder="t('email')" required>
            <label class="form-label">{{ t("email") }}</label>
          </div>
          <div class="form-floating mb-2">
            <input v-model="form.password" type="password" class="form-control" :placeholder="t('password')" required>
            <label class="form-label">{{ t("password") }}</label>
          </div>
          <p>{{ t("forgot_password") }}</p>
          <div class="d-grid">
            <button class="btn btn-primary btn-lg rounded-pill" type="submit">{{ t('signin') }}</button>
          </div>
        </form>
        <p class="m-0">No account? <NuxtLink to="/signup">Create one</NuxtLink></p>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  }
};
</script>
