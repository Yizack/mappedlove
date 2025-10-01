<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";

const props = defineProps<{
  markers: MappedLoveMarker[];
  selected: number;
}>();

const emit = defineEmits(["new", "delete", "select", "edit"]);
const { $toasts, $bootstrap, $countries, $Leaflet } = useNuxtApp();

const edit = ref(false);
const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
  itemKey: "id"
};

const submitted = ref(false);
const markerModal = useModal("marker");

const form = useFormState({
  id: 0 as number,
  lat: null as number | null,
  lng: null as number | null,
  group: "" as string | number,
  title: "",
  description: "",
  order: 0,
  location: "",
  country: null as string | null
});

const markers = ref(props.markers);

const rearrange = () => {
  $fetch("/api/markers/rearrange", {
    method: "POST",
    body: {
      old: markers.value.map(marker => ({ id: marker.id, order: marker.order })),
      new: markers.value.map((marker, index) => ({ id: marker.id, order: index }))
    }
  }).then(() => {
    for (const [index, marker] of markers.value.entries()) {
      marker.order = index;
    }
  }).catch(() => {});
};

const selectMarker = (id: number) => {
  emit("select", id);
};

const openMarker = (marker?: MappedLoveMarker) => {
  if (!marker) form.reset();
  else {
    form.value = {
      ...marker,
      location: `${marker.lat}, ${marker.lng}`
    };
  }
  markerModal.value.show();
};

const deleteMarker = (id: number) => {
  if (!confirm(t("delete_marker"))) return;
  $fetch(`/api/markers/${id}`, {
    method: "DELETE"
  }).then(() => {
    if (props.selected === id) emit("select", 0);
    markers.value = markers.value.filter(marker => marker.id !== id);
    emit("delete", id);
  }).catch(() => {});
};

const groupIcon = computed(() => {
  const groupFound = groups.find((group, i) => i === form.value.group);
  return groupFound ? groupFound.icon : "solar:question-square-outline";
});

const selectLocation = (location: { lat: number, lng: number, label: string, country: string | null }) => {
  form.value.lat = location.lat;
  form.value.lng = location.lng;
  const address = location.label.split(", ");
  form.value.title = address.shift() || "";
  form.value.description = address.join(", ");
  form.value.country = location.country;
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
  markerModal.value.hide();
};

watch(() => props.markers, (value) => {
  markers.value = value;
});

const toggleEdit = () => {
  edit.value = !edit.value;
  emit("edit", edit.value);
};

const loading = ref(false);
const refreshCountry = async () => {
  loading.value = true;
  const { user } = useUserSession();
  const results = await $Leaflet.geoSearch([form.value.lat, form.value.lng].join(" "), {
    email: user.value!.email,
    lang: "en"
  });
  loading.value = false;

  if (!results.length) {
    $toasts.add({ message: t("could_not_find_country"), success: false });
    return;
  }

  form.value.country = results[0]?.raw.address?.country_code || null;
};

onMounted(() => {
  $bootstrap.initializePopover();
});
</script>

<template>
  <div class="position-relative d-flex align-items-center gap-2 mb-2">
    <Icon class="text-primary flex-shrink-0" name="solar:map-point-favourite-bold" size="2rem" />
    <h2 class="m-0">{{ t("markers") }}</h2>
    <span v-if="markers.length">(<span class="text-primary">{{ markers.length }}</span>)</span>
    <button class="btn btn-primary btn-sm rounded-circle p-1" role="button" @click="openMarker()">
      <Icon name="tabler:plus" size="2em" />
    </button>
    <button v-if="markers.length" type="button" class="btn btn-primary btn-lg ms-auto rounded-pill" @click="toggleEdit">
      {{ edit ? t("done") : t("edit") }}
    </button>
    <Icon v-if="markers.length" name="solar:question-circle-linear" class="text-primary outline-none flex-shrink-0" size="1.3rem" data-bs-toggle="popover" :data-bs-content="t('markers_map_edit_info')" :style="{ cursor: 'help' }" />
  </div>
  <VueDraggable v-if="markers.length" v-model="markers" class="markers row g-2" v-bind="dragOptions" :disabled="!edit" @update="rearrange">
    <div v-for="marker of markers" :key="marker.id" class="col-12 col-md-4 col-xl-6 d-flex gap-2">
      <div class="marker border rounded-3 py-2 px-3 w-100 position-relative" :class="{ active: selected === marker.id }" :style="{ cursor: edit ? 'grab' : 'default' }" @click="selectMarker(marker.id)">
        <div class="w-100 h-100 text-break">
          <h5 class="mb-1">
            <Icon :name="groups[marker.group]!.icon" class="text-primary me-1" size="1.5rem" :title="t(groups[marker.group]!.key)" :style="{ verticalAlign: 'middle' }" mode="css" />
            <Twemoji v-if="marker.country" :emoji="$countries.getEmoji(marker.country)" class="me-1" size="1.1em" :title="$countries.getName(marker.country)" png />
            <span>{{ marker.title }}</span>
          </h5>
          <p class="m-0">{{ marker.description }}</p>
        </div>
        <Icon class="position-absolute end-0 top-0 text-primary mt-2" name="tabler:dots-vertical" size="1.3rem" role="button" data-bs-toggle="dropdown" aria-expanded="false" @click.stop />
        <div class="dropdown">
          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-item d-flex gap-1 align-items-center" role="button" @click.stop="openMarker(marker)">
              <Icon name="solar:pen-linear" />
              <span>{{ t("edit") }}</span>
            </li>
            <li class="dropdown-item d-flex gap-1 align-items-center" role="button" @click.stop="deleteMarker(marker.id)">
              <Icon name="solar:trash-bin-trash-linear" />
              <span>{{ t("delete") }}</span>
            </li>
          </ul>
        </div>
        <Icon v-if="edit" name="tabler:grip-horizontal" size="1rem" class="position-absolute start-50 bottom-0 translate-middle-x text-primary" />
      </div>
    </div>
  </VueDraggable>
  <p v-else class="m-0">{{ t("no_markers") }}</p>
  <BsModal id="marker" v-model="markerModal" :title="t('marker')" lg>
    <form @submit.prevent="submitMarker">
      <div class="d-flex align-items-center gap-2 mb-2">
        <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
        <p class="m-0">{{ t("location_info") }}</p>
      </div>
      <MapGeoSearch class="mb-2" :value="form.location" @select="selectLocation" />
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
          <Twemoji :emoji="$countries.getEmoji(form.country) || '1f3f3'" size="2rem" png />
        </span>
        <div class="form-floating">
          <input :value="$countries.getName(form.country)" type="text" class="form-control" :placeholder="t('country')" disabled>
          <label>{{ t("country") }}</label>
        </div>
        <button v-if="form.id && form.lat && form.lng && !form.country" type="button" class="btn btn-primary" :disabled="loading" @click="refreshCountry">
          <SpinnerCircle v-if="loading" class="text-light" small />
          <Icon v-else name="solar:refresh-bold-duotone" size="1.5rem" />
        </button>
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
  </BsModal>
</template>
