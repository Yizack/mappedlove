<script setup lang="ts">
import { VueDraggableNext as Draggable } from "vue-draggable-next";

const props = defineProps({
  markers: {
    type: Array as () => MappedLoveMarker[],
    default: () => []
  },
  selected: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["new", "delete", "select" , "edit"]);

const edit = ref(false);
const markerModal = ref(false);
const currentMarker = ref<MappedLoveMarker>();
const drag = ref(false);
const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
};

const markers = ref(props.markers);

const move = async () => {
  const oldArrange = markers.value.map((marker) => ({ id: marker.id, order: marker.order }));
  const newArrange = markers.value.map((marker, index) => ({ id: marker.id, order: index }));
  await $fetch("/api/markers/rearrange", {
    method: "POST",
    body: { oldArrange, newArrange }
  }).catch(() => undefined);
};

const selectMarker = (id: number) => {
  animate.value = false;
  animateElements();
  emit("select", props.selected === id ? 0 : id);
};

const editMarker = (marker: MappedLoveMarker) => {
  currentMarker.value = marker;
  markerModal.value = true;
};

const deleteMarker = async (id: number) => {
  if (!confirm(t("delete_marker"))) return;
  const res = await $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).catch(() => ({}));

  if (!("id" in res)) return;
  if (props.selected === id) emit("select", 0);
  markers.value = markers.value.filter((marker) => marker.id !== id);
  emit("delete", id);
};

const closeModal = () => {
  markerModal.value = false;
  currentMarker.value = undefined;
};

const submitMarker = (marker: any) => emit("new", marker);

watch(() => props.markers, (value) => {
  markers.value = value;
  currentMarker.value = markers.value.find((marker) => marker.id === currentMarker.value?.id) || undefined;
});
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
      <div v-for="marker of markers" :key="marker.id" class="col-12 col-md-4 col-xl-6 d-flex gap-2">
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
