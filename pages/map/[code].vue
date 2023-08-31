<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

definePageMeta({ layout: "map" });

const { params } = useRoute();

const { data: bond } = await useFetch(`/api/bond/public/${params.code}`);

if (!bond.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("map_not_found"),
    fatal: true
  });
}

const selected = ref(0);
const mapInfo = ref() as Ref<HTMLElement>;
const marker = ref() as Ref<MappedLoveMarker | undefined>;
const stories = ref() as Ref<MappedLoveStory[]>;
const filter = ref({
  year: 0
});
const currentYear = new Date().getFullYear();

const onSelect = (id: number) => {
  selected.value = id;
  const { $bootstrap } = useNuxtApp();
  $bootstrap.showOffcanvas(mapInfo.value);
  marker.value = bond.value?.markers.find((marker) => marker.id === id);
  stories.value = bond.value?.stories.filter((story) => story.marker === id) || [];
};

const storiesFiltered = computed(() => {
  if (!filter.value.year) return stories.value;
  return stories.value.filter((story) => story.year === filter.value.year);
});

const clearFilter = () => {
  filter.value.year = 0;
};

const isMobile = ref(false);

const expandCanvas = ref(false);
const canvasHeader = ref() as Ref<HTMLElement>;
const canvasBody = ref() as Ref<HTMLElement>;

onMounted(() => {
  isMobile.value = isMobileScreen();
  window.addEventListener("resize", () => {
    isMobile.value = isMobileScreen();
  });

  canvasBody.value.addEventListener("touchstart", () => {
    if (!expandCanvas.value) expandCanvas.value = true;
  }, { passive: true });

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
  mapInfo.value.removeEventListener("touchstart", () => {}, false);
});
</script>

<template>
  <div v-if="bond">
    <MapPublic ref="map" :bond="bond" :select="selected" @select="onSelect" />
    <div id="mapInfo" ref="mapInfo" class="offcanvas shadow" :class="isMobile ? 'offcanvas-bottom' : 'offcanvas-start'" data-bs-backdrop="false" tabindex="-1" aria-labelledby="mapInfoLabel" :style="{height: expandCanvas || !isMobile ? '100vh' : '30vh'}">
      <div ref="canvasHeader" class="offcanvas-header">
        <h5 id="mapInfoLabel" class="offcanvas-title d-flex align-items-center">
          <Icon name="solar:map-point-favourite-bold" class="text-primary flex-shrink-0" size="2rem" />
          <span v-if="marker">{{ marker.title }}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="expandCanvas = false" />
        <div class="position-absolute start-0 top-0 w-100 text-center my-2" :style="{height: '0.3rem'}">
          <div v-if="isMobile" class="bg-primary h-100 rounded-pill mx-auto" :style="{width: '2rem'}" />
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
          <div class="p-3">
            <h5 class="mb-3">{{ t("stories") }} <span class="badge bg-primary rounded-pill">{{ storiesFiltered.length }}</span></h5>
            <div id="accordionStories" class="accordion accordion-flush rounded">
              <div v-for="(year, i) of yearsFromStories(storiesFiltered)" :key="i" class="accordion-item">
                <h5 class="accordion-header small">
                  <button class="accordion-button rounded-3 px-3 py-2" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse-${i}`" aria-expanded="false" aria-controls="flush-collapseOne"><h5 class="m-0">{{ year }}</h5></button>
                </h5>
                <div :id="`flush-collapse-${i}`" class="accordion-collapse py-2 show">
                  <MasonryWall :items="storiesByYear(storiesFiltered, year)" :ssr-columns="1" :gap="4" :max-columns="1" :column-width="200">
                    <template #default="{ item: story }">
                      <div class="card h-100">
                        <div role="button">
                          <img :src="`${getStoryImage(story.id, bond.code)}?updated=${story.updatedAt}`" class="card-img-top">
                        </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
