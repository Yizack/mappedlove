<template>
  <div id="modal" ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ t("marker") }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <form>
            <p>{{ t("location_info") }}</p>
            <GeoSearch class="mb-2" @select="selectLocation($event)" />
            <div class="form-floating mb-2">
              <input v-model="form.title" type="text" class="form-control" :placeholder="t('title')">
              <label>{{ t("title") }}</label>
            </div>
            <div class="form-floating mb-2">
              <textarea v-model="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{height: '100px'}" />
              <label>{{ t("description") }}</label>
            </div>
            <div class="form-floating mb-2">
              <select v-model="form.group" class="form-select" :placeholder="t('group')">
                <option :value="0" disabled>{{ t("select_group") }}</option>
                <option v-for="group of $nuxt.payload.data.groups" :key="group.id" :value="group.id">{{ t(group.name) }}</option>
              </select>
              <label>{{ t("group") }}</label>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
              <button type="submit" class="btn btn-primary btn-lg w-100">{{ t("add_marker") }}</button>
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
  emits: ["close"],
  data () {
    return {
      form: {
        location: "",
        lat: 0,
        lng: 0,
        group: 0,
        title: "",
        description: "",
        order: 0
      }
    };
  },
  mounted () {
    const modal = this.$nuxt.$bootstrap.showModal(this.$refs.modal as HTMLElement);
    modal.addEventListener("hidden.bs.modal", () => {
      this.$emit("close", this.form);
    });
  },
  methods: {
    selectLocation (event: any) {
      this.form.lat = event.y;
      this.form.lng = event.x;
    }
  }
};
</script>
