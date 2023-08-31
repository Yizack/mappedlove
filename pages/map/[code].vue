<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

definePageMeta({ layout: "map" });

const { params } = useRoute();

const { data: map } = await useFetch(`/api/bond/public/${params.code}`);

if (!map.value) {
  throw createError({
    statusCode: 404,
    message: "Bond not found",
    fatal: true
  });
}

const selected = ref(0);
const mapInfo = ref() as Ref<HTMLElement>;
const marker = ref() as Ref<MappedLoveMarker | undefined>;
const stories = ref() as Ref<MappedLoveStory[]>;
const filter = ref({
  year: null as number | null
});
const currentYear = new Date().getFullYear();

const onSelect = (id: number) => {
  selected.value = id;
  const { $bootstrap } = useNuxtApp();
  $bootstrap.showOffcanvas(mapInfo.value);
  marker.value = map.value?.markers.find((marker) => marker.id === id);
  stories.value = map.value?.stories.filter((story) => story.marker === id) || [];
};

const storiesFiltered = computed(() => {
  if (!filter.value.year) return stories.value;
  return stories.value.filter((story) => story.year === filter.value.year);
});

const clearFilter = () => {
  filter.value.year = null;
};
</script>

<template>
  <MapPublic v-if="map" ref="map" :bond="map" :select="selected" @select="onSelect" />
  <div id="mapInfo" ref="mapInfo" class="offcanvas offcanvas-start shadow" data-bs-backdrop="false" tabindex="-1" aria-labelledby="mapInfoLabel">
    <template v-if="marker">
      <div class="offcanvas-header">
        <h5 id="mapInfoLabel" class="offcanvas-title d-flex align-items-center">
          <Icon name="solar:map-point-favourite-bold" class="text-primary flex-shrink-0" size="2rem" />
          <span>{{ marker.title }}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div class="offcanvas-body p-0">
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
            <ClientOnly>
              <VueDatePicker v-model="filter.year" year-picker reverse-years :year-range="[currentYear - 100, currentYear]">
                <template #trigger>
                  <div class="px-2 py-1 border rounded-3 hover position-relative" role="button">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <strong v-if="filter.year">{{ filter.year }}</strong>
                      <strong v-else>{{ t("filter_by_year") }}</strong>
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
                        <img :src="`${getStoryImageFromUser(story.id)}?updated=${story.updatedAt}`" class="card-img-top">
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
    </template>
  </div>
</template>
