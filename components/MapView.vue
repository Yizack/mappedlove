<template>
  <div ref="map" class="w-100 rounded-3 shadow-sm border bg-body" :style="{height: size}" />
</template>

<script lang="ts">
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    markers: {
      type: Array as () => Array<any>,
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
  },
  data () {
    return {
      map: new this.$nuxt.$Leaflet("") || null
    };
  },
  watch: {
    select (id) {
      const marker = this.map.getMarker(id);
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        marker.openPopup();
        this.map.setView([lat, lng], 7);
      }
    }
  },
  mounted () {
    if (!this.map) {
      const { user } = useUserSession();
      this.map = new this.$nuxt.$Leaflet(user.value.email);
    }
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
      // @ts-ignore
      this.map.createMap(this.$refs.map).setView([lat, lng]);
    }
  }
};
</script>
