<script setup lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import { VueDatePicker } from "@vuepic/vue-datepicker";

definePageMeta({ layout: "map" });

const { params } = useRoute("map-code");

const { data: bond } = await useFetch(`/api/bond/public/${params.code}`);
const { $bootstrap } = useNuxtApp();
const colorMode = useColorMode();

if (!bond.value) {
  throw createError({
    status: ErrorCode.NOT_FOUND,
    message: t("map_not_found")
  });
}

const selected = ref(0);
const mapInfo = useTemplateRef("mapInfo");
const marker = ref<MappedLoveMarker>();
const stories = ref<MappedLoveStory[]>();
const partners = ref(bond.value.partners);

const filter = ref({
  year: 0
});

const currentYear = new Date().getFullYear();

const onSelect = (id: number) => {
  selected.value = id;
  $bootstrap.showOffcanvas(mapInfo.value);
  marker.value = bond.value?.markers.find(marker => marker.id === id);
  stories.value = bond.value?.stories.filter(story => story.marker === id) || [];
};

const storiesFiltered = computed(() => {
  if (!filter.value.year) return stories.value;
  return stories.value?.filter(story => story.year === filter.value.year);
});

const clearFilter = () => {
  filter.value.year = 0;
};

const isMobile = ref(false);

const expandCanvas = ref(false);
const canvasHeader = useTemplateRef("canvasHeader");
const currentStory = ref<MappedLoveStory>();
const currentStoryUser = computed(() => partners.value.find(user => user.id === currentStory.value?.user));

const storyModal = useModal("story");
const bondModal = useModal("bond-info");

const openStory = (story: MappedLoveStory) => {
  currentStory.value = story;
  if (isMobile.value) expandCanvas.value = false;
  storyModal.value.show({ focus: false }, () => {
    document.querySelector(".modal-backdrop")?.classList.add("modal-map-backdrop");
  });
};

watch(() => storyModal.value.isVisible, (show) => {
  if (!show) currentStory.value = undefined;
});

const mapInfoHandler = () => {
  $bootstrap.hideAllModals();
  selected.value = 0;
};

const touch = {
  startY: 0,
  endY: 0
};

const touchStartHandler = (event: TouchEvent) => {
  touch.startY = event.changedTouches[0]!.screenY;
};

const touchEndHandler = (event: TouchEvent) => {
  touch.endY = event.changedTouches[0]!.screenY;
  if (touch.endY < touch.startY) {
    expandCanvas.value = true;
    return;
  }

  if (touch.endY > touch.startY) {
    if (expandCanvas.value) expandCanvas.value = false;
    return;
  }
};

const resizeHandler = () => {
  isMobile.value = isMobileScreen();
};

onMounted(() => {
  isMobile.value = isMobileScreen();
  addEventListener("resize", resizeHandler);
  mapInfo.value?.addEventListener("hide.bs.offcanvas", mapInfoHandler);
  canvasHeader.value?.addEventListener("touchstart", touchStartHandler, { passive: true });
  canvasHeader.value?.addEventListener("touchend", touchEndHandler, { passive: true });
});

onBeforeUnmount(() => {
  removeEventListener("resize", resizeHandler);
  canvasHeader.value?.removeEventListener("touchstart", touchStartHandler);
  canvasHeader.value?.removeEventListener("touchend", touchEndHandler);
  mapInfo.value?.removeEventListener("hide.bs.offcanvas", mapInfoHandler);
  $bootstrap.hideOffcanvas(mapInfo.value);
});

const partnersTitle = partners.value.map(partner => partner.name).join(" & ");
useSeo({
  title: `${partnersTitle} | ${SITE.name}`,
  name: partnersTitle,
  description: t("seo_map_description"),
  robots: false
});
</script>

