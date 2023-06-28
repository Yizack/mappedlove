<template>
  <div ref="map" class="w-100 rounded-3 shadow-sm border bg-body" :style="{height: size}" />
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    markers: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: "600px"
    },
    open: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      map: null
    };
  },
  watch: {
    open (id) {
      const marker = this.map.getMarker(id);
      const { lat, lng } = marker.getLatLng();
      marker.openPopup();
      this.map.setView([lat, lng], 7);
    }
  },
  mounted () {
    this.map = new this.$nuxt.$Leaflet();
    this.markers.forEach((marker) => {
      this.map.addMarker({
        position: [marker.lat, marker.lng],
        popup: marker.title,
        group: marker.group_name,
        options: {
          id: marker.id,
          draggable: true
        }
      }).on("move", (e) => {
        const { markerId } = e.target.options;
        console.info(markerId, e.target.getLatLng());
      });
    });

    if (this.markers.length) {
      const { lat, lng } = this.markers[this.markers.length - 1];
      this.map.createMap(this.$refs.map).setView([lat, lng], 3);
    }
  }
};
</script>
