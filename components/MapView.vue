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
      type: Array as () => Array<MappedLoveMarker>,
      required: true
    },
    stories: {
      type: Array as () => Array<MappedLoveStory>,
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
  emits: ["moved", "select"],
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
    removeMarker (id: number) {
      this.map?.removeMarker(id);
    },
    addMarker (marker: any) {
      const stories = this.stories.filter(s => s.marker === marker.id) || [];
      this.map?.addMarker({
        position: [marker.lat, marker.lng],
        popup: stories.length
          ?
          `
          <div id="storyCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner">`
              + stories.map(({ id, updatedAt }, index) => {
                return `
                <div class="carousel-item ${!index ? "active" : ""} d-flex justify-content-center">
                  <div class="position-relative">
                    <img src="${getStoryImageFromUser(id)}?updated=${updatedAt}" class="rounded-circle" width="75" height="75" style="object-fit: cover;">
                    <div class="position-absolute end-0 top-0 rounded-pill bg-primary text-white px-2 py-1 border border-white small fw-bold">${stories.length}</div>
                  </div>
                </div>`;
              }).join("")
            + `</div>
            </div>
          </div>
          <div class="mt-2 text-center fw-bold">${marker.title}</div>`
          : `<div class="mt-2 text-center fw-bold">${marker.title}</div>`,
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
          }).catch(() => undefined);
          if (!update) return;
          this.$emit("moved", update);
        }, 3000);
      }).on("popupopen", (e) => {
        this.$nuxt.$bootstrap.startAllCarousel();
        this.$emit("select", e.target.options.id);
      });
    },
    setView (latlng: [number, number], zoom?: number) {
      this.map?.setView(latlng, zoom);
    }
  }
};
</script>
