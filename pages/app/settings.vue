<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

definePageMeta({ layout: "app", middleware: "session" });

const { user: session, fetch: sessionFetch } = useUserSession();
const { $colorMode, $countries, $toasts } = useNuxtApp();

const existsAvatar = useState("existsAvatar", () => false);

const requestAvatar = async () => {
  if (existsAvatar.value) return;
  const fetchAvatar = await $fetch(`${getAvatarImage(session.value.id)}?updated=${session.value.updatedAt}`, {
    method: "GET",
    onResponseError: () => undefined
  }).catch(() => null);
  if (fetchAvatar) existsAvatar.value = true;
};

await requestAvatar();

const dark = ref($colorMode.preference === "dark");
const user = ref({
  name: "",
  email: "",
  country: null as string | null,
  birthDate: null as number | null,
  showAvatar: false,
  current_password: "",
  new_password: "",
});

const country = ref({
  code: null as string | null,
  search: "",
  focus: false,
});

const submit = ref({ loading: false, pass_loading: false, error: false });
const datePickerFocus = ref(false);

Object.assign(user.value, session.value);
user.value.showAvatar = Boolean(user.value.showAvatar);

const countriesFilter = computed(() => {
  return $countries.getAll().filter((c) => {
    const normalized_input = normalize(country.value.search.toLocaleLowerCase());
    const normalized_name = normalize(c.name.toLocaleLowerCase());
    const wordsMatch = normalized_input.split(" ").map(char => normalized_name.includes(char)).every(Boolean);
    if (wordsMatch) return c;
    return false;
  });
});

const removeCountry = () => {
  country.value.focus = false;
  country.value.search = "";
  country.value.code = null;
  user.value.country = null;
};

const selectCountry = (c: any) => {
  country.value.focus = false;
  country.value.search = c.name;
  country.value.code = c.code;
  user.value.country = c.code;
};

const saveAccount = async () => {
  submit.value.loading = true;
  const account = await $fetch("/api/account", {
    method: "PATCH",
    body: {
      name: user.value.name,
      country: user.value.country,
      birthDate: user.value.birthDate,
    },
  }).catch(() => null);
  submit.value.loading = false;
  if (!account) return;
  await sessionFetch();
  $toasts.add({ message: t("account_saved"), success: true });
};

const showAvatar = async () => {
  const account = await $fetch("/api/account", {
    method: "PATCH",
    body: {
      showAvatar: user.value.showAvatar,
    },
  }).catch(() => null);
  if (!account) return;
  await sessionFetch();
  $toasts.add({ message: t("account_saved"), success: true });
};

const changeColorMode = () => {
  $colorMode.preference = dark.value ? "dark" : "light";
};

const changePassword = async () => {
  submit.value.pass_loading = true;
  const account = await $fetch("/api/account/password", {
    method: "PATCH",
    body: {
      current_password: user.value.current_password,
      new_password: user.value.new_password,
    },
  }).catch(() => null);
  submit.value.pass_loading = false;
  if (!account) return;
  $toasts.add({ message: t("password_saved"), success: true });
};

const imageRead = ref<string | ArrayBuffer>();
const fileChosen = ref(false);
const file = ref<File>();

const uploadAvatar = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files ? target.files[0] : undefined;
  if (!file.value) {
    imageRead.value = "";
    fileChosen.value = false;
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = () => {
    imageRead.value = reader.result || "";
    fileChosen.value = true;
  };

  if (!file.value) return;
  const formData = new FormData();
  formData.append("file", file.value);
  const account = await $fetch("/api/account/avatar", {
    method: "POST",
    body: formData,
  }).catch(() => null);
  if (!account) return;
  await sessionFetch();
  $toasts.add({ message: t("avatar_saved"), success: true });
};

const deleteAvatar = async () => {
  if (!confirm(t("delete_avatar_confirm"))) return;
  const account = await $fetch("/api/account/avatar", {
    method: "DELETE",
  }).catch(() => null);
  if (!account) return;
  existsAvatar.value = false;
  await sessionFetch();
  $toasts.add({ message: t("avatar_deleted"), success: true });
};
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <form @submit.prevent="saveAccount">
            <h3 class="mb-4">{{ t("account") }}</h3>
            <div id="image-upload" class="text-center mb-2">
              <input id="avatar" type="file" accept=".png,.jpg,.jpeg,.jfif,.webp,.gif" @change="uploadAvatar">
              <label for="avatar" class="rounded-circle bg-body-tertiary position-relative overflow-hidden border border-5" style="width: 175px; height: 175px;">
                <div class="overlay position-absolute bg-dark w-100 h-100">
                  <div class="d-flex justify-content-center align-items-center h-100 text-light">
                    <Icon name="solar:gallery-add-outline" size="2.5rem" />
                  </div>
                </div>
                <img v-if="!existsAvatar && !fileChosen" :src="getAvatarImage(session.id, true)" width="175" height="175" class="img-fluid w-100" :alt="user.name">
                <img v-else-if="existsAvatar && !fileChosen" :src="`${getAvatarImage(session.id)}?updated=${session.updatedAt}`" width="175" height="175" class="img-fluid w-100" :alt="user.name">
                <img v-else-if="imageRead" :src="imageRead.toString()" width="175" height="175" class="img-fluid w-100" :alt="user.name">
              </label>
              <div v-if="existsAvatar || fileChosen" class="text-center">
                <a role="button" class="text-primary" @click="deleteAvatar">{{ t("delete_avatar") }}</a>
              </div>
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
