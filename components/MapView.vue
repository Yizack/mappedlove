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
  emits: ["moved"],
  data () {
    return {
      map: null as InstanceType<typeof this.$nuxt.$Leaflet> | null
    };
  },
  expose: ["removeMarker", "addMarker", "setView"],
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
      this.map.createGroups(getGroups());
      // @ts-ignore
      this.map.createMap(this.$refs.map);
    }
    this.markers.forEach((marker) => {
      this.addMarker(marker);
    });
    const length = this.markers.length;
    if (length) {
      this.map.setView([this.markers[length - 1].lat, this.markers[length - 1].lng], 3);
    }
  },
  methods: {
    removeMarker (id: number) {
      this.map?.removeMarker(id);
    },
    addMarker (marker: any) {
      this.map?.addMarker({
        position: [marker.lat, marker.lng],
        popup: marker.title,
        group: getGroup(marker.group),
        options: {
          id: marker.id,
          draggable: true
        }
      }).on("move", (e) => {
        const { id } = e.target.options;
        const { lat, lng } = e.target.getLatLng();
        debounce(`marker_${id}`, async () => {
          const update = await $fetch(`/api/markers/${id}`, {
            method: "PATCH",
            body: { lat, lng }
          }).catch(() => ({}));
          if (!("id" in update)) return;
          this.$emit("moved", update);
        }, 3000);
      });
    },
    setView (latlng: [number, number], zoom: number) {
      this.map?.setView(latlng, zoom);
    }
  }
};
</script>
