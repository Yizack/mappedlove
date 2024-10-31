<script setup lang="ts">
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider.js";

const props = defineProps({
  value: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["select"]);

const { $Leaflet } = useNuxtApp();

const search = ref(false);
const array = ref<SearchResult[]>([]);
const text = ref("");
const loading = ref(false);
const selected = ref(false);

const select = (result: SearchResult) => {
  search.value = false;
  text.value = `${result.y}, ${result.x}`;
  selected.value = true;
  emit("select", { lat: result.y, lng: result.x, label: result.label });
};

const changeLocation = () => {
  text.value = "";
  selected.value = false;
  emit("select", { lat: null, lng: null, label: "" });
};

watchDebounced(text, async (value) => {
  try {
    if (!search.value) return;
    if (!value) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "No text provided" });
    const { user } = useUserSession() as MappedLoveSessionComposable;
    array.value = await $Leaflet.geoSearch(value, {
      email: user.value.email,
      lang: "en"
    });
    loading.value = false;
  }
  catch {
    emit("select", { lat: null, lng: null, label: "" });
    array.value = [];
    loading.value = false;
  }
}, { debounce: 2000 });

watch(text, (value) => {
  if (!value || selected.value) return;
  search.value = true;
  loading.value = true;
});

onMounted(() => {
  if (props.value) selected.value = true;
  text.value = props.value;
});
</script>

<template>
  <div class="position-relative">
    <div class="input-group mb-2">
      <span class="input-group-text bg-body">
        <Icon class="text-primary" name="solar:map-point-favourite-bold" size="2rem" />
      </span>
      <div class="form-floating position-relative">
        <input v-model.trim="text" class="form-control" :placeholder="t('location')" required :disabled="selected">
        <label>{{ t("location") }}</label>
      </div>
      <button v-if="selected" class="btn btn-primary" type="button" @click="changeLocation">
        <Icon name="tabler:x" size="1.5rem" />
      </button>
    </div>
    <ul v-if="search && text" class="geosearch bg-body position-absolute top-100 rounded-bottom border py-2 px-0 shadow w-100 m-0">
      <li v-if="loading">
        <SpinnerCircle small />
      </li>
      <template v-else>
        <li v-for="(result, index) of array" :key="index" role="button" class="py-2 px-3 hover border-bottom" @click="select(result)">
          {{ result["label"] }}
        </li>
      </template>
    </ul>
  </div>
</template>
