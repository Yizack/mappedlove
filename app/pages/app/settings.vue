<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { user, clear } = useUserSession() as MappedLoveSessionComposable;
const { $colorMode, $countries, $toasts } = useNuxtApp();

const dark = ref($colorMode.preference === "dark");
const userForm = ref({
  name: "",
  email: "",
  country: null as string | null,
  birthDate: null as number | null,
  showAvatar: false,
  current_password: "",
  new_password: "",
  confirm_password: ""
});

const submit = ref({ loading: false, pass_loading: false, error: false });
const datePickerFocus = ref(false);
const dangerZone = ref(false);

Object.assign(userForm.value, user.value);
userForm.value.showAvatar = Boolean(user.value.showAvatar);

const country = ref({
  code: userForm.value.country,
  search: $countries.getName(userForm.value.country),
  focus: false
});

const countriesFilter = computed(() => {
  return $countries.getAll().filter((c) => {
    const normalizedInput = normalize(country.value.search.toLocaleLowerCase());
    const normalizedName = normalize(c.name.toLocaleLowerCase());
    const wordsMatch = normalizedInput.split(" ").map(char => normalizedName.includes(char)).every(Boolean);
    if (wordsMatch) return c;
    return false;
  });
});

const removeCountry = () => {
  country.value.focus = false;
  country.value.search = "";
  country.value.code = null;
  userForm.value.country = null;
};

const selectCountry = (c: { name: string, code: string }) => {
  country.value.focus = false;
  country.value.search = c.name;
  country.value.code = c.code;
  userForm.value.country = c.code;
};

const saveAccount = async () => {
  submit.value.loading = true;
  const account = await $fetch("/api/account", {
    method: "PATCH",
    body: {
      name: userForm.value.name,
      country: userForm.value.country,
      birthDate: userForm.value.birthDate
    }
  }).catch(() => null);
  submit.value.loading = false;
  if (!account) return;
  user.value.name = account.name;
  user.value.country = account.country;
  user.value.birthDate = account.birthDate;
  user.value.updatedAt = account.updatedAt;
  $toasts.add({ message: t("account_saved") });
};

const showAvatar = async () => {
  const account = await $fetch("/api/account", {
    method: "PATCH",
    body: {
      showAvatar: userForm.value.showAvatar
    }
  }).catch(() => null);
  if (!account) return;
  user.value.showAvatar = account.showAvatar;
  $toasts.add({ message: t("account_saved") });
};

const changeColorMode = () => {
  $colorMode.preference = dark.value ? "dark" : "light";
};

const changePassword = async () => {
  if (!(isPasswordValid(userForm.value.current_password) && isPasswordCheckValid(userForm.value.new_password, userForm.value.confirm_password))) return;
  submit.value.pass_loading = true;
  const account = await $fetch("/api/account/password", {
    method: "PATCH",
    body: {
      current_password: userForm.value.current_password,
      new_password: userForm.value.new_password
    }
  }).catch(() => null);
  submit.value.pass_loading = false;
  if (!account) return;
  $toasts.add({ message: t("password_changed") });
};

const setupPassword = async () => {
  if (!(isPasswordValid(userForm.value.new_password) && isPasswordCheckValid(userForm.value.new_password, userForm.value.confirm_password))) return;
  submit.value.pass_loading = true;
  const account = await $fetch("/api/account/password", {
    method: "POST",
    body: {
      new_password: userForm.value.new_password
    }
  }).catch(() => null);
  submit.value.pass_loading = false;
  if (!account) return;
  user.value.auth = undefined;
  userForm.value.new_password = "";
  userForm.value.confirm_password = "";
  $toasts.add({ message: t("password_setup") });
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
    target.value = "";
  };

  if (!file.value) return;
  const formData = new FormData();
  formData.append("file", file.value);
  const account = await $fetch("/api/account/avatar", {
    method: "POST",
    body: formData
  }).catch(() => null);
  if (!account) {
    imageRead.value = "";
    fileChosen.value = false;
    return;
  }
  user.value.showAvatar = 1;
  userForm.value.showAvatar = true;
  user.value.updatedAt = account.updatedAt;
  $toasts.add({ message: t("avatar_saved") });
};

