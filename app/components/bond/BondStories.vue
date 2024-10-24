<script setup lang="ts">
const props = defineProps({
  marker: {
    type: Object as () => MappedLoveSelectedMarker,
    default: () => null
  }
});

const emit = defineEmits(["new", "delete"]);
const { $toasts } = useNuxtApp();
const { user } = useUserSession() as MappedLoveSessionComposable;

const deleteButton = ref<Record<number, boolean>>({});

const deleteStory = async (id: number) => {
  if (!confirm(t("delete_story"))) return;
  const res = await $fetch(`/api/stories/${id}`, {
    method: "DELETE"
  }).catch(() => null);
  if (!res) return;
  emit("delete", id);
  $toasts.add({ message: t("story_deleted") });
};

const submitted = ref(false);
const supported = "PNG, JPG, WEBP, GIF";
const imageRead = ref<string | ArrayBuffer>("");
const storyController = useModalController("story");
const fileChosen = ref(false);
const file = ref<File>();
const maxFileSize = computed(() => {
  const size = user.value.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  return size.replace("MB", t("mb"));
});

const form = useFormState({
  id: 0 as number | undefined,
  hash: "" as string | undefined,
  marker: props.marker.id,
  description: "" as string | null,
  year: "" as number | string,
  month: 0,
  updatedAt: 0 as number | undefined
});

const storyModal = (story?: MappedLoveStory) => {
  if (!story) {
    form.reset();
    form.value.marker = props.marker.id;
  }
  else form.value = { ...story, hash: story.hash };
  storyController.value.show();
};

const addImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files ? target.files[0] : undefined;
  if (!file.value) {
    imageRead.value = "";
    fileChosen.value = false;
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = () => {
    imageRead.value = reader.result || "";
    fileChosen.value = true;
  };
};

const submitStory = async () => {
  if (!fileChosen.value && !form.value.id) {
    $toasts.add({ message: t("photo_needed"), success: false });
    return;
  }
  submitted.value = true;
  const formData = new FormData();
  formData.append("marker", form.value.marker.toString());
  formData.append("description", form.value.description || "");
  formData.append("year", form.value.year.toString());
  formData.append("month", form.value.month.toString());
  if (file.value) formData.append("file", file.value);
  const story = await $fetch(form.value.id ? `/api/stories/${form.value.id}` : "/api/stories", {
    method: form.value.id ? "PATCH" : "POST",
    body: formData
  }).catch(() => null);
  submitted.value = false;
  if (!story) return;
  emit("new", { story, edit: Boolean(form.value.id) });
  $toasts.add({ message: form.value.id ? t("story_updated") : t("story_added") });
  storyController.value.hide();
};

watch(() => props.marker, () => {
  form.value.marker = props.marker.id;
  fileChosen.value = false;
  imageRead.value = "";
  file.value = undefined;
});
</script>

<template>
  <div class="position-relative d-flex align-items-center gap-2 mb-2">
    <Icon class="text-primary" name="solar:chat-square-like-bold" size="2rem" />
    <h2 class="m-0">{{ t("stories") }}</h2>
    <Transition name="bounce">
      <ButtonAdd v-if="marker.id" @click="storyModal()" />
    </Transition>
  </div>
  <Transition name="tab-left" mode="out-in">
    <h4 v-if="marker.id && animate">{{ marker.title }}</h4>
  </Transition>
  <Transition name="fade" mode="out-in">
    <p v-if="!marker.id" class="m-0">{{ t("select_marker_story") }}</p>
    <p v-else-if="!marker.stories.length" class="m-0">{{ t("no_stories") }}</p>
    <div v-else-if="animate">
      <div id="accordionStories" class="accordion accordion-flush">
        <div v-for="(year, i) of yearsFromStories(marker.stories)" :key="i" class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button rounded-3 px-3" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse-${i}`" aria-expanded="false" aria-controls="flush-collapseOne"><h5 class="m-0">{{ year }}</h5></button>
          </h2>
          <div :id="`flush-collapse-${i}`" class="accordion-collapse py-2 show">
            <MasonryWall :items="storiesByYear(marker.stories, year)" :ssr-columns="1" :gap="8" :max-columns="4" :column-width="200">
              <template #default="{ item: story }">
                <div class="card h-100" @mouseenter="deleteButton[story.id] = true" @mouseleave="deleteButton[story.id] = false">
                  <div role="button" class="overflow-hidden scale-hover">
                    <img :src="`${getStoryImage(story.hash!)}?updated=${story.updatedAt}`" class="card-img-top" @click="storyModal(story)">
                  </div>
                  <div v-if="story.description" class="card-body border-top">
                    <p class="card-text">{{ story.description }}</p>
                  </div>
                  <div class="card-footer">
                    <small class="text-body-secondary">
                      <span>{{ story.year }}</span>
                      <span v-if="story.month">, {{ t(months[story.month - 1]!) }}</span>
                    </small>
                  </div>
                  <Transition name="fade">
                    <button v-if="deleteButton[story.id]" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" @click="deleteStory(story.id)">
                      <Icon name="solar:trash-bin-trash-linear" size="1.5rem" />
                    </button>
                  </Transition>
                </div>
              </template>
            </MasonryWall>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <ModalController id="story" v-model="storyController" :title="t('story')">
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
        <textarea v-model.trim="form.description" type="text" class="form-control" :placeholder="t('description')" :style="{ height: '100px' }" />
        <label>{{ t("description") }}</label>
      </div>
      <div class="mb-2 py-2 px-3 image-upload border rounded">
        <p class="text-muted mb-1">{{ t("photo") }} <span class="text-danger">*</span></p>
        <input id="image" type="file" accept=".png,.jpg,.jpeg,.jfif,.webp,.gif" @change="addImage">
        <label for="image" class="rounded bg-body-tertiary position-relative overflow-hidden w-100 border text-center">
          <div class="overlay position-absolute bg-body-secondary w-100 h-100">
            <div class="d-flex flex-column justify-content-center align-items-center h-100">
              <Icon class="text-primary" name="solar:gallery-add-outline" size="2.5rem" />
              <span>({{ t("max") }} {{ maxFileSize }})</span>
              <small>{{ supported }}</small>
            </div>
          </div>
          <div v-if="!fileChosen && !form.id" class="d-flex flex-column justify-content-center align-items-center py-3">
            <Icon name="solar:gallery-add-outline" size="2.5rem" />
            <span>({{ t("max") }} {{ maxFileSize }})</span>
            <small>{{ supported }}</small>
          </div>
          <img v-else-if="form.id && !imageRead" class="img-fluid" :src="`${getStoryImage(form.hash!)}?updated=${form.updatedAt}`">
          <img v-else class="img-fluid" :src="imageRead.toString()">
        </label>
      </div>
      <div class="d-flex justify-content-between gap-2">
        <button type="button" class="btn btn-secondary btn-lg w-100" data-bs-dismiss="modal">{{ t("cancel") }}</button>
        <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="submitted">
          <SpinnerCircle v-if="submitted" class="text-light" />
          <span v-else>{{ form.id ? t("edit_story") : t("add_story") }}</span>
        </button>
      </div>
    </form>
  </ModalController>
</template>
