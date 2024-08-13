<script setup lang="ts">
import type { LeafletEvent } from "leaflet";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  markers: {
    type: Array as () => MappedLoveMarker[],
    required: true
  },
  stories: {
    type: Array as () => MappedLoveStory[],
    required: true
  },
  size: {
    type: String,
    default: "600px"
  },
  select: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["moved", "select"]);

const { $Leaflet, $bootstrap } = useNuxtApp();
const leaflet = ref<InstanceType<typeof $Leaflet>>();
const map = ref<HTMLElement>();
const movedMarker = ref<LeafletEvent>();

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
      id: marker.id,
      draggable: true
    }
  }).on("move", (e) => {
    movedMarker.value = e;
  }).on("popupopen", (e) => {
    setTimeout(() => $bootstrap.startAllCarousel());
    if (props.select === e.target.options.id) return;
    emit("select", e.target.options.id);
  });
};

watchDebounced(movedMarker, async (e) => {
  if (!e) return;
  const { id } = e.target.options;
  const { lat, lng } = e.target.getLatLng();
  const update = await $fetch(`/api/markers/${id}`, {
    method: "PATCH",
    body: { lat, lng }
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

watch(() => props.select, (id) => {
  const marker = leaflet.value?.getMarker(id);
  if (!props.select) leaflet.value?.closeAllPopups();
  if (marker) {
    const { lat, lng } = marker.getLatLng();
    marker.openPopup();
    setView([lat, lng]);
  }
});

defineExpose({ removeMarker, addMarker, setView });
</script>

<template>
  <div ref="map" class="w-100 shadow-sm bg-body" :style="{ height: size }" />
</template>
