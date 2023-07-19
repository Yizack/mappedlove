<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

onMounted(() => {
  const { $bootstrap } = useNuxtApp();
  $bootstrap.hideModalEscEvent();
});

await useFetch("/api/groups", { key: "groups" });

const markers: Ref<Array<any>> = ref([]);

const { data: getMarkers } = await useFetch("/api/markers");
if (getMarkers.value) {
  markers.value = getMarkers.value;
}

const edit = ref(false);
const markerModal = ref(false);
const currentMarker = ref({});
// const stories = [];
const selected = ref(0);

const map = ref();
const moved = ref({
  success: false,
  updated: false
});

const newMarker = async ({ marker, edit }: { marker: any, edit: boolean }) => {
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
  if (!confirm("Are you sure you want to delete this marker?")) return;
  const res = await $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).catch(() => ({}));

  if (!("id" in res)) return;
  markers.value = markers.value.filter((marker) => marker.id !== id);
  map.value.removeMarker(id);
};

const movedPosition = (update: any) => {
  if (update.id) {
    moved.value.success = true;
  }
  moved.value.updated = true;
};

const editMarker = (marker: any) => {
  currentMarker.value = marker;
  markerModal.value = true;
};

const closeMarkerModal = () => {
  markerModal.value = false;
  currentMarker.value = {};
};
</script>

<template>
  <section>
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" ref="map" :markers="markers" size="60vh" :select="selected" @moved="movedPosition" />
      </div>
      <div class="col-12">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <h2 class="m-0">{{ t("markers") }}</h2>
            <ButtonAdd @click="markerModal = true" />
            <button type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
          </div>
          <div class="row g-2">
            <div v-for="marker of markers" :key="marker.id" class="col-sm-6 col-lg-4 col-xl-3 d-flex gap-2">
              <div class="marker d-flex gap-2 align-items-center border rounded-3 p-2 w-100" :class="{'active' : selected === marker.id}" role="button" @click="selected = marker.id">
                <Icon class="flex-shrink-0 text-primary" name="solar:map-point-favourite-bold" size="3rem" />
                <div class="border-start ps-3 w-100 h-100 text-break">
                  <h5 class="title">{{ marker.title }}</h5>
                  <p>{{ marker.description }}</p>
                </div>
              </div>
              <Transition name="fade" mode="out-in">
                <div v-if="edit" class="d-grid gap-1">
                  <button class="btn btn-primary" @click="editMarker(marker)">{{ t("edit") }}</button>
                  <button class="btn btn-danger" @click="deleteMarker(marker.id)">{{ t("delete") }}</button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalMarker v-if="markerModal" :marker="currentMarker" @close="closeMarkerModal" @submit="newMarker" />
    <ToastMessage v-if="moved.updated" :success="moved.success" :text="t('saved_changes')" @dispose="moved.updated = false" />
  </section>
</template>
