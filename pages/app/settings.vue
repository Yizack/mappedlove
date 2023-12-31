<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

definePageMeta({ layout: "app", middleware: "session" });
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <form @submit.prevent="saveAccount">
            <h3 class="mb-4">{{ t("account") }}</h3>
            <div id="image-upload" class="text-center mb-2">
              <input id="avatar" type="file">
              <label for="avatar" class="rounded-circle bg-body-tertiary position-relative overflow-hidden" style="width: 175px; height: 175px;">
                <div class="overlay position-absolute bg-dark w-100 h-100">
                  <div class="d-flex justify-content-center align-items-center h-100 text-light">
                    <Icon name="solar:gallery-add-outline" size="2.5rem" />
                  </div>
                </div>
                <img :src="`https://picsum.photos/seed/${Date.now()}/175`" width="175" height="175" class="img-fluid rounded-circle border border-5" :alt="user.name">
              </label>
            </div>
            <div class="form-floating mb-2">
              <input v-model="user.name" type="text" class="form-control" :placeholder="t('name')" required>
              <label class="d-flex align-items-center gap-1">
                <Icon name="solar:user-circle-linear" />
                <span>{{ t("name") }}</span>
              </label>
            </div>
            <div class="form-floating mb-2">
              <input type="text" class="form-control" :value="user.email" :placeholder="t('email')" readonly>
              <label class="d-flex align-items-center gap-1">
                <Icon name="solar:mailbox-outline" />
                <span>{{ t("email") }}</span>
              </label>
            </div>
            <div class="position-relative mb-2">
              <div class="input-group">
                <span class="input-group-text">
                  <Twemoji v-if="country.code" :emoji="$nuxt.$countries.getEmoji(user.country)" size="2rem" />
                  <Icon v-else name="solar:magnifer-linear" size="1.5em" />
                </span>
                <div class="form-floating position-relative">
                  <input v-model="country.search" type="text" class="form-control" placeholder="Country" @focus="country.focus = true;">
                  <label class="d-flex align-items-center gap-1">
                    <Icon name="solar:planet-3-linear" />
                    <span>{{ t("country_or_territory") }}</span>
                  </label>
                  <button v-if="country.focus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y p-2 me-2 d-flex" @click="removeCountry()"><Icon name="ic:round-close" size="1.3rem" /></button>
                </div>
              </div>
              <div v-if="country.focus" class="position-relative z-3 mt-2">
                <ul class="select-list position-absolute rounded border bg-body py-2 px-0 shadow w-100 m-0">
                  <li v-for="countryOption of countriesFilter" :key="countryOption.code" role="button" class="py-2 px-3" @click="selectCountry(countryOption)">
                    <Twemoji :emoji="countryOption.emoji" class="me-2" size="2rem" png />
                    {{ countryOption.name }}
                  </li>
                  <li v-if="!countriesFilter.length" class="py-2 px-3"><i>{{ t("no_results") }}</i></li>
                </ul>
              </div>
            </div>
            <ClientOnly>
              <VueDatePicker v-model="user.birthDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')" model-type="timestamp" @open="datePickerFocus = true" @blur="datePickerFocus = false">
                <template #trigger>
                  <div class="form-floating mb-2">
                    <input ref="datepicker" class="form-control bg-body" :class="{ 'focus': datePickerFocus }" :value="user.birthDate ? formatDate(user.birthDate) : ''" readonly>
                    <label class="d-flex align-items-center gap-1">
                      <Icon name="solar:confetti-minimalistic-line-duotone" />
                      <span>{{ t("birth_date") }}</span>
                    </label>
                  </div>
                </template>
              </VueDatePicker>
            </ClientOnly>
            <div class="d-grid">
              <button class="btn btn-primary btn-lg rounded-pill" :disabled="submit.loading" type="submit">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("save") }}</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <h3 class="mb-4">{{ t("preferences") }}</h3>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input v-model="user.showAvatar" class="form-check-input" type="checkbox" role="switch" @change="showAvatar">
            <label class="form-check-label">{{ t("show_avatar") }}</label>
          </div>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input v-model="dark" class="form-check-input" type="checkbox" role="switch" @change="changeColorMode">
            <label class="form-check-label">{{ t("dark_mode") }}</label>
          </div>
        </div>
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <form @submit.prevent="changePassword">
            <h3 class="mb-4">{{ t("change_password") }}</h3>
            <div class="form-floating mb-2">
              <input type="password" class="form-control" :placeholder="t('current_password')" autocomplete="current-password">
              <label>{{ t("current_password") }}</label>
            </div>
            <div class="form-floating mb-2">
              <input type="password" class="form-control" :placeholder="t('new_password')" autocomplete="new-password">
              <label>{{ t("new_password") }}</label>
            </div>
            <div class="form-floating mb-2">
              <input type="password" class="form-control" :placeholder="t('confirm_password')" autocomplete="new-password">
              <label>{{ t("confirm_password") }}</label>
            </div>
            <div class="d-grid">
              <button class="btn btn-primary btn-lg rounded-pill" type="submit">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("change_password") }}</span>
                </Transition>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  data () {
    return {
      session: useUserSession().user,
      dark: this.$nuxt.$colorMode.preference === "dark",
      user: {
        name: "",
        email: "",
        country: null as string | null,
        birthDate: null as number | null,
        showAvatar: false,
        current_password: "",
        new_password: "",
        confirm_password: ""
      },
      country: {
        code: null as string | null,
        search: "",
        focus: false,
      },
      submit: {
        pass_loading: false,
        loading: false,
        error: false
      },
      datePickerFocus: false
    };
  },
  computed: {
    countriesFilter () {
      return this.$nuxt.$countries.getAll().filter((country) => {
        const normalized_input = normalize(this.country.search.toLocaleLowerCase());
        const normalized_name = normalize(country.name.toLocaleLowerCase());
        const wordsMatch = normalized_input.split(" ").map(char => normalized_name.includes(char)).every(Boolean);
        if (wordsMatch) return country;
        return false;
      });
    }
  },
  created () {
    Object.assign(this.user, this.session);
    this.user.showAvatar = Boolean(this.user.showAvatar);
    this.country.search = this.$nuxt.$countries.getName(this.user.country);
    this.country.code = this.user.country;
  },
  methods: {
    removeCountry () {
      this.country.focus = false;
      this.country.search = "";
      this.country.code = null;
      this.user.country = null;
    },
    selectCountry (country: any) {
      this.country.focus = false;
      this.country.search = country.name;
      this.country.code = country.code;
      this.user.country = country.code;
    },
    async saveAccount () {
      this.submit.loading = true;
      const account = await $fetch("/api/account", {
        method: "PATCH",
        body: {
          name: this.user.name,
          country: this.user.country,
          birthDate: this.user.birthDate
        }
      }).catch(() => null);
      this.submit.loading = false;
      if (!account) return;

      Object.assign(this.session, this.user);
      this.$nuxt.$toasts.add({ message: t("account_saved"), success: true });
    },
    async showAvatar () {
      const account = await $fetch("/api/account", {
        method: "PATCH",
        body: {
          showAvatar: this.user.showAvatar
        }
      }).catch(() => null);
      if (!account) return;

      Object.assign(this.session, this.user);
      this.$nuxt.$toasts.add({ message: t("account_saved"), success: true });
    },
    changeColorMode () {
      this.$nuxt.$colorMode.preference = this.dark ? "dark" : "light";
    },
    async changePassword () {
      this.submit.pass_loading = true;
      const account = await $fetch("/api/account/password", {
        method: "PATCH",
        body: {
          current_password: this.user.current_password,
          new_password: this.user.new_password
        }
      }).catch(() => null);
      this.submit.pass_loading = false;
      if (!account) return;
      this.$nuxt.$toasts.add({ message: t("password_saved"), success: true });
    }
  }
};
</script>
