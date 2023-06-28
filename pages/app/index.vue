<script setup>
definePageMeta({ layout: "app", middleware: "session" });

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
  },
  {
    id: 2,
    lat: 48.8,
    lng: 4.3,
    group: 1,
    group_name: "places",
    bond: 1,
    title: "title",
    description: "desc",
    order: 1
  }
];

const stories = [];
const selected = ref(0);
</script>

<template>
  <div class="container-fluid">
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" :markers="markers" size="300px" :open="selected" />
      </div>
      <div class="col-12">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <h1>{{ t("markers") }}</h1>
          <div class="row g-2">
            <div v-for="marker of markers" :key="marker.id" class="col-sm-6 col-md-4 col-lg-3">
              <div class="marker d-flex gap-2 align-items-center border rounded p-3" :class="{'active' : selected === marker.id}" role="button" @click="selected = marker.id">
                <Icon class="flex-shrink-0" name="solar:map-point-favourite-bold-duotone" size="3rem" />
                <div class="border-start ps-3 w-100 h-100 text-break">
                  <h5 class="title">{{ marker.title }}</h5>
                  <p>{{ marker.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <h1>{{ t("stories") }}</h1>
          <div class="row">
            <div v-for="marker of stories" :key="marker.id" class="col-lg-4">
              <div class="d-flex gap-2 align-items-center border rounded p-3">
                <Icon class="flex-shrink-0" name="solar:map-point-favourite-bold-duotone" size="3rem" />
                <div class="border-start ps-3 w-100 h-100 text-break">
                  <h5>{{ marker.title }}</h5>
                  <p>{{ marker.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
