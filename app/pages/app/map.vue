<script setup lang="ts">
import type MapView from "~/components/map/MapView.vue";

definePageMeta({ layout: "app-map", middleware: "session" });

const { data: bondMap } = await useFetch("/api/bond/map");

const { $toasts } = useNuxtApp();

const markers = ref(bondMap.value?.markers || []);
const stories = ref(bondMap.value?.stories || []);

const selected = ref(0);
const draggable = ref(false);

const map = useTemplateRef<InstanceType<typeof MapView>>("map");

const newMarker = ({ marker }: { marker: MappedLoveMarker }) => {
  if (!map.value) return;
  map.value.addMarker(marker);
  map.value.setView([marker.lat, marker.lng], 10);
  selected.value = marker.id;
};

const movedPosition = (marker: MappedLoveMarker) => {
  $toasts.add({ success: Boolean(marker.id), message: t("saved_changes") });
  markers.value = markers.value.map((item) => {
    if (item.id === marker.id) return marker;
    return item;
  });
};

const removeMarker = (id: number) => {
  if (!map.value) return;
  map.value.removeMarker(id);
  $toasts.add({ success: true, message: t("marker_deleted") });
};

const selectedMarker = computed(() => ({
  ...markers.value.find(marker => marker.id === selected.value) as MappedLoveMarker,
  stories: stories.value.filter(s => s.marker === selected.value) as MappedLoveStory[]
}));

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

const removeStory = (id: number) => {
  stories.value = stories.value.filter(story => story.id !== id);
};

const selectMarker = (id: number) => {
  selected.value = selected.value === id ? 0 : id;
};

const toggleEdit = (edit: boolean) => {
  draggable.value = edit;
};

useSeo({
  title: `${t("map")} | ${SITE.name}`,
  robots: false
});
</script>

<template>
  <main>
    <MapView id="map" ref="map" v-bind="{ markers, stories, selected, draggable }" size="60vh" @moved="movedPosition" @select="selectMarker" />
    <div class="row g-2 m-0 p-2 pt-0">
      <div class="col-12 col-xl-5">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <BondMarkers v-bind="{ markers, selected }" @delete="removeMarker" @new="newMarker" @select="selectMarker" @edit="toggleEdit" />
        </div>
      </div>
      <div class="col-12 col-xl-7">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 h-100">
          <BondStories :marker="selectedMarker" @new="newStory" @delete="removeStory" />
        </div>
      </div>
    </div>
  </main>
</template>
