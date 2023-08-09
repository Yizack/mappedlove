<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: bondMap } = await useFetch("/api/bond/map", { key: "bondMap" });

const markers = ref(bondMap.value?.markers || []);
const stories = ref(bondMap.value?.stories || []);

const edit = ref(false);
const markerModal = ref(false);
const storyModal = ref(false);
const drag = ref(false);

const currentMarker: Ref<MappedLoveMarker | null> = ref(null);
const currentStory: Ref<MappedLoveStory | null> = ref(null);
const selected = ref(0);

const map = ref();
const moved = reactive({
  success: false,
  updated: false
});

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  };
});

const newMarker = ({ marker, edit }: { marker: MappedLoveMarker, edit: boolean }) => {
  if (edit) {
    return markers.value = markers.value.map((item) => {
      if (item.id === marker.id) return marker;
      return item;
    });
  }
  markers.value.push(marker);
  map.value.addMarker(marker);
  map.value.setView([marker.lat, marker.lng], 10);
};

const deleteMarker = async (id: number) => {
  if (!confirm(t("delete_marker"))) return;
  const res = await $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).catch(() => ({}));

  if (!("id" in res)) return;
  if (selected.value === id) selected.value = 0;
  markers.value = markers.value.filter((marker) => marker.id !== id);
  map.value.removeMarker(id);
};

const movedPosition = (update: MappedLoveMarker) => {
  if (update.id) {
    moved.success = true;
  }
  moved.updated = true;
  markers.value = markers.value.map((item) => {
    if (item.id === update.id) return update;
    return item;
  });
  currentMarker.value = update;
};

const editMarker = (marker: MappedLoveMarker) => {
  currentMarker.value = marker;
  markerModal.value = true;
};

const newStory = ({ story, edit }: { story: MappedLoveStory, edit: boolean }) => {
  if (!edit) stories.value.push(story);
  else {
    stories.value = stories.value.map((item) => {
      if (item.id === story.id) return story;
      return item;
    });
  }
  stories.value.sort((a, b) => {
    if (a.year === b.year) return b.month - a.month;
    return b.year - a.year;
  });
};

const closeModal = () => {
  markerModal.value = false;
  currentMarker.value = null;
  storyModal.value = false;
  currentStory.value = null;
};

const move = async () => {
  const oldArrange = markers.value.map((marker) => ({ id: marker.id, order: marker.order }));
  const newArrange = markers.value.map((marker, index) => ({ id: marker.id, order: index }));
  await $fetch("/api/markers/rearrange", {
    method: "POST",
    body: { oldArrange, newArrange }
  }).catch(() => undefined);
};

const selectedMarker = computed(() => {
  return {
    ...markers.value.find(marker => marker.id === selected.value) as MappedLoveMarker,
    stories: stories.value.filter(s => s.marker === selected.value) as MappedLoveStory[]
  };
});

const selectMarker = (id: number) => {
  if (selected.value === id) return selected.value = 0;
  selected.value = id;
  animate.value = false;
  animateElements();
};

const openStory = (story: MappedLoveStory) => {
  currentStory.value = story;
  storyModal.value = true;
};
</script>

<template>
  <main class="h-100">
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" ref="map" :markers="markers" size="60vh" :select="selected" @moved="movedPosition" />
      </div>
      <div class="col-12 col-xl-5">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" size="2rem" />
            <h2 class="m-0">{{ t("markers") }}</h2>
            <ButtonAdd @click="markerModal = true" />
            <button v-if="markers.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
          </div>
          <draggable v-if="markers.length" v-model="markers" class="row g-2" item-key="id" v-bind="dragOptions" :disabled="!edit" @change="move" @start="drag = true" @end="drag = false">
            <TransitionGroup type="transition" :name="!drag ? 'flip-list' : undefined">
              <div v-for="marker in markers" :key="marker.id" class="col-12 col-md-4 col-xl-6 d-flex gap-2">
                <div class="marker border rounded-3 py-2 px-3 w-100 position-relative" :class="{'active' : selected === marker.id}" role="button" @click="selectMarker(marker.id)">
                  <Icon v-if="edit" name="tabler:grip-horizontal" size="1rem" class="position-absolute start-50 bottom-0 translate-middle-x text-primary" />
                  <div class="w-100 h-100 text-break">
                    <h5 class="d-flex align-items-center gap-1">
                      <span class="d-flex" :title="t(groups[marker.group].key)">
                        <Icon :name="groups[marker.group].icon" class="text-primary" size="1.5rem" />
                      </span>
                      {{ marker.title }}
                    </h5>
                    <p class="m-0">{{ marker.description }}</p>
                  </div>
                </div>
                <Transition name="fade" mode="out-in">
                  <div v-if="edit" class="d-grid gap-1">
                    <button class="btn btn-primary" @click="editMarker(marker)"><Icon name="solar:pen-linear" size="1.5rem" /></button>
                    <button class="btn btn-danger" @click="deleteMarker(marker.id)"><Icon name="ic:round-close" size="1.5rem" /></button>
                  </div>
                </Transition>
              </div>
            </TransitionGroup>
          </draggable>
          <p v-else class="m-0">{{ t("no_markers") }}</p>
        </div>
      </div>
      <div class="col-12 col-xl-7">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 h-100">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <Icon class="text-primary" name="solar:chat-square-like-bold" size="2rem" />
            <h2 class="m-0">{{ t("stories") }}</h2>
            <Transition name="bounce">
              <ButtonAdd v-if="selected" @click="storyModal = true" />
            </Transition>
          </div>
          <Transition name="tab-left" mode="out-in">
            <h4 v-if="selected && animate">{{ selectedMarker.title }}</h4>
          </Transition>
          <Transition name="fade" mode="out-in">
            <p v-if="!selected" class="m-0">{{ t("select_marker_story") }}</p>
            <p v-else-if="!selectedMarker.stories.length" class="m-0">{{ t("no_stories") }}</p>
            <div v-else-if="animate">
              <div id="accordionStories" class="accordion accordion-flush">
                <div v-for="(year, i) in yearsFromStories(stories)" :key="i" class="accordion-item">
                  <h2 class="accordion-header">
                    <button class="accordion-button rounded-3 px-3" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse-${i}`" aria-expanded="false" aria-controls="flush-collapseOne"><h5 class="m-0">{{ year }}</h5></button>
                  </h2>
                  <div :id="`flush-collapse-${i}`" class="accordion-collapse py-2 show">
                    <MasonryWall :items="storiesByYear(stories, year).filter(s => s.marker === selected)" :ssr-columns="1" :gap="8" :max-columns="4" :column-width="200">
                      <template #default="{ item: story }">
                        <div class="card h-100">
                          <img :src="`${getStoryImageFromUser(story.id)}?updated=${story.updatedAt}`" class="card-img-top" alt="..." role="button" @click="openStory(story)">
                          <div v-if="story.description" class="card-body border-top">
                            <p class="card-text">{{ story.description }}</p>
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
          </Transition>
        </div>
      </div>
    </div>
    <ModalMarker v-if="markerModal" :marker="currentMarker" @close="closeModal" @submit="newMarker" />
    <ModalStory v-if="storyModal" :marker-id="selected" :story="currentStory" @close="closeModal" @submit="newStory" />
    <ToastMessage v-if="moved.updated" :success="moved.success" :text="t('saved_changes')" @dispose="moved.updated = false" />
  </main>
</template>

<style>
.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
