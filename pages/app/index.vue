<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: Map } = await useFetch("/api/bond/map", { key: "map" });

const markers = ref(Map.value?.markers || []);
const stories = ref(Map.value?.stories || []);

const edit = ref(false);
const markerModal = ref(false);
const storyModal = ref(false);
const drag = ref(false);
const currentMarker = ref(0);

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

const newMarker = async ({ marker, edit }: { marker: MappedLoveMarker, edit: boolean }) => {
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
  currentMarker.value = update.id;
};

const editMarker = (marker: MappedLoveMarker) => {
  currentMarker.value = marker.id;
  markerModal.value = true;
};

const closeMarkerModal = () => {
  markerModal.value = false;
  currentMarker.value = 0;
};

const move = async () => {
  const oldArrange = markers.value.map((marker) => ({ id: marker.id, order: marker.order }));
  const newArrange = markers.value.map((marker, index) => ({ id: marker.id, order: index }));
  await $fetch("/api/markers/rearrange", {
    method: "POST",
    body: { oldArrange, newArrange }
  }).catch(() => undefined);
};

const selectedMarker = computed(() : MappedLoveMarker => {
  return markers.value.find((marker) => marker.id === selected.value) as MappedLoveMarker;
});
</script>

<template>
  <main class="h-100">
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" ref="map" :markers="markers" size="60vh" :select="selected" @moved="movedPosition" />
      </div>
      <div class="col-12 col-xl-5">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 h-100">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <Icon class="text-primary" name="solar:map-point-favourite-bold" size="2rem" />
            <h2 class="m-0">{{ t("markers") }}</h2>
            <ButtonAdd @click="markerModal = true" />
            <button v-if="markers.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
          </div>
          <draggable v-if="markers.length" v-model="markers" class="row g-2" item-key="id" v-bind="dragOptions" :disabled="!edit" @change="move" @start="drag = true" @end="drag = false">
            <TransitionGroup type="transition" :name="!drag ? 'flip-list' : undefined">
              <div v-for="marker in markers" :key="marker.id" class="col-6 d-flex gap-2">
                <div class="marker border rounded-3 py-2 px-3 w-100 position-relative" :class="{'active' : selected === marker.id}" role="button" @click="selected = marker.id">
                  <Icon v-if="edit" name="tabler:grip-horizontal" size="1rem" class="position-absolute start-50 bottom-0 translate-middle-x text-primary" />
                  <div class="w-100 h-100 text-break">
                    <h5 class="title">{{ marker.title }}</h5>
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
            <ButtonAdd v-if="selected" @click="storyModal = true" />
            <button v-if="selected && stories.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
          </div>
          <h4 v-if="selected">{{ selectedMarker.title }}</h4>
          <p v-if="!selected" class="m-0">{{ t("select_marker_story") }}</p>
          <p v-else-if="!stories.length" class="m-0">{{ t("no_stories") }}</p>
        </div>
      </div>
    </div>
    <ModalMarker v-if="markerModal" :id="currentMarker" @close="closeMarkerModal" @submit="newMarker" />
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
