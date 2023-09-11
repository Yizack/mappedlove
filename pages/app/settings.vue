<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

definePageMeta({ layout: "app", middleware: "session" });
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <h3 class="mb-4">{{ t("account") }}</h3>
          <div class="form-floating mb-2">
            <input type="text" class="form-control" :value="user.name" :placeholder="t('name')">
            <label>{{ t("name") }}</label>
          </div>
          <div class="form-floating mb-2">
            <input type="text" class="form-control" :value="user.email" :placeholder="t('email')" readonly>
            <label>{{ t("email") }}</label>
          </div>
          <div class="position-relative mb-2">
            <div class="input-group">
              <span class="input-group-text">
                <Twemoji v-if="country.code" :emoji="$nuxt.$countries.getEmoji(user.country)" size="2rem" />
                <Icon v-else name="solar:magnifer-linear" size="1.5em" />
              </span>
              <div class="form-floating position-relative">
                <input v-model="country.search" type="text" class="form-control" placeholder="Country" @focus="country.focus = true;">
                <label>Country</label>
                <button v-if="country.focus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y p-2 me-2 d-flex" @click="removeCountry()"><Icon name="ic:round-close" size="1.3rem" /></button>
              </div>
            </div>
            <div v-if="country.focus" class="position-relative z-3 mt-2">
              <ul class="select-list position-absolute rounded border bg-body py-2 px-0 shadow w-100 m-0">
                <li v-for="countryOption of countriesFilter" :key="countryOption.code" role="button" class="py-2 px-3" @click="selectCountry(countryOption)">
                  <Twemoji :emoji="countryOption.emoji" class="me-2" size="2rem" png />
                  {{ countryOption.name }}
                </li>
                <li v-if="!countriesFilter.length" class="py-2 px-3"><i>No results found</i></li>
              </ul>
            </div>
          </div>
          <ClientOnly>
            <VueDatePicker v-model="user.birthDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')" @open="datePickerFocus = true" @blur="datePickerFocus = false">
              <template #trigger>
                <div class="form-floating mb-2">
                  <input ref="datepicker" class="form-control bg-body" :class="{ 'focus': datePickerFocus }" :value="user.birthDate ? formatDate(user.birthDate) : ''" readonly>
                  <label>{{ t("birth_date") }}</label>
                </div>
              </template>
            </VueDatePicker>
          </ClientOnly>
        </div>
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <h3 class="mb-4">{{ t("preferences") }}</h3>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input class="form-check-input" type="checkbox" role="switch">
            <label class="form-check-label">{{ t("show_avatar") }}</label>
          </div>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input class="form-check-input" type="checkbox" role="switch">
            <label class="form-check-label">{{ t("dark_mode") }}</label>
          </div>
        </div>
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <h3 class="mb-4">{{ t("change_password") }}</h3>
          <div class="form-floating mb-2">
            <input type="password" class="form-control" :placeholder="t('current_password')" autocomplete="current-password">
            <label>{{ t("current_password") }}</label>
          </div>
          <div class="form-floating mb-2">
            <input type="password" class="form-control" :placeholder="t('new_password')" autocomplete="new-password">
            <label>{{ t("new_password") }}</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" :placeholder="t('confirm_password')" autocomplete="new-password">
            <label>{{ t("confirm_password") }}</label>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  data () {
    return {
      user: useUserSession().user,
      country: {
        code: null,
        search: "",
        focus: false,
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
    }
  }
};
</script>
