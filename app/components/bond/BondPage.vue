<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const props = defineProps<{
  bond: MappedLoveBond;
}>();

const { $toasts, $bootstrap, payload } = useNuxtApp();

const deleteButton = ref(false);
const coupleDate = ref(props.bond.coupleDate);
const cachedDate = ref<number | null>();
const isPublic = ref(props.bond.public);

const togetherFor = computed(() => getTogetherFor(coupleDate.value));
const publicURL = computed(() => `${SITE.host}/map/${props.bond.code}`);

const emit = defineEmits(["bond"]);

const deleteDate = () => {
  if (!confirm(t("delete_anniversary"))) return;
  coupleDate.value = null;
};

const changePrivacy = async () => {
  if (isPublic.value && !confirm(t("public_bond_confirm"))) {
    isPublic.value = false;
    return;
  }

  $fetch("/api/bond", {
    method: "PATCH",
    body: {
      public: isPublic.value
    }
  }).then(() => {
    $toasts.add({ message: t("bond_preferences_update") });
  }).catch(() => {});
};

const leaveBond = async () => {
  if (!confirm(t("leave_bond_confirm"))) return;
  $fetch("/api/bond/leave", {
    method: "POST"
  }).then(() => {
    emit("bond", { bond: null, type: "leave" });
  }).catch(() => {});
};

const upcomingDates = computed(() => {
  const dates: { icon: string, title: string, date: number }[] = [];
  if (!props.bond.partners?.some(partner => partner.birthDate)) return dates;
  dates.push(
    ...props.bond.partners
      .filter(partner => partner.birthDate)
      .map(partner => ({
        icon: "tabler:cake",
        title: `${t("birthday")}: ${partner.name}`,
        date: partner.birthDate!
      }))
  );
  return dates.sort((a, b) => a.date - b.date);
});

onMounted(() => {
  cachedDate.value = coupleDate.value;
  $bootstrap.initializePopover();
});

watch(coupleDate, async (val: number | null) => {
  if (cachedDate.value === val) return;
  $fetch("/api/bond", {
    method: "PATCH",
    body: {
      coupleDate: coupleDate.value
    }
  }).then(() => {
    $toasts.add({ message: t("anniversary_update") });
    delete payload.data.bond;
  }).catch(() => {}).finally(() => {
    cachedDate.value = val;
  });
});
</script>

