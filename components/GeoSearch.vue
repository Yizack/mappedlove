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
const array = ref<SearchResult<unknown>[]>([]);
const text = ref("");
const loading = ref(false);
const selected = ref(false);

const select = (result: Record<string, unknown>) => {
  search.value = false;
  text.value = `${result.y}, ${result.x}`;
  emit("select", { lat: result.y, lng: result.x, label: result.label });
  selected.value = true;
};

const changeLocation = () => {
  text.value = "";
  selected.value = false;
  emit("select", { lat: null, lng: null, label: "" });
};

const searchPlace = (event: Event) => {
  const target = event.target as HTMLInputElement;
  loading.value = true;
  search.value = true;
  const time = 2000;
  if (!target.value) {
    emit("select", { lat: null, lng: null, label: "" });
    return debounce("geosearch", () => {
      loading.value = false;
      array.value = [];
    }, time);
  }
  debounce("geosearch", async () => {
    try {
      const { user } = useUserSession();
      array.value = await $Leaflet.geoSearch(target.value, {
        email: user.value.email,
        lang: "en"
      });
      loading.value = false;
    }
    catch {
      array.value = [];
      loading.value = false;
    }
  }, time);
};

onMounted(() => {
  if (!props.value) return;
  text.value = props.value;
  selected.value = true;
});
</script>

<template>
  <div class="position-relative">
    <div class="input-group mb-2">
      <div class="form-floating position-relative">
        <Icon class="position-absolute top-50 start-0 mx-2 translate-middle-y text-primary z-3" name="solar:map-point-favourite-bold" size="2rem" />
        <input v-model.trim="text" class="ps-5 form-control" :placeholder="t('location')" required :disabled="selected" @input="searchPlace">
        <label class="ps-5 ms-1">{{ t("location") }}</label>
      </div>
      <button v-if="selected" class="btn btn-primary" type="button" @click="changeLocation"><Icon name="ic:round-close" size="1.5rem" /></button>
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
