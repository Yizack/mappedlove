<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const props = defineProps({
  bond: {
    type: Object as () => MappedLoveBond,
    required: true,
  }
});

const { $toasts, $bootstrap } = useNuxtApp();

const existsAvatar1 = useState("existsAvatar1", () => false);
const existsAvatar2 = useState("existsAvatar2", () => false);

const deleteButton = ref(false);
const coupleDate = ref(props.bond.coupleDate ? new Date(props.bond.coupleDate) : undefined);
const cacheDate = ref<Date>();
const publicBond = ref(Boolean(props.bond.public));

const partner1 = computed(() => props.bond.partner1 as MappedLovePartner);
const partner2 = computed(() => props.bond.partner2 as MappedLovePartner);

const requestAvatar1 = async () => {
  if (existsAvatar1.value || !partner1.value.showAvatar) return;
  const fetchAvatar = await $fetch(`${getAvatarImage(partner1.value.id)}?updated=`, {
    method: "GET",
    onResponseError: () => undefined
  }).catch(() => null);
  if (fetchAvatar) existsAvatar1.value = true;
};

const requestAvatar2 = async () => {
  if (existsAvatar2.value || !partner2.value.showAvatar) return;
  const fetchAvatar = await $fetch(`${getAvatarImage(partner2.value.id)}?updated=`, {
    method: "GET",
    onResponseError: () => undefined
  }).catch(() => null);
  if (fetchAvatar) existsAvatar2.value = true;
};

await requestAvatar1();
await requestAvatar2();

const togetherFor = computed(() => getTogetherFor(coupleDate.value));
const publicURL = computed(() => `${SITE.host}/map/${props.bond.code}`);

const deleteDate = () => {
  if (!confirm(t("delete_anniversary"))) return;
  coupleDate.value = undefined;
};

const changePrivacy = async () => {
  if (publicBond.value && !confirm(t("public_bond_confirm"))) {
    publicBond.value = false;
    return;
  }

  const bond = await $fetch("/api/bond", {
    method: "PATCH",
    body: {
      public: Number(publicBond.value),
    },
  }).catch(() => null);
  if (!bond) return;
  $toasts.add({ message: t("bond_preferences_update"), success: true });
};

onMounted(() => {
  cacheDate.value = coupleDate.value;
  $bootstrap.initializePopover();
});

watch(coupleDate, async (val: Date | undefined) => {
  if (cacheDate.value?.getTime() === val?.getTime()) return;
  const bond = await $fetch("/api/bond", {
    method: "PATCH",
    body: {
      coupleDate: val ? val.getTime() : null,
    },
  }).catch(() => null);
  cacheDate.value = val;
  if (!bond) return;
  $toasts.add({ message: t("anniversary_update"), success: true });
});
</script>

