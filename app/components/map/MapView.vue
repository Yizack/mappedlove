<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string;
  markers: MappedLoveMarker[];
  stories: MappedLoveStory[];
  size?: string;
  selected: number;
  draggable?: boolean;
}>(), {
  size: "600px"
});

const emit = defineEmits(["moved", "select"]);

const { $Leaflet, $bootstrap } = useNuxtApp();
const leaflet = ref<InstanceType<typeof $Leaflet>>();
const map = ref<HTMLElement>();
const movedMarker = ref<{ id: number, lat: number, lng: number }>();

const removeMarker = (id: number) => {
  leaflet.value?.removeMarker(id);
};

const addMarker = (marker: MappedLoveMarker) => {
  const stories = props.stories.filter(s => s.marker === marker.id) || [];
  leaflet.value?.addMarker({
    position: [marker.lat, marker.lng],
    popup: storiesCarousel(marker, stories),
    group: getGroup(marker.group),
    options: {
      id: marker.id
    }
  }).on("move", (e) => {
    movedMarker.value = { id: marker.id, lat: e.latlng.lat, lng: e.latlng.lng };
  }).on("popupopen", () => {
    setTimeout(() => $bootstrap.startAllCarousel());
    if (props.selected === marker.id) return;
    emit("select", marker.id);
  });
};

watchDebounced(movedMarker, async (e) => {
  if (!e) return;
  const update = await $fetch(`/api/markers/${e.id}`, {
    method: "PATCH",
    body: { lat: e.lat, lng: e.lng }
  }).catch(() => null);
  if (!update) return;
  emit("moved", update);
}, { debounce: 3000 });

const setView = (latlng: [number, number], zoom?: number) => {
  leaflet.value?.setView(latlng, zoom);
};

onMounted(() => {
  if (!leaflet.value) {
    leaflet.value = new $Leaflet();
    leaflet.value.createGroups(getGroups());
    if (!map.value) return;
    leaflet.value.createMap(map.value);
  }
  for (const marker of props.markers) {
    addMarker(marker);
  }
  const length = props.markers.length;
  if (length) {
    setView([props.markers[length - 1]!.lat, props.markers[length - 1]!.lng], 3);
  }
});

watch(() => props.selected, (id) => {
  const marker = leaflet.value?.getMarker(id);
  if (!props.selected) leaflet.value?.closeAllPopups();
  if (marker) {
    const { lat, lng } = marker.getLatLng();
    marker.openPopup();
    setView([lat, lng]);
  }
});

watch(() => props.draggable, (draggable) => {
  leaflet.value?.setMarkersDragging(draggable);
});

defineExpose({ removeMarker, addMarker, setView });
</script>

<template>
  <div ref="map" class="w-100 shadow-sm bg-body" :style="{ height: size }" />
</template>