<template>
  <div class="row">
    <div class="col-lg-8 col-xl-6 mx-auto">
      <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
        <div class="position-relative d-flex justify-content-center py-4">
          <div v-for="(partner, i) of bond.partners" :key="partner.id" class="text-center position-relative">
            <div class="text-center mb-2">
              <img v-if="isToday(partner.birthDate)" src="/images/miscellaneous/party-hat.png" :class="`party-hat-${i ? 'right' : 'left'}`">
              <label class="avatar border border-5 m-0 mx-md-3 mx-lg-4" :class="{ 'scale-hover': partner.showAvatar }" style="width: 175px; height: 175px;">
                <img v-if="partner.showAvatar" :src="`${getAvatarImage(partner.hash)}?updated=${partner.updatedAt}`" width="175" height="175" :alt="partner.name">
                <img v-else :src="getDefaultAvatar(partner.id)" width="175" height="175" :alt="partner.name">
              </label>
            </div>
            <h4 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner.name }}</h4>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle z-1 bond-heart d-flex shadow rounded-circle bg-body border border-5">
            <Icon name="solar:hearts-bold-duotone" class="img-fluid p-2 p-lg-3 text-primary" />
          </div>
        </div>
        <div class="mt-5">
          <Transition name="tab" mode="out-in">
            <div v-if="!coupleDate">
              <ClientOnly>
                <VueDatePicker v-model="coupleDate" v-bind="datePickerOptions.timestamp">
                  <template #trigger>
                    <div class="p-2 border rounded-3 hover" role="button">
                      <div class="d-flex align-items-center justify-content-center gap-1">
                        <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                        <strong>{{ t("add_anniversary") }}</strong>
                      </div>
                    </div>
                  </template>
                </VueDatePicker>
                <template #fallback>
                  <div class="p-2 border rounded-3 hover dp__main dp__theme_light" role="button">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                      <strong>{{ t("add_anniversary") }}</strong>
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </div>
            <div v-else>
              <div class="p-2 d-flex gap-3 border rounded-3 mb-2 position-relative" @mouseenter="deleteButton = true" @mouseleave="deleteButton = false">
                <div class="rounded-3 bg-secondary d-flex align-items-center justify-content-center" :style="{ width: '4.375rem', height: '4.375rem' }">
                  <div class="text-primary text-center">
                    <h4 class="m-0 fw-bold">
                      <NuxtTime :datetime="coupleDate" v-bind="timeOptions.day" />
                    </h4>
                    <span class="fw-bold">
                      <NuxtTime :datetime="coupleDate" v-bind="timeOptions.monthName" />
                    </span>
                  </div>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-1">
                    <Icon name="solar:heart-lock-outline" size="1.4rem" class="text-primary" />
                    <h5 class="m-0">{{ t("anniversary") }}</h5>
                  </div>
                  <p class="m-0">{{ getUntilDate(coupleDate) }}</p>
                </div>
                <Transition name="fade">
                  <div v-if="deleteButton" class="position-absolute top-0 end-0 m-2 d-flex flex-column">
                    <button class="btn btn-sm border-0" :title="t('delete')" @click="deleteDate">
                      <Icon name="solar:trash-bin-trash-linear" size="1.5rem" class="text-danger" />
                    </button>
                    <ClientOnly>
                      <VueDatePicker v-model="coupleDate" v-bind="datePickerOptions.timestamp">
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
              <div class="p-3 bg-secondary rounded-3 shadow-sm">
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
      <div v-if="upcomingDates.length > 0" class="my-2 bg-body rounded-3 px-3 py-4 p-lg-4">
        <h3>{{ t("upcoming_dates") }}</h3>
        <div class="d-flex flex-column gap-2">
          <template v-for="(upcoming, i) of upcomingDates" :key="i">
            <div class="p-2 d-flex gap-3 border rounded-3 position-relative">
              <div class="rounded-3 bg-secondary d-flex align-items-center justify-content-center" :style="{ width: '4.375rem', height: '4.375rem' }">
                <div class="text-primary text-center">
                  <h4 class="m-0 fw-bold">
                    <NuxtTime :datetime="upcoming.date" v-bind="timeOptions.day" />
                  </h4>
                  <span class="fw-bold">
                    <NuxtTime :datetime="upcoming.date" v-bind="timeOptions.monthName" />
                  </span>
                </div>
              </div>
              <div>
                <div class="d-flex align-items-center gap-1">
                  <Icon :name="upcoming.icon" size="1.4rem" class="text-primary" />
                  <h5 class="m-0">{{ upcoming.title }}</h5>
                </div>
                <p class="m-0">{{ getUntilDate(upcoming.date) }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="mt-2 bg-body rounded-3 px-3 py-4 p-lg-4">
        <h3>{{ t("bond_preferences") }}</h3>
        <div class="mb-2 form-check form-switch d-flex gap-2 align-items-center">
          <input v-model="isPublic" class="form-check-input" type="checkbox" role="switch" @change="changePrivacy">
          <label class="form-check-label">{{ t("public_bond") }}</label>
          <Icon name="solar:question-circle-linear" class="text-primary outline-none" size="1.3rem" data-bs-toggle="popover" :data-bs-content="t('public_bond_info')" :style="{ cursor: 'help' }" />
        </div>
        <div class="mb-2">
          <p v-if="isPublic" class="m-0">{{ t("share_bond_info") }}</p>
          <p v-else class="m-0">{{ t("share_bond_info_preview") }}</p>
          <CopyText :text="publicURL">
            <NuxtLink :to="publicURL" external target="_blank" class="btn btn-secondary px-4" :title="t('open_map')">
              <Icon name="solar:square-top-down-linear" size="1.5rem" />
            </NuxtLink>
          </CopyText>
        </div>
        <div class="d-flex flex-wrap-reverse justify-content-between align-items-center mt-3">
          <div class="d-flex gap-1 text-body-tertiary small">
            <p class="m-0">{{ t("last_updated") }}:</p>
            <NuxtTime :datetime="bond.updatedAt" v-bind="timeOptions.full" />
          </div>
          <a href="#" class="d-flex align-items-center gap-2" @click="leaveBond">
            <Icon name="solar:exit-bold" />
            {{ t("leave_bond") }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
