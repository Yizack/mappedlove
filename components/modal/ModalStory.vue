<template>
  <div id="modal" ref="modal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="smodalLabel" class="modal-title fs-5">{{ t("story") }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitStory()">
            <div class="d-flex align-items-center gap-2 mb-2">
              <Icon name="solar:info-circle-linear" class="text-primary flex-shrink-0" />
              <p class="m-0">{{ t("story_info") }}</p>
            </div>
            <div class="form-floating mb-2">
              <textarea v-model.trim="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{height: '100px'}" />
              <label>{{ t("description") }}</label>
            </div>
            <div class="d-flex gap-2">
              <div class="form-floating mb-2 flex-grow-1">
                <select v-model.number="form.year" class="form-select" required>
                  <option value="0">{{ t("year") }}</option>
                  <option v-for="(year, i) in years" :key="i">{{ year }}</option>
                </select>
                <label>{{ t("year") }}</label>
              </div>
              <div class="form-floating mb-2 flex-grow-1">
                <select v-model.number="form.month" class="form-select" required>
                  <option value="0">{{ t("month") }}</option>
                  <option v-for="(month, i) in months" :key="i">{{ t(month) }}</option>
                </select>
                <label>{{ t("month") }}</label>
              </div>
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
      default: () => (0)
    },
    storyId: {
      type: Number,
      default: () => (0)
    }
  },
  emits: ["close", "submit"],
  data () {
    return {
      story: this.$nuxt.payload.data.map.stories.find((story: MappedLoveStory) => story.marker === this.markerId && story.id === this.storyId) as MappedLoveStory | undefined,
      submitted: false,
      location: "",
      form: {
        marker: this.markerId,
        description: "",
        image: 0,
        year: 0,
        month: 0,
      }
    };
  },
  mounted () {
    if (this.story) this.form = this.story;
    const modal = this.$nuxt.$bootstrap.showModal(this.$refs.modal as HTMLElement);
    modal.addEventListener("hidden.bs.modal", () => {
      this.$emit("close", this.form);
    });
  },
  methods: {
    async submitStory () {
      this.submitted = true;
      const story = await $fetch(this.story ? `/api/stories/${this.story.id}` : "/api/stories", {
        method: this.story ? "PATCH" : "POST",
        body: this.form
      });
      this.submitted = false;
      if (!("id" in story)) return;
      this.$emit("submit", { story, edit: Boolean(this.story) });
      this.$nuxt.$bootstrap.hideModal(this.$refs.modal as HTMLElement);
    }
  }
};
</script>
