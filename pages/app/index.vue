<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

useFetch("/api/groups", { key: "groups" });

const markers: Ref<Array<any>> = ref([]);

const { data: getMarkers } = await useFetch("/api/markers");
if (getMarkers.value) {
  markers.value = getMarkers.value;
}

const markerModal = ref(false);
// const stories = [];
const selected = ref(0);
const edit = ref(false);

const newMarker = async (marker: any) => {
  markers.value.push(marker);
};

const deleteMarker = async (id: number) => {
  if (!confirm("Are you sure you want to delete this marker?")) return;
  const res = await $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).catch(() => ({}));

  if (!("id" in res)) return;
  markers.value = markers.value.filter((marker) => marker.id !== id);
};
</script>

<template>
  <section>
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" :markers="markers" size="60vh" :select="selected" />
      </div>
      <div class="col-12">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <h2 class="m-0">{{ t("markers") }}</h2>
            <AddButton @click="markerModal = true" />
            <button type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
          </div>
          <div class="row g-2">
            <div v-for="marker of markers" :key="marker.id" class="col-sm-6 col-md-4 col-lg-3 d-flex gap-2">
              <div class="marker d-flex gap-2 align-items-center border rounded-3 p-2 w-100" :class="{'active' : selected === marker.id}" role="button" @click="selected = marker.id">
                <Icon class="flex-shrink-0 text-primary" name="solar:map-point-favourite-bold" size="3rem" />
                <div class="border-start ps-3 w-100 h-100 text-break">
                  <h5 class="title">{{ marker.title }}</h5>
                  <p>{{ marker.description }}</p>
                </div>
              </div>
              <Transition name="fade" mode="out-in">
                <div v-if="edit" class="d-grid gap-1">
                  <button class="btn btn-primary">{{ t("edit") }}</button>
                  <button class="btn btn-danger" @click="deleteMarker(marker.id)">{{ t("delete") }}</button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MarkerModal v-if="markerModal" @close="markerModal = false" @submit="newMarker($event)" />
  </section>
</template>