const deleteAvatar = async () => {
  if (!confirm(t("delete_avatar_confirm"))) return;
  const account = await $fetch("/api/account/avatar", {
    method: "DELETE"
  }).catch(() => null);
  if (!account) return;
  user.value.showAvatar = 0;
  userForm.value.showAvatar = false;
  fileChosen.value = false;
  user.value.updatedAt = account.updatedAt;
  imageRead.value = "";
  $toasts.add({ message: t("avatar_deleted") });
};

const deleteAccount = async () => {
  if (!confirm(t("delete_account_confirm"))) return;
  submit.value.loading = true;
  const account = await $fetch("/api/account", {
    method: "DELETE"
  }).catch(() => null);
  submit.value.loading = false;
  if (!account) return;
  await clear();
  navigateTo("/");
};

useSeo({
  title: `${t("settings")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <div class="row">
      <div class="col-lg-8 col-xl-6 mx-auto">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
          <form @submit.prevent="saveAccount">
            <h3 class="mb-4">{{ t("account") }}</h3>
            <div class="image-upload text-center mb-2">
              <input id="avatar" type="file" accept=".png,.jpg,.jpeg,.jfif,.webp,.gif" @change="uploadAvatar">
              <label for="avatar" class="rounded-circle bg-body-tertiary position-relative overflow-hidden border border-5" :class="{ 'scale-hover': user.showAvatar }" style="width: 175px; height: 175px;">
                <div class="overlay position-absolute bg-dark w-100 h-100">
                  <div class="d-flex justify-content-center align-items-center h-100 text-light">
                    <Icon name="solar:gallery-add-outline" size="2.5rem" />
                  </div>
                </div>
                <img v-if="imageRead" :src="imageRead.toString()" width="175" height="175" class="img-fluid w-100" :alt="userForm.name">
                <img v-else-if="user.showAvatar && user.hash" :src="`${getAvatarImage(user.hash)}?updated=${user.updatedAt}`" width="175" height="175" class="img-fluid w-100" :alt="user.name">
                <img v-else-if="!fileChosen" :src="getDefaultAvatar(user.id)" width="175" height="175" class="img-fluid w-100" :alt="userForm.name">
              </label>
              <div v-if="user.showAvatar" class="text-center">
                <a role="button" class="text-primary" @click="deleteAvatar">{{ t("delete_avatar") }}</a>
              </div>
            </div>
            <div class="form-floating mb-2">
              <input v-model="userForm.name" type="text" class="form-control" :placeholder="t('name')" required>
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
                  <Twemoji v-if="country.code" :emoji="$countries.getEmoji(userForm.country)" size="2rem" />
                  <Icon v-else name="solar:magnifer-linear" size="1.5em" />
                </span>
                <div class="form-floating position-relative">
                  <input v-model="country.search" type="text" class="form-control" placeholder="Country" @focus="country.focus = true;">
                  <label class="d-flex align-items-center gap-1">
                    <Icon name="solar:planet-3-linear" />
                    <span>{{ t("country_or_territory") }}</span>
                  </label>
                  <button v-if="country.focus" type="button" class="btn btn-danger position-absolute end-0 top-50 translate-middle-y p-2 me-2 d-flex" @click="removeCountry()"><Icon name="tabler:x" size="1.3rem" /></button>
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
              <VueDatePicker v-model="userForm.birthDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')" model-type="timestamp" :dark="$colorMode.preference === 'dark'" @open="datePickerFocus = true" @blur="datePickerFocus = false">
                <template #trigger>
                  <div class="form-floating mb-2">
                    <input ref="datepicker" class="form-control bg-body" :class="{ focus: datePickerFocus }" :value="userForm.birthDate ? formatDate(userForm.birthDate) : ''" @keyup="$e => { userForm.birthDate = $e.code === 'Backspace' ? null : userForm.birthDate }">
                    <label class="d-flex align-items-center gap-1">
                      <Icon name="solar:confetti-minimalistic-line-duotone" />
                      <span>{{ t("birth_date") }}</span>
                    </label>
                  </div>
                </template>
              </VueDatePicker>
            </ClientOnly>
            <CopyText class="mb-2" :text="user.id.toString()" :placeholder="t('mappedlove_id')" floating />
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
            <input v-model="userForm.showAvatar" class="form-check-input" type="checkbox" role="switch" @change="showAvatar">
            <label class="form-check-label">{{ t("show_avatar") }}</label>
          </div>
          <div class="form-check form-switch d-flex gap-2 align-items-center">
            <input v-model="dark" class="form-check-input" type="checkbox" role="switch" @change="changeColorMode">
            <label class="form-check-label">{{ t("dark_mode") }}</label>
          </div>
        </div>
        <Transition name="tab" mode="out-in">
          <div v-if="!user.auth" class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
            <form @submit.prevent="changePassword">
              <h3 class="mb-4">{{ t("change_password") }}</h3>
              <input :value="userForm.email" type="text" autocomplete="email" hidden>
              <div class="form-floating mb-2">
                <input v-model="userForm.current_password" type="password" class="form-control" :placeholder="t('current_password')" autocomplete="current-password">
                <label>{{ t("current_password") }}</label>
              </div>
              <div class="form-floating mb-2">
                <input v-model="userForm.new_password" type="password" class="form-control" :class="isPasswordValid(userForm.new_password) ? 'is-valid' : userForm.new_password ? 'is-invalid' : ''" :placeholder="t('new_password')" autocomplete="new-password">
                <label>{{ t("new_password") }}</label>
              </div>
              <div class="form-floating mb-2">
                <input v-model="userForm.confirm_password" type="password" class="form-control" :class="isPasswordCheckValid(userForm.new_password, userForm.confirm_password) ? 'is-valid' : userForm.confirm_password ? 'is-invalid' : ''" :placeholder="t('password_confirm')" autocomplete="new-password">
                <label>{{ t("password_confirm") }}</label>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary btn-lg rounded-pill" type="submit">
                  <Transition name="tab" mode="out-in">
                    <SpinnerCircle v-if="submit.pass_loading" class="text-white" />
                    <span v-else>{{ t("change_password") }}</span>
                  </Transition>
                </button>
              </div>
            </form>
          </div>
          <div v-else class="bg-body rounded-3 px-3 py-4 p-lg-4 mb-2">
            <form @submit.prevent="setupPassword">
              <h3 class="mb-4">{{ t("setup_password") }}</h3>
              <input :value="userForm.email" type="text" autocomplete="email" hidden>
              <div class="form-floating mb-2">
                <input v-model="userForm.new_password" type="password" class="form-control" :class="isPasswordValid(userForm.new_password) ? 'is-valid' : userForm.new_password ? 'is-invalid' : ''" :placeholder="t('new_password')" autocomplete="new-password">
                <label>{{ t("new_password") }}</label>
              </div>
              <div class="form-floating mb-2">
                <input v-model="userForm.confirm_password" type="password" class="form-control" :class="isPasswordCheckValid(userForm.new_password, userForm.confirm_password) ? 'is-valid' : userForm.confirm_password ? 'is-invalid' : ''" :placeholder="t('password_confirm')" autocomplete="new-password">
                <label>{{ t("password_confirm") }}</label>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary btn-lg rounded-pill" type="submit">
                  <Transition name="tab" mode="out-in">
                    <SpinnerCircle v-if="submit.pass_loading" class="text-white" />
                    <span v-else>{{ t("setup_password") }}</span>
                  </Transition>
                </button>
              </div>
            </form>
          </div>
        </Transition>
        <Transition name="tab" mode="out-in">
          <div v-if="!dangerZone" class="bg-body rounded-3 px-3 py-4 p-lg-4 position-relative mb-2" role="button" @click="dangerZone = !dangerZone">
            <div class="position-relative">
              <h5 class="mb-0 text-center">{{ t("danger_zone") }}</h5>
              <Icon name="solar:alt-arrow-right-outline" size="2rem" class="position-absolute end-0 translate-middle-y top-50" />
            </div>
          </div>
          <div v-else class="bg-body rounded-3 px-3 py-4 p-lg-4">
            <h3 class="mb-4">{{ t("danger_zone") }}</h3>
            <h5>{{ t("delete_account") }}</h5>
            <p>{{ t("delete_account_info") }}</p>
            <div class="d-grid">
              <button class="btn btn-danger btn-lg rounded-pill" @click="deleteAccount">
                <Transition name="tab" mode="out-in">
                  <SpinnerCircle v-if="submit.loading" class="text-white" />
                  <span v-else>{{ t("delete_account") }}</span>
                </Transition>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </main>
</template>