<template>
  <div v-if="bond">
    <button class="btn btn-primary rounded-pill position-absolute bottom-0 start-50 translate-middle-x px-3 py-2 mb-4 d-flex align-items-center gap-1" :style="{ zIndex: 1000 }" @click="bondModal.show()">
      <template v-for="(partner, index) in partners" :key="index">
        <strong>{{ partner.name }}</strong>
        <Icon v-if="index === 0" name="solar:hearts-bold-duotone" class="img-fluid" />
      </template>
    </button>
    <MapPublic ref="map" v-bind="{ bond, selected }" @select="onSelect" />
    <div ref="mapInfo" class="offcanvas shadow" :class="isMobile ? 'offcanvas-bottom' : 'offcanvas-start'" data-bs-backdrop="false" data-bs-scroll="true" tabindex="-1" aria-labelledby="mapLabel" :style="{ height: expandCanvas || !isMobile ? '100vh' : '30vh' }">
      <div ref="canvasHeader" class="offcanvas-header">
        <h5 id="mapLabel" class="offcanvas-title d-flex align-items-center">
          <Icon name="solar:map-point-favourite-bold" class="text-primary flex-shrink-0" size="2rem" />
          <span v-if="marker">{{ marker.title }}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="expandCanvas = false" />
        <div class="position-absolute start-0 top-0 w-100 text-center my-2" :style="{ height: '0.3rem' }">
          <div v-if="isMobile" class="bg-primary h-100 rounded-pill mx-auto" :style="{ width: '2rem' }" />
        </div>
      </div>
      <div class="offcanvas-body p-0">
        <div v-if="marker">
          <div class="p-3 border-bottom">
            <p v-if="marker.description">{{ marker.description }}</p>
            <div class="d-flex gap-1 mb-2" :title="t(groups[marker.group]!.key)">
              <strong>{{ t("group") }}:</strong>
              <Icon :name="groups[marker.group]!.icon" class="text-primary" size="1.5rem" />
              <span>{{ t(groups[marker.group]!.key) }}</span>
            </div>
            <div v-if="marker.country" class="d-flex gap-1 mb-2">
              <strong>{{ t("country") }}:</strong>
              <Twemoji :emoji="$countries.getEmoji(marker.country)" size="1.5rem" />
              <span>{{ $countries.getName(marker.country) }}</span>
            </div>
            <div class="d-flex gap-1">
              <button v-if="filter.year" class="btn btn-sm btn-danger rounded-3">
                <Icon name="tabler:x" size="1.3rem" @click="clearFilter" />
              </button>
              <VueDatePicker v-if="!isMobile || expandCanvas" v-model.number="filter.year" year-picker reverse-years :year-range="[currentYear - 100, currentYear]" :dark="colorMode.preference === 'dark'">
                <template #trigger>
                  <div class="px-2 py-1 border rounded-3 hover position-relative" role="button">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <strong>{{ filter.year ? filter.year : t("filter_by_year") }}</strong>
                    </div>
                  </div>
                </template>
              </VueDatePicker>
            </div>
          </div>
          <div v-if="storiesFiltered" class="p-3">
            <h5 class="mb-3">{{ t("stories") }} <span class="badge bg-primary rounded-pill">{{ storiesFiltered.length }}</span></h5>
            <Transition name="tab">
              <div v-if="storiesFiltered.length" id="accordionStories" class="accordion accordion-flush rounded">
                <TransitionGroup name="tab-left">
                  <div v-for="(year, i) of yearsFromStories(storiesFiltered)" :key="i" class="accordion-item">
                    <h5 class="accordion-header small">
                      <button class="accordion-button rounded-3 px-3 py-2" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse-${i}`" aria-expanded="false" aria-controls="flush-collapseOne"><h5 class="m-0">{{ year }}</h5></button>
                    </h5>
                    <div :id="`flush-collapse-${i}`" class="accordion-collapse py-2 show">
                      <MasonryWall :items="storiesByYear(storiesFiltered, year)" :ssr-columns="1" :gap="4" :max-columns="2" :column-width="150">
                        <template #default="{ item: story }">
                          <div class="card h-100 border-2" :class="{ 'border-primary': currentStory?.id === story.id }" role="button" @click="openStory(story)">
                            <div class="overflow-hidden scale-hover">
                              <img :src="`${getStoryImage(story.hash!)}?updated=${story.updatedAt}`" class="card-img-top">
                            </div>
                            <div class="card-footer">
                              <small class="text-body-secondary">
                                <span>{{ story.year }}</span>
                                <span v-if="story.month">, {{ t(months[story.month - 1]!) }}</span>
                              </small>
                            </div>
                          </div>
                        </template>
                      </MasonryWall>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
    <BsModal id="bond-info" v-model="bondModal">
      <div class="position-relative d-flex justify-content-center py-4 mb-3">
        <div v-for="partner in bond.partners" :key="partner.id" class="text-center position-relative">
          <div class="text-center mb-2">
            <label class="avatar border border-5 m-0 mx-md-2 mx-lg-3" style="width: 110px; height: 110px;" :class="{ 'scale-hover': partner.showAvatar }">
              <img v-if="partner.showAvatar" :src="`${getAvatarImage(partner.hash)}?updated=${partner.updatedAt}`" width="110" height="110" :alt="partner.name">
              <img v-else :src="getDefaultAvatar(partner.id)" width="110" height="110" :alt="partner.name">
            </label>
          </div>
          <h5 class="text-center m-0 w-100 position-absolute top-100 px-0 px-lg-2 fst-italic fw-bold">{{ partner.name }}</h5>
        </div>
        <div class="position-absolute top-50 start-50 translate-middle z-1 bond-heart d-flex shadow rounded-circle bg-body border border-5" style="width: 60px; height: 60px;">
          <Icon name="solar:hearts-bold-duotone" class="img-fluid p-2 text-primary" />
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        <div v-if="bond.coupleDate" class="p-2 d-flex gap-3 border rounded-3 position-relative">
          <div class="rounded-3 bg-secondary d-flex align-items-center justify-content-center" :style="{ width: '4.375rem', height: '4.375rem' }">
            <div class="text-primary text-center">
              <h5 class="m-0 fw-bold">
                <NuxtTime :datetime="bond.coupleDate" v-bind="timeOptions.day" />
              </h5>
              <span class="fw-bold">
                <NuxtTime :datetime="bond.coupleDate" v-bind="timeOptions.monthName" />
              </span>
            </div>
          </div>
          <div>
            <div class="d-flex align-items-center gap-1">
              <Icon name="solar:heart-lock-linear" size="1.4rem" class="text-primary" />
              <h5 class="m-0">{{ t("anniversary") }}</h5>
            </div>
            <p class="m-0">{{ getUntilDate(bond.coupleDate) }}</p>
          </div>
        </div>
        <div v-if="bond.coupleDate" class="text-center p-3 bg-secondary rounded-3">
          <h5 class="mb-2">{{ t('together_for') }}</h5>
          <div class="d-flex justify-content-center gap-3">
            <div v-for="(field, key) in getTogetherFor(bond.coupleDate)" :key="key" class="bg-body py-3 rounded-3 flex-fill">
              <span class="fw-bold">{{ field }}</span>
              <span class="d-block text-body-secondary">{{ t(key) }}</span>
            </div>
          </div>
        </div>
        <div class="text-center py-2 border rounded-3">
          <h6 class="mb-1">{{ t('content_count') }}</h6>
          <span class="fw-bold">{{ bond.markers.length }}</span>
          <span class="text-body-secondary ms-1">{{ t('markers') }}</span>
          <span class="mx-2">·</span>
          <span class="fw-bold">{{ bond.stories.length }}</span>
          <span class="text-body-secondary ms-1">{{ t('stories') }}</span>
        </div>
      </div>
    </BsModal>
    <BsModal v-if="currentStory" id="story" v-model="storyModal" fullscreen map>
      <div class="position-absolute start-0 top-0 py-2 px-3 bg-body bg-opacity-75 rounded shadow m-2 small">
        <div v-if="currentStoryUser" class="d-flex gap-1">
          <span>{{ t("uploaded_by") }}:</span>
          <div v-if="currentStoryUser.showAvatar" class="image-upload text-center">
            <label class="rounded-circle bg-body-tertiary position-relative overflow-hidden d-flex" style="width: 24px; height: 24px;">
              <img :src="`${getAvatarImage(currentStoryUser.hash)}?updated=${currentStoryUser.updatedAt}`" alt="avatar" width="24" height="24" class="img-fluid">
            </label>
          </div>
          <strong>{{ currentStoryUser.name }}</strong>
        </div>
        <div>
          <span>{{ t("story_date") }}: </span>
          <strong>
            <span v-if="currentStory.month">{{ t(months[currentStory.month - 1]!) }} {{ currentStory.year }}</span>
            <span v-else>{{ currentStory.year }}</span>
          </strong>
        </div>
        <template v-if="currentStory.description">
          <hr class="my-1">
          <div>{{ currentStory.description }}</div>
        </template>
      </div>
      <img :src="`${getStoryImage(currentStory.hash!)}?updated=${currentStory.updatedAt}`" class="map-img shadow-lg">
    </BsModal>
  </div>
</template>
