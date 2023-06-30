<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

useFetch("/api/groups", { key: "groups" });

const markers = [
  {
    id: 1,
    lat: 48.8,
    lng: 2.3,
    group: 1,
    group_name: "places",
    bond: 1,
    title: "title",
    description: "desc",
    order: 1
  }
];

const markerModal = ref(false);
// const stories = [];
const selected = ref(0);

const submitMarker = (marker: any) => {
  console.log("fetch");
};
</script>

<template>
  <section>
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" :markers="markers" size="300px" :select="selected" />
      </div>
      <div class="col-12">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <div class="position-relative d-flex align-items-center gap-2 mb-2">
            <h2 class="m-0">{{ t("markers") }}</h2>
            <AddButton @click="markerModal = true" />
          </div>
          <div class="row g-2">
            <div v-for="marker of markers" :key="marker.id" class="col-sm-6 col-md-4 col-lg-3">
              <div class="marker d-flex gap-2 align-items-center border rounded-3 p-2" :class="{'active' : selected === marker.id}" role="button" @click="selected = marker.id">
                <Icon class="flex-shrink-0 text-primary" name="solar:map-point-favourite-bold" size="3rem" />
                <div class="border-start ps-3 w-100 h-100 text-break">
                  <h5 class="title">{{ marker.title }}</h5>
                  <p>{{ marker.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MarkerModal v-if="markerModal" @close="markerModal = false" @submit="submitMarker($event)" />
  </section>
</template>
