<script setup lang="ts">
const props = defineProps({
  bond: {
    type: Object as () => MappedLovePublicMap,
    required: true
  },
  select: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["moved", "select"]);

const { $Leaflet, $bootstrap } = useNuxtApp();
const leaflet = ref<InstanceType<typeof $Leaflet>>();
const markers = ref(props.bond.markers);
const stories = ref(props.bond.stories);
const map = ref() as Ref<HTMLElement>;

const addMarker = (marker: MappedLoveMarker) => {
  const markerStories = stories.value.filter(s => s.marker === marker.id) || [];
  leaflet.value?.addMarker({
    position: [marker.lat, marker.lng],
    popup: storiesCarousel(marker, markerStories),
    group: getGroup(marker.group),
    options: {
      id: marker.id,
      draggable: false
    }
  }).on("popupopen", (e) => {
    setTimeout(() => $bootstrap.startAllCarousel());
    if (props.select === e.target.options.id) return;
    emit("select", e.target.options.id);
  });
};

const setView = (latlng: [number, number], zoom?: number) => {
  leaflet.value?.setView(latlng, zoom);
};

onMounted(() => {
  if (!leaflet.value) {
    leaflet.value = new $Leaflet();
    leaflet.value.createGroups(getGroups());
    leaflet.value.createMap(map.value);
  }
  for (const marker of markers.value) {
    addMarker(marker);
  }
  const length = markers.value.length;
  if (length) {
    setView([markers.value[length - 1]!.lat, markers.value[length - 1]!.lng], 3);
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
</script>

<template>
  <div ref="map" class="w-100 h-100 position-absolute" />
</template>
