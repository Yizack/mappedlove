<template>
  <div ref="map" class="w-100 h-100 position-absolute" />
</template>

<script lang="ts">
export default {
  props: {
    bond: {
      type: Object as () => MappedLovePublicMap,
      required: true
    },
    select: {
      type: Number,
      default: 0
    }
  },
  emits: ["moved", "select"],
  data () {
    return {
      map: null as InstanceType<typeof this.$nuxt.$Leaflet> | null,
      markers: this.bond.markers,
      stories: this.bond.stories
    };
  },
  watch: {
    select (id) {
      const marker = this.map?.getMarker(id);
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        marker.openPopup();
        this.setView([lat, lng]);
      }
    }
  },
  mounted () {
    if (!this.map) {
      this.map = new this.$nuxt.$Leaflet();
      this.map.createGroups(getGroups());
      this.map.createMap(this.$refs.map as HTMLElement);
    }

    for (const marker of this.markers) {
      this.addMarker(marker);
    }
    const length = this.markers.length;
    if (length) {
      this.setView([this.markers[length - 1].lat, this.markers[length - 1].lng], 3);
    }
  },
  methods: {
    addMarker (marker: any) {
      const stories = this.stories.filter(s => s.marker === marker.id) || [];
      this.map?.addMarker({
        position: [marker.lat, marker.lng],
        popup: storiesCarousel(marker, stories, this.bond.code),
        group: getGroup(marker.group),
        options: {
          id: marker.id,
          draggable: false
        }
      }).on("popupopen", (e) => {
        setTimeout(() => this.$nuxt.$bootstrap.startAllCarousel());
        this.$emit("select", e.target.options.id);
      });
    },
    setView (latlng: [number, number], zoom?: number) {
      this.map?.setView(latlng, zoom);
    }
  }
};
</script>
