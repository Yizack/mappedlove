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

const emit = defineEmits(["new", "delete", "select", "edit"]);
const { $toasts } = useNuxtApp();

const edit = ref(false);
const drag = ref(false);
const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
};

const submitted = ref(false);
const markerController = useModalController("marker");

const form = useFormState({
  id: 0 as number,
  lat: null as number | null,
  lng: null as number | null,
  group: "" as string | number,
  title: "",
  description: "",
  order: 0,
  location: ""
});

const markers = ref(props.markers);

const move = async () => {
  const oldArrange = markers.value.map(marker => ({ id: marker.id, order: marker.order }));
  const newArrange = markers.value.map((marker, index) => ({ id: marker.id, order: index }));
  await $fetch("/api/markers/rearrange", {
    method: "POST",
    body: { oldArrange, newArrange }
  }).catch(() => undefined);
};

const selectMarker = (id: number) => {
  animateElements();
  emit("select", id);
};

const markerModal = (marker?: MappedLoveMarker) => {
  if (!marker) form.reset();
  else {
    form.value = {
      ...marker,
      location: `${marker.lat}, ${marker.lng}`
    };
  }
  markerController.value.show();
};

const deleteMarker = async (id: number) => {
  if (!confirm(t("delete_marker"))) return;
  const res = await $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).catch(() => null);

  if (!res || !res.id) return;
  if (props.selected === id) emit("select", 0);
  markers.value = markers.value.filter(marker => marker.id !== id);
  emit("delete", id);
};

const groupIcon = computed(() => {
  const groupFound = groups.find((group, i) => i === form.value.group);
  return groupFound ? groupFound.icon : "solar:question-square-outline";
});

const selectLocation = ({ lat, lng, label }: { lat: number, lng: number, label: string }) => {
  form.value.lat = lat;
  form.value.lng = lng;
  const address = label.split(", ");
  form.value.title = address.shift() || "";
  form.value.description = address.join(", ");
};

const submitMarker = async () => {
  if (typeof form.value.lat !== "number" && typeof form.value.lng !== "number") return;
  submitted.value = true;
  const marker = await $fetch(form.value.id ? `/api/markers/${form.value.id}` : "/api/markers", {
    method: form.value.id ? "PUT" : "POST",
    body: form.value
  }).catch(() => null);
  submitted.value = false;
  if (!marker) return;

  if (form.value.id) {
    const index = markers.value.findIndex(item => item.id === form.value.id);
    markers.value[index] = marker;
  }
  else {
    markers.value.push(marker);
    emit("new", { marker });
  }
  $toasts.add({ message: form.value.id ? t("marker_updated") : t("marker_added") });
  markerController.value.hide();
};

watch(() => props.markers, (value) => {
  markers.value = value;
});
</script>

<template>
  <div class="position-relative d-flex align-items-center gap-2 mb-2">
    <Icon class="text-primary" name="solar:map-point-favourite-bold" size="2rem" />
    <h2 class="m-0">{{ t("markers") }}</h2>
    <ButtonAdd @click="markerModal()" />
    <button v-if="markers.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="edit = !edit">{{ edit ? t("done") : t("edit") }}</button>
  </div>
  <Draggable v-if="markers.length" v-model="markers" class="row g-2" item-key="id" v-bind="dragOptions" :disabled="!edit" @change="move" @start="drag = true" @end="drag = false">
    <TransitionGroup type="transition" :name="!drag ? 'flip-list' : undefined">
      <div v-for="marker of markers" :key="marker.id" class="col-12 col-md-4 col-xl-6 d-flex gap-2">
        <div class="marker border rounded-3 py-2 px-3 w-100 position-relative" :class="{ active: selected === marker.id }" role="button" @click="selectMarker(marker.id)">
          <Icon v-if="edit" name="tabler:grip-horizontal" size="1rem" class="position-absolute start-50 bottom-0 translate-middle-x text-primary" />
          <div class="w-100 h-100 text-break">
            <h5 class="d-flex align-items-center gap-1">
              <span class="d-flex" :title="t(groups[marker.group]!.key)">
                <Icon :name="groups[marker.group]!.icon" class="text-primary" size="1.5rem" />
              </span>
              {{ marker.title }}
            </h5>
            <p class="m-0">{{ marker.description }}</p>
          </div>
        </div>
        <Transition name="fade" mode="out-in">
          <div v-if="edit" class="d-grid gap-1">
            <button class="btn btn-sm btn-primary" @click="markerModal(marker)">
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
  <ModalController id="marker" v-model="markerController" :title="t('marker')" lg>
    <form @submit.prevent="submitMarker">
      <div class="d-flex align-items-center gap-2 mb-2">
        <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
        <p class="m-0">{{ t("location_info") }}</p>
      </div>
      <GeoSearch class="mb-2" :value="form.location" @select="selectLocation" />
      <div class="form-floating mb-2">
        <input v-model.trim="form.title" type="text" class="form-control" :placeholder="t('title')" required>
        <label>{{ t("title") }}</label>
      </div>
      <div class="form-floating mb-2">
        <textarea v-model.trim="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{ height: '100px' }" />
        <label>{{ t("description") }}</label>
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text bg-body">
          <Icon :name="groupIcon" class="text-primary" size="2rem" />
        </span>
        <div class="form-floating">
          <select v-model="form.group" class="form-select" :placeholder="t('group')" required>
            <option value="" disabled>{{ t("select_group") }}</option>
            <option v-for="(group, i) of groups" :key="i" :value="i">{{ t(group.key) }}</option>
          </select>
          <label>{{ t("group") }}</label>
        </div>
      </div>
      <div class="d-flex justify-content-between gap-2">
        <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
        <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="submitted">
          <SpinnerCircle v-if="submitted" class="text-light" />
          <span v-else>{{ form.id ? t("edit_marker") : t("add_marker") }}</span>
        </button>
      </div>
    </form>
  </ModalController>
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
