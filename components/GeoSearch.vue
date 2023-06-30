<template>
  <div class="position-relative">
    <div class="form-floating position-relative">
      <Icon class="position-absolute top-50 start-0 mx-2 translate-middle-y text-primary" name="solar:map-point-favourite-bold" size="2rem" />
      <input v-model="text" class="ps-5 form-control" :placeholder="t('location')" required @input="searchPlace($event.target)">
      <label class="ps-5 ms-1">{{ t("location") }}</label>
    </div>
    <ul v-if="search && text" class="geosearch bg-body position-absolute top-100 rounded-bottom border py-2 px-0 shadow w-100 m-0">
      <li v-if="loading">
        <SpinnerCircle small />
      </li>
      <template v-else>
        <li v-for="(result, index) in array" :key="index" role="button" class="py-2 px-3 hover border-bottom" @click="select(result)">
          {{ result["label"] }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  emits: ["select"],
  data () {
    return {
      search: false,
      array: [] as any[],
      text: "",
      loading: false
    };
  },
  methods: {
    select (result: any) {
      this.search = false;
      this.$emit("select", result);
    },
    searchPlace (target: any) {
      this.loading = true;
      this.search = true;
      const time = 2000;
      if (!target.value) {
        return debounce("geosearch", () => {
          this.loading = false;
          this.array = [];
        }, time);
      }
      debounce("geosearch", async () => {
        try {
          const { user } = useUserSession();
          this.array = await this.$nuxt.$Leaflet.geoSearch(target.value, {
            email: user.value.email,
            lang: "en"
          });
          this.loading = false;
        }
        catch {
          this.array = [];
          this.loading = false;
        }
      }, time);
    }
  }
};
</script>
