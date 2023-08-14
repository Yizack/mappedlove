<script setup lang="ts">
definePageMeta({ layout: "app", middleware: "session" });

const { data: bondMap } = await useFetch("/api/bond/map", { key: "bondMap" });

const markers = ref(bondMap.value?.markers || []);
const stories = ref(bondMap.value?.stories || []);

const selected = ref(0);

const map = ref();
const moved = reactive({
  success: false,
  updated: false
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

const movedPosition = (marker: MappedLoveMarker) => {
  if (marker.id) moved.success = true;
  moved.updated = true;
  markers.value = markers.value.map((item) => {
    if (item.id === marker.id) return marker;
    return item;
  });
};

const removeMarker = (id: number) => {
  map.value.removeMarker(id);
}

const selectedMarker = computed(() => {
  return {
    ...markers.value.find(marker => marker.id === selected.value) as MappedLoveMarker,
    stories: stories.value.filter(s => s.marker === selected.value) as MappedLoveStory[]
  };
});

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
}

const removeStory = (id: number) => {
  stories.value = stories.value.filter((story) => story.id !== id);
}
</script>

<template>
  <main class="h-100">
    <div class="row g-2">
      <div class="col-12">
        <MapView id="map" ref="map" :markers="markers" size="60vh" :select="selected" @moved="movedPosition" />
      </div>
      <div class="col-12 col-xl-5">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4">
          <BondMarkers :all-markers="markers" @delete="removeMarker" @new="newMarker" @select="selected = $event" />
        </div>
      </div>
      <div class="col-12 col-xl-7">
        <div class="bg-body rounded-3 px-3 py-4 p-lg-4 h-100">
          <BondStories :marker="selectedMarker" :stories="selectedMarker.stories" @new="newStory" @delete="removeStory" />
        </div>
      </div>
    </div>
    <ToastMessage v-if="moved.updated" :success="moved.success" :text="t('saved_changes')" @dispose="moved.updated = false" />
  </main>
</template>