<template>
  <div class="row">
    <div class="col-lg-8 col-xl-6 mx-auto">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
        <div class="position-relative d-flex justify-content-center py-4">
          <div class="text-center position-relative">
            <div id="image-upload" class="text-center mb-2">
              <label for="avatar" class="rounded-circle bg-body-tertiary position-relative overflow-hidden border border-5 m-0 mx-md-3 mx-lg-4" style="width: 175px; height: 175px;">
                <img v-if="!existsAvatar1" :src="getAvatarImage(partner1.id, true)" width="175" height="175" class="img-fluid" :alt="partner2.name">
                <img v-else :src="`${getAvatarImage(partner1.id)}?updated=`" width="175" height="175" class="img-fluid" :alt="partner2.name">
              </label>
            </div>
            <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner1.name }}</h4>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle z-1 bond-heart d-flex shadow rounded-circle bg-body border border-5 border">
            <Icon name="solar:hearts-bold-duotone" class="img-fluid p-2 p-lg-3 text-primary" />
          </div>
          <div class="text-center position-relative">
            <label for="avatar" class="rounded-circle bg-body-tertiary position-relative overflow-hidden border border-5 m-0 mx-md-3 mx-lg-4" style="width: 175px; height: 175px;">
              <img v-if="!existsAvatar2" :src="getAvatarImage(partner2.id, true)" width="175" height="175" class="img-fluid" :alt="partner2.name">
              <img v-else :src="`${getAvatarImage(partner2.id)}?updated=`" width="175" height="175" class="img-fluid" :alt="partner2.name">
              <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner2.name }}</h4>
            </label>
          </div>
        </div>
        <div class="mt-5">
          <Transition name="tab" mode="out-in">
            <div v-if="!coupleDate">
              <ClientOnly>
                <VueDatePicker v-model="coupleDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')">
                  <template #trigger>
                    <div class="p-2 border rounded-3 hover" role="button">
                      <div class="d-flex align-items-center justify-content-center gap-1">
                        <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                        <strong>{{ t("add_anniversary") }}</strong>
                      </div>
                    </div>
                  </template>
                </VueDatePicker>
              </ClientOnly>
            </div>
            <div v-else>
              <div class="p-2 d-flex gap-3 border rounded-3 mb-2 position-relative" @mouseenter="deleteButton = true" @mouseleave="deleteButton = false">
                <div class="rounded-3 bg-secondary d-flex align-items-center justify-content-center" :style="{ width: '4.375rem', height: '4.375rem' }">
                  <div class="text-primary text-center">
                    <h4 class="m-0 fw-bold">{{ coupleDate.getDate() }}</h4>
                    <span class="fw-bold">{{ getMonth(coupleDate, "short") }}</span>
                  </div>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-1">
                    <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                    <h5 class="m-0">{{ t("anniversary") }}</h5>
                  </div>
                  <p class="m-0">{{ untilNextAnniversary(coupleDate) }}</p>
                </div>
                <Transition name="fade">
                  <div v-if="deleteButton" class="position-absolute top-0 end-0 m-2 d-flex flex-column">
                    <button class="btn btn-sm border-0" :title="t('delete')" @click="deleteDate">
                      <Icon name="solar:trash-bin-trash-linear" size="1.5rem" class="text-danger" />
                    </button>
                    <ClientOnly>
                      <VueDatePicker v-model="coupleDate" :format="'yyyy-MM-dd'" :enable-time-picker="false" :locale="t('lang_code')">
                        <template #trigger>
                          <button class="btn btn-sm border-0" :title="t('delete')">
                            <Icon name="solar:pen-outline" size="1.5rem" />
                          </button>
                        </template>
                      </VueDatePicker>
                    </ClientOnly>
                  </div>
                </Transition>
              </div>
              <div class="p-2 bg-secondary rounded-3 shadow-sm">
                <h4 class="text-center">{{ t("together_for") }}</h4>
                <div class="text-center d-flex gap-2 gap-lg-5 p-0 px-lg-5">
                  <div v-for="(field, key) in togetherFor" :key="key" class="bg-body py-3 rounded-3 flex-fill">
                    <h4 class="m-0 fw-bold">{{ field }}</h4>
                    <span>{{ t(key) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div class="mt-2 bg-body rounded-3 px-3 py-4 p-lg-4">
        <h3>{{ t("bond_preferences") }}</h3>
        <div class="form-check form-switch d-flex gap-2 align-items-center">
          <input v-model="publicBond" class="form-check-input" type="checkbox" role="switch" @change="changePrivacy">
          <label class="form-check-label">{{ t("public_bond") }}</label>
          <Icon name="solar:question-circle-linear" class="text-primary outline-none" role="button" size="1.3rem" data-bs-toggle="popover" :data-bs-content="t('public_bond_info')" />
        </div>
        <div v-if="publicBond" class="mt-2">
          <p class="m-0">{{ t("share_bond_info") }}</p>
          <CopyText :text="publicURL" />
        </div>
      </div>
    </div>
  </div>
</template>
