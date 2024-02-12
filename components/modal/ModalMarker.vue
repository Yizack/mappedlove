<script setup lang="ts">
const props = defineProps({
  marker: {
    type: Object as () => MappedLoveMarker | null,
    default: () => null
  }
});

const emit = defineEmits(["close", "submit"]);

const { $bootstrap, $toasts } = useNuxtApp();

const submitted = ref(false);
const location = ref("");
const modal = ref() as Ref<HTMLElement>;
const { form } = useFormState({
  lat: null as number | null,
  lng: null as number | null,
  group: "" as string | number,
  title: "",
  description: "",
  order: 0
});

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
  if (typeof form.value.lat === "number" && typeof form.value.lng === "number") {
    submitted.value = true;
    const marker = await $fetch(props.marker ? `/api/markers/${props.marker.id}` : "/api/markers", {
      method: props.marker ? "PATCH" : "POST",
      body: form.value
    }).catch(() => null);
    submitted.value = false;
    if (!marker) return;
    emit("submit", { marker, edit: Boolean(props.marker) });
    $toasts.add({ message: props.marker ? t("marker_updated") : t("marker_added"), success: true });
    $bootstrap.hideModal(modal.value);
  }
};

onMounted(() => {
  if (props.marker) {
    Object.assign(form, props.marker);
    location.value = `${props.marker.lat}, ${props.marker.lng}`;
  }
  const m = $bootstrap.showModal(modal.value);
  m.addEventListener("hidden.bs.modal", () => {
    emit("close", form);
  });
});

watch(() => props.marker, (marker) => {
  if (marker) location.value = `${marker.lat}, ${marker.lng}`;
});
</script>

<template>
  <div id="modal" ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ t("marker") }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitMarker">
            <div class="d-flex align-items-center gap-2 mb-2">
              <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
              <p class="m-0">{{ t("location_info") }}</p>
            </div>
            <GeoSearch class="mb-2" :value="location" @select="selectLocation" />
            <div class="form-floating mb-2">
              <input v-model.trim="form.title" type="text" class="form-control" :placeholder="t('title')" required>
              <label>{{ t("title") }}</label>
            </div>
            <div class="form-floating mb-2">
              <textarea v-model.trim="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{height: '100px'}" />
              <label>{{ t("description") }}</label>
            </div>
            <div class="form-floating mb-2">
              <Icon :name="groupIcon" class="position-absolute top-50 start-0 mx-2 translate-middle-y text-primary z-3" size="2rem" />
              <select v-model="form.group" class="form-select ps-5" :placeholder="t('group')" required>
                <option value="" disabled>{{ t("select_group") }}</option>
                <option v-for="(group, i) of groups" :key="i" :value="i">{{ t(group.key) }}</option>
              </select>
              <label class="ps-5 ms-1">{{ t("group") }}</label>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="submitted">
                <SpinnerCircle v-if="submitted" class="text-light" />
                <span v-else>{{ marker ? t("edit_marker") : t("add_marker") }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
