<template>
  <div id="modal" ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ t("marker") }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitMarker()">
            <p>{{ t("location_info") }}</p>
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
              <select v-model="form.group" class="form-select" :placeholder="t('group')" required>
                <option value="" disabled>{{ t("select_group") }}</option>
                <option v-for="group of $nuxt.payload.data.groups" :key="group.id" :value="group.id">{{ t(group.name) }}</option>
              </select>
              <label>{{ t("group") }}</label>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="submitted">
                <SpinnerCircle v-if="submitted" class="text-light" />
                <span v-else>{{ edit ? t("edit_marker") : t("add_marker") }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    marker: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["close", "submit"],
  data () {
    return {
      submitted: false,
      edit: false,
      location: "",
      form: {
        lat: null as number | null,
        lng: null as number | null,
        group: "" as number | string,
        title: "",
        description: "",
        order: 0
      }
    };
  },
  mounted () {
    if (this.marker.id) {
      this.edit = true;
      this.form.lat = this.marker.lat;
      this.form.lng = this.marker.lng;
      this.form.title = this.marker.title;
      this.form.description = this.marker.description;
      this.form.group = this.marker.group;
      this.form.order = this.marker.order;
      this.location = `${this.marker.lat}, ${this.marker.lng}`;
    }
    const modal = this.$nuxt.$bootstrap.showModal(this.$refs.modal as HTMLElement);
    modal.addEventListener("hidden.bs.modal", () => {
      this.$emit("close", this.form);
    });
  },
  methods: {
    selectLocation ({ lat, lng, label }: { lat: number, lng: number, label: string }) {
      this.form.lat = lat;
      this.form.lng = lng;
      this.form.title = label;
    },
    async submitMarker () {
      if (typeof this.form.lat === "number" && typeof this.form.lng === "number") {
        this.submitted = true;
        const marker = await $fetch(this.edit ? `/api/markers/${this.marker.id}` : "/api/markers", {
          method: this.edit ? "PATCH" : "POST",
          body: this.form
        }).catch(() => ({}));
        this.submitted = false;
        if (!("id" in marker)) return;
        this.$emit("submit", { marker, edit: this.edit });
        this.$nuxt.$bootstrap.hideModal(this.$refs.modal as HTMLElement);
      }
    }
  }
};
</script>
