<template>
  <div id="modal" ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ t("story") }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitStory">
            <div class="d-flex align-items-center gap-2 mb-2">
              <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
              <p class="m-0">{{ t("story_info") }}</p>
            </div>
            <div class="d-flex gap-2">
              <div class="form-floating mb-2 flex-grow-1">
                <select v-model.number="form.year" class="form-select" required>
                  <option value="">{{ t("year") }}</option>
                  <option v-for="(year, i) of years" :key="i">{{ year }}</option>
                </select>
                <label>{{ t("year") }} <span class="text-danger">*</span></label>
              </div>
              <div class="form-floating mb-2 flex-grow-1">
                <select v-model.number="form.month" class="form-select" required>
                  <option value="0">{{ t("month") }}</option>
                  <option v-for="(month, i) of months" :key="i" :value="i + 1">{{ t(month) }}</option>
                </select>
                <label>{{ t("month") }}</label>
              </div>
            </div>
            <div class="form-floating mb-2">
              <textarea v-model.trim="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{height: '100px'}" />
              <label>{{ t("description") }}</label>
            </div>
            <div class="mb-2 py-2 px-3 image-upload border rounded">
              <p class="text-muted mb-1">{{ t("photo") }} <span class="text-danger">*</span></p>
              <input id="image" type="file" accept=".png,.jpg,.jpeg,.jfif,.webp,.gif" @change="addImage">
              <label for="image" class="rounded bg-body-tertiary position-relative overflow-hidden w-100 border">
                <div class="overlay position-absolute bg-body-secondary w-100 h-100">
                  <div class="d-flex flex-column justify-content-center align-items-center h-100">
                    <Icon class="text-primary " name="solar:gallery-add-outline" size="2.5rem" />
                    <span>({{ t("mb_max") }})</span>
                    <small>{{ supported }}</small>
                  </div>
                </div>
                <div v-if="!fileChosen && !form.id" class="d-flex flex-column justify-content-center align-items-center py-3">
                  <Icon name="solar:gallery-add-outline" size="2.5rem" />
                  <span>({{ t("mb_max") }})</span>
                  <small>{{ supported }}</small>
                </div>
                <img v-else-if="form.id && !imageRead" class="img-fluid" :src="`${getStoryImageFromUser(form.id)}?updated=${form.updatedAt}`">
                <img v-else class="img-fluid" :src="imageRead.toString()">
              </label>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="submitted">
                <SpinnerCircle v-if="submitted" class="text-light" />
                <span v-else>{{ story ? t("edit_story") : t("add_story") }}</span>
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
    markerId: {
      type: Number,
      default: () => 0
    },
    story: {
      type: Object as () => MappedLoveStory | null,
      default: () => null
    }
  },
  emits: ["close", "submit"],
  data () {
    return {
      submitted: false,
      location: "",
      supported: "PNG, JPG, WEBP, GIF",
      imageRead: "" as string | ArrayBuffer,
      fileChosen: false,
      form: {
        id: 0 as number | undefined,
        marker: this.markerId,
        description: "",
        year: "" as number | string,
        month: 0,
        updatedAt: 0 as number | undefined,
      },
      file: null as File | null
    };
  },
  mounted () {
    if (this.story) Object.assign(this.form, this.story);
    const modal = this.$nuxt.$bootstrap.showModal(this.$refs.modal as HTMLElement);
    modal.addEventListener("hidden.bs.modal", () => {
      this.$emit("close", this.form);
    });
  },
  methods: {
    addImage (event: Event) {
      const target = event.target as HTMLInputElement;
      this.file = target.files ? target.files[0] : null;
      if (!this.file) return;
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageRead = reader.result || "";
      };
      this.fileChosen = true;
    },
    async submitStory () {
      if (!this.fileChosen && !this.form.id) {
        this.$nuxt.$toasts.add({ message: t("photo_needed"), success: false });
        return;
      }
      this.submitted = true;
      const formData = new FormData();
      formData.append("marker", this.form.marker.toString());
      formData.append("description", this.form.description);
      formData.append("year", this.form.year.toString());
      formData.append("month", this.form.month.toString());
      if (this.file) formData.append("file", this.file);
      const story = await $fetch(this.story ? `/api/stories/${this.story.id}` : "/api/stories", {
        method: this.story ? "PATCH" : "POST",
        body: formData
      }).catch(() => ({}));
      this.submitted = false;
      if (!("id" in story)) return;
      this.$emit("submit", { story, edit: Boolean(this.story) });
      this.$nuxt.$bootstrap.hideModal(this.$refs.modal as HTMLElement);
    }
  }
};
</script>
