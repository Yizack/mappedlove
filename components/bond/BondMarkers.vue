<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";
</script>

<template>
  <div class="position-relative d-flex align-items-center gap-2 mb-2">
    <Icon class="text-primary" name="solar:map-point-favourite-bold" size="2rem" />
    <h2 class="m-0">{{ t("markers") }}</h2>
    <ButtonAdd @click="markerModal = true" />
    <button v-if="markers.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
  </div>
  <Draggable v-if="markers.length" v-model="markers" class="row g-2" item-key="id" v-bind="dragOptions" :disabled="!edit" @change="move" @start="drag = true" @end="drag = false">
    <TransitionGroup type="transition" :name="!drag ? 'flip-list' : undefined">
      <div v-for="marker in markers" :key="marker.id" class="col-12 col-md-4 col-xl-6 d-flex gap-2">
        <div class="marker border rounded-3 py-2 px-3 w-100 position-relative" :class="{'active' : selected === marker.id}" role="button" @click="selectMarker(marker.id)">
          <Icon v-if="edit" name="tabler:grip-horizontal" size="1rem" class="position-absolute start-50 bottom-0 translate-middle-x text-primary" />
          <div class="w-100 h-100 text-break">
            <h5 class="d-flex align-items-center gap-1">
              <span class="d-flex" :title="t(groups[marker.group].key)">
                <Icon :name="groups[marker.group].icon" class="text-primary" size="1.5rem" />
              </span>
              {{ marker.title }}
            </h5>
            <p class="m-0">{{ marker.description }}</p>
          </div>
        </div>
        <Transition name="fade" mode="out-in">
          <div v-if="edit" class="d-grid gap-1">
            <button class="btn btn-sm btn-primary" @click="editMarker(marker)">
              <Icon name="solar:pen-linear" size="1.5rem" />
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteMarker(marker.id)">
              <Icon name="solar:trash-bin-trash-linear" size="1.5rem" />
            </button>
          </div>
        </Transition>
      </div>
    </TransitionGroup>
  </Draggable>
  <p v-else class="m-0">{{ t("no_markers") }}</p>
  <ModalMarker v-if="markerModal" :marker="currentMarker" @close="closeModal" @submit="submitMarker" />
</template>

<script lang="ts">
export default {
  props: {
    allMarkers: {
      type: Array as () => MappedLoveMarker[],
      default: () => []
    },
    selected: {
      type: Number,
      default: 0
    }
  },
  emits: ["new", "delete", "select"],
  data () {
    return {
      markers: [] as MappedLoveMarker[],
      edit: false,
      markerModal: false,
      currentMarker: null as MappedLoveMarker | null,
      drag: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
    };
  },
  watch: {
    allMarkers (val) {
      this.markers = val;
      this.currentMarker = this.markers.find((marker) => marker.id === this.currentMarker?.id) || null;
    }
  },
  created () {
    this.markers = this.allMarkers;
  },
  methods: {
    async move () {
      const oldArrange = this.markers.map((marker) => ({ id: marker.id, order: marker.order }));
      const newArrange = this.markers.map((marker, index) => ({ id: marker.id, order: index }));
      await $fetch("/api/markers/rearrange", {
        method: "POST",
        body: { oldArrange, newArrange }
      }).catch(() => undefined);
    },
    selectMarker (id: number) {
      animate.value = false;
      animateElements();
      this.$emit("select", this.selected === id ? 0 : id);
    },
    editMarker (marker: MappedLoveMarker) {
      this.currentMarker = marker;
      this.markerModal = true;
    },
    async deleteMarker (id: number) {
      if (!confirm(t("delete_marker"))) return;
      const res = await $fetch(`/api/markers/${id}`, {
        method: "DELETE"
      }).catch(() => ({}));

      if (!("id" in res)) return;
      if (this.selected === id) this.$emit("select", 0);
      this.markers = this.markers.filter((marker) => marker.id !== id);
      this.$emit("delete", id);
    },
    closeModal () {
      this.markerModal = false;
      this.currentMarker = null;
    },
    submitMarker (event: any) {
      this.$emit("new", event);
    }
  }
};
</script>

<style>
.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
