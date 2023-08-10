<template>
  <div class="position-relative d-flex align-items-center gap-2 mb-2">
    <Icon class="text-primary" name="solar:chat-square-like-bold" size="2rem" />
    <h2 class="m-0">{{ t("stories") }}</h2>
    <Transition name="bounce">
      <ButtonAdd v-if="marker.id" @click="storyModal = true" />
    </Transition>
  </div>
  <Transition name="tab-left" mode="out-in">
    <h4 v-if="marker.id && animate">{{ marker.title }}</h4>
  </Transition>
  <Transition name="fade" mode="out-in">
    <p v-if="!marker.id" class="m-0">{{ t("select_marker_story") }}</p>
    <p v-else-if="!stories.length" class="m-0">{{ t("no_stories") }}</p>
    <div v-else-if="animate">
      <div id="accordionStories" class="accordion accordion-flush">
        <div v-for="(year, i) in yearsFromStories(stories)" :key="i" class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button rounded-3 px-3" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-collapse-${i}`" aria-expanded="false" aria-controls="flush-collapseOne"><h5 class="m-0">{{ year }}</h5></button>
          </h2>
          <div :id="`flush-collapse-${i}`" class="accordion-collapse py-2 show">
            <MasonryWall :items="storiesByYear(stories, year)" :ssr-columns="1" :gap="8" :max-columns="4" :column-width="200">
              <template #default="{ item: story }">
                <div class="card h-100">
                  <img :src="`${getStoryImageFromUser(story.id)}?updated=${story.updatedAt}`" class="card-img-top" alt="..." role="button" @click="openStory(story)">
                  <div v-if="story.description" class="card-body border-top">
                    <p class="card-text">{{ story.description }}</p>
                  </div>
                  <div class="card-footer">
                    <small class="text-body-secondary">
                      <span>{{ story.year }}</span>
                      <span v-if="story.month">, {{ t(months[story.month - 1]) }}</span>
                    </small>
                  </div>
                </div>
              </template>
            </MasonryWall>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <ModalStory v-if="storyModal" :marker-id="marker.id" :story="currentStory" @close="closeModal" @submit="$emit('newStory', $event)" />
</template>

<script lang="ts">
export default {
  props: {
    marker: {
      type: Object as () => MappedLoveMarker,
      default: () => null
    },
    stories: {
      type: Array as () => MappedLoveStory[],
      default: () => []
    },
  },
  emits: ["newStory"],
  data () {
    return {
      storyModal: false,
      currentStory: null as MappedLoveStory | null,
    };
  },
  methods: {
    closeModal () {
      this.storyModal = false;
    },
    openStory (story: MappedLoveStory) {
      this.currentStory = story;
      this.storyModal = true;
    }
  }
};
</script>
