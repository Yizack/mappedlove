<script setup lang="ts">
definePageMeta({ layout: "access", middleware: "authenticated" });
</script>

<template>
  <main>
    <section>
      <div class="col-11 col-lg-8 m-auto px-3 py-4 px-lg-4 bg-body rounded-3 shadow">
        <Transition name="tab" mode="out-in">
          <div v-if="!needsConfirm">
            <form class="mb-2" novalidate @submit.prevent="signUp()">
              <div class="text-center mb-4">
                <h2>{{ SITE.name }}</h2>
                <p class="m-0">{{ t("create_account") }}</p>
              </div>
              <div class="form-floating mb-2">
                <input v-model.trim="form.name" type="text" class="form-control" :class="{'is-valid': isNameValid}" :placeholder="t('name')" autocomplete="given-name" required>
                <label class="form-label">{{ t("name") }}</label>
              </div>
              <div class="form-floating mb-2 position-relative">
                <input v-model="form.email" type="email" class="form-control" :class="{'is-valid': isEmailValid, 'is-invalid': submit.exists}" :placeholder="t('email')" autocomplete="email" required @input="submit.exists = false">
                <label class="form-label">{{ t("email") }}</label>
                <div v-if="submit.exists" class="invalid-tooltip">
                  {{ t("email_conflict") }}
                </div>
              </div>
              <div class="form-floating mb-2">
                <input v-model="form.password" type="password" class="form-control" :class="{'is-valid': isPasswordValid}" :placeholder="t('password')" autocomplete="new-password" required>
                <label class="form-label">{{ t("password") }}</label>
              </div>
              <div class="form-floating mb-2">
                <input v-model="form.password_check" type="password" class="form-control" :class="{'is-valid': isPasswordCheckValid}" :placeholder="t('password_confirm')" autocomplete="off" required>
                <label class="form-label">{{ t("password_confirm") }}</label>
              </div>
              <div class="text-center my-3 my-md-0">
                <NuxtTurnstile ref="turnstile" v-model="form.turnstile" />
              </div>
              <div class="d-grid">
                <button class="btn btn-primary btn-lg rounded-pill" type="submit" :disabled="submit.loading">
                  <Transition name="tab" mode="out-in">
                    <SpinnerCircle v-if="submit.loading" />
                    <span v-else>{{ t("signup") }}</span>
                  </Transition>
                </button>
              </div>
            </form>
            <p class="m-0">{{ t("has_account") }} <NuxtLink to="/login">{{ t("signin") }}</NuxtLink></p>
            <NuxtLink to="/">{{ t("go_home") }}</NuxtLink>
          </div>
          <div v-else class="text-center">
            <Icon name="solar:mailbox-bold" class="text-primary" size="5rem" />
            <h1>{{ t("verify_email") }}!</h1>
            <p class="m-0">{{ t("verify_email_info") }}</p>
          </div>
        </Transition>
      </div>
    </section>
    <ToastMessage v-if="submit.error" :text="t('error')" @dispose="submit.error = false" />
  </main>
</template>

<script lang="ts">
export default {
  data () {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_check: "",
        turnstile: ""
      },
      submit: {
        loading: false,
        exists: false,
        error: false
      },
      needsConfirm: false
    };
  },
  computed: {
    isNameValid () {
      return this.form.name.length > 0 && this.form.name.length <= 50;
    },
    isPasswordValid () {
      return this.form.password.length >= 8;
    },
    isPasswordCheckValid () {
      return this.isPasswordValid && this.form.password === this.form.password_check;
    },
    isEmailValid () {
      return this.form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  },
  methods: {
    async signUp () {
      if (!(this.isNameValid && this.isEmailValid && this.isPasswordValid && this.isPasswordCheckValid)) return;

      this.submit.loading = true;
      const req = await $fetch("/api/signup", { method: "POST", body: this.form }).catch(() => null);
      this.submit.loading = false;

      if (!req) {
        this.submit.error = true;
        // @ts-ignore
        this.$refs.turnstile.reset();
        return;
      }

      if (!("user" in req)) {
        this.submit.exists = true;
        // @ts-ignore
        this.$refs.turnstile.reset();
        return;
      }
      this.needsConfirm = true;
    }
  }
};
</script>
