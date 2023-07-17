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
      map: null as InstanceType<typeof this.$nuxt.$Leaflet> | null
    };
  },
  watch: {
    select (id) {
      const marker = this.map?.getMarker(id);
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        marker.openPopup();
        this.map?.setView([lat, lng], 7);
      }
    }
  },
  mounted () {
    if (!this.map) {
      this.map = new this.$nuxt.$Leaflet();
    }
    this.markers.forEach((marker) => {
      this.map?.addMarker({
        position: [marker.lat, marker.lng],
        popup: marker.title,
        group: t(this.$nuxt.payload.data.groups[marker.group].name),
        options: {
          id: marker.id,
          draggable: true
        }
      }).on("move", (e) => {
        const { id } = e.target.options;
        const { lat, lng } = e.target.getLatLng();
        debounce(`marker_${id}`, () => {
          console.info(id, [lat, lng]);
        }, 3000);
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
