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
            <GeoSearch class="mb-3" @select="selectLocation($event)" />
            <div class="d-flex justify-content-between gap-2">
              <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
              <button type="submit" class="btn btn-primary w-100">{{ t("add_marker") }}</button>
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
        position: [] as number[]
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
      const lat = event.y;
      const lng = event.x;
      this.form.position = [lat, lng];
    }
  }
};
</script>
