<script setup>
onMounted(() => {
  const { $Leaflet } = useNuxtApp();
  const map = new $Leaflet();
  const marker = map.addMarker({
    position: [48.8, 2.3],
    popup: "A pretty CSS popup.<br> Easily customizable.",
    group: "Places",
    options: {
      draggable: true
    }
  });
  marker.on("move", (e) => {
    console.info(e.target.getLatLng());
  });
  map.createMap("map");
});
</script>

<template>
  <div class="container-fluid">
    <MapView id="map" />
  </div>
</template>
