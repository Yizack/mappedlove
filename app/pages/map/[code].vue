<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

definePageMeta({ layout: "map" });

const { params } = useRoute();

const { data: bond } = await useFetch(`/api/bond/public/${params.code}`);
const { $bootstrap } = useNuxtApp();

if (!bond.value) {
  throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: t("map_not_found"),
    fatal: true
  });
}

const selected = ref(0);
const mapInfo = ref() as Ref<HTMLElement>;
const marker = ref<MappedLoveMarker>();
const stories = ref<MappedLoveStory[]>();
const partner1 = ref(bond.value.partner1);
const partner2 = ref(bond.value.partner2);

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
const canvasHeader = ref() as Ref<HTMLElement>;
const canvasBody = ref() as Ref<HTMLElement>;
const currentStory = ref<MappedLoveStory>();
const currentStoryUser = computed(() => [partner1.value, partner2.value].find(user => user.id === currentStory.value?.user));

const showModal = ref(false);

const openStory = (story: MappedLoveStory) => {
  currentStory.value = story;
  if (isMobile.value) expandCanvas.value = false;
  useModalController("story", (show) => {
    showModal.value = show;
    if (!show) currentStory.value = undefined;
  }, () => {
    document.querySelector(".modal-backdrop")?.classList.add("modal-map-backdrop");
  });
};

onMounted(() => {
  isMobile.value = isMobileScreen();
  addEventListener("resize", () => {
    isMobile.value = isMobileScreen();
  });

  mapInfo.value.addEventListener("hide.bs.offcanvas", () => {
    $bootstrap.hideAllModals();
    selected.value = 0;
  });

  const touch = {
    startY: 0,
    endY: 0
  };

  canvasHeader.value.addEventListener("touchstart", (event) => {
    touch.startY = event.changedTouches[0].screenY;
  }, { passive: true });

  canvasHeader.value.addEventListener("touchend", (event) => {
    touch.endY = event.changedTouches[0].screenY;
    if (touch.endY < touch.startY) {
      expandCanvas.value = true;
      return;
    }

    if (touch.endY > touch.startY) {
      if (expandCanvas.value) expandCanvas.value = false;
      return;
    }
  }, { passive: true });
});

onBeforeUnmount(() => {
  canvasHeader.value.removeEventListener("touchstart", () => {}, false);
  canvasHeader.value.removeEventListener("touchend", () => {}, false);
  canvasBody.value.removeEventListener("touchstart", () => {}, false);
  mapInfo.value.removeEventListener("hide.bs.offcanvas", () => {}, false);
  $bootstrap.hideOffcanvas(mapInfo.value);
});

useSeo({
  title: `${partner1.value.name} & ${partner1.value.name} | ${SITE.name}`,
  name: `${partner1.value.name} & ${partner1.value.name}`,
  description: t("seo_map_description"),
  robots: false
});
</script>

<template>
  <div v-if="bond">
    <div class="btn btn-primary rounded-pill position-absolute bottom-0 start-50 translate-middle-x px-3 py-2 mb-4" :style="{ zIndex: 1000 }">
      <strong>{{ bond.partner1.name }}</strong> <Icon name="solar:hearts-bold-duotone" class="img-fluid" /> <strong>{{ bond.partner2.name }}</strong>
    </div>
    <MapPublic ref="map" :bond="bond" :select="selected" @select="onSelect" />
    <div id="mapInfo" ref="mapInfo" class="offcanvas shadow" :class="isMobile ? 'offcanvas-bottom' : 'offcanvas-start'" data-bs-backdrop="false" tabindex="-1" aria-labelledby="mapInfoLabel" :style="{ height: expandCanvas || !isMobile ? '100vh' : '30vh' }">
      <div ref="canvasHeader" class="offcanvas-header">
        <h5 id="mapInfoLabel" class="offcanvas-title d-flex align-items-center">
          <Icon name="solar:map-point-favourite-bold" class="text-primary flex-shrink-0" size="2rem" />
          <span v-if="marker">{{ marker.title }}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="expandCanvas = false" />
        <div class="position-absolute start-0 top-0 w-100 text-center my-2" :style="{ height: '0.3rem' }">
          <div v-if="isMobile" class="bg-primary h-100 rounded-pill mx-auto" :style="{ width: '2rem' }" />
        </div>
      </div>
      <div ref="canvasBody" class="offcanvas-body p-0">
        <div v-if="marker">
          <div class="p-3 border-bottom">
            <p>{{ marker.description }}</p>
            <div class="d-flex gap-1 mb-2" :title="t(groups[marker.group].key)">
              <strong>{{ t("group") }}:</strong>
              <Icon :name="groups[marker.group].icon" class="text-primary" size="1.5rem" />
              <span>{{ t(groups[marker.group].key) }}</span>
            </div>
            <div class="d-flex gap-1">
              <button v-if="filter.year" class="btn btn-sm btn-danger rounded-3">
                <Icon name="ic:round-close" size="1.3rem" @click="clearFilter" />
              </button>
              <ClientOnly v-if="!isMobile || expandCanvas">
                <VueDatePicker v-model.number="filter.year" year-picker reverse-years :year-range="[currentYear - 100, currentYear]">
                  <template #trigger>
                    <div class="px-2 py-1 border rounded-3 hover position-relative" role="button">
                      <div class="d-flex align-items-center justify-content-center gap-1">
                        <strong>{{ filter.year ? filter.year : t("filter_by_year") }}</strong>
                      </div>
                    </div>
                  </template>
                </VueDatePicker>
              </ClientOnly>
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
                            <img :src="`${getStoryImage(bond.id, story.hash)}?updated=${story.updatedAt}`" class="card-img-top">
                            <div class="card-footer">
                              <small class="text-body-secondary">
                                <span>{{ story.year }}</span>
                                <span v-if="story.month">, {{ t(months[story.month - 1]) }}</span>
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
    <ModalController v-if="showModal && currentStory" id="story" fullscreen map>
      <div class="position-absolute start-0 top-0 py-2 px-3 bg-body bg-opacity-75 rounded shadow m-2 small">
        <div class="d-flex gap-1">
          <span>{{ t("uploaded_by") }}:</span>
          <div v-if="currentStoryUser?.showAvatar" id="image-upload" class="text-center">
            <label class="rounded-circle bg-body-tertiary position-relative overflow-hidden d-flex" style="width: 24px; height: 24px;">
              <img :src="`${getAvatarImage(currentStoryUser.id, currentStoryUser.hash)}?updated=${currentStoryUser.updatedAt}`" alt="avatar" width="24" height="24" class="img-fluid">
            </label>
          </div>
          <strong>{{ currentStoryUser?.name }}</strong>
        </div>
        <div>
          <span>{{ t("story_date") }}: </span>
          <strong>
            <span v-if="currentStory.month">{{ t(months[currentStory.month - 1]) }} {{ currentStory.year }}</span>
            <span v-else>{{ currentStory.year }}</span>
          </strong>
        </div>
        <template v-if="currentStory.description">
          <hr class="my-1">
          <div>{{ currentStory.description }}</div>
        </template>
      </div>
      <img :src="`${getStoryImage(bond.id, currentStory.hash)}?updated=${currentStory.updatedAt}`" class="map-img shadow-lg">
    </ModalController>
  </div>
</template>
