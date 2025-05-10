<script setup lang="ts">
import { useOffsetPagination } from "@vueuse/core";

const props = withDefaults(defineProps<{
  max?: number;
  total: number;
  pageSize: number;
  scrollToTop?: boolean;
  addToQuery?: boolean;
}>(), {
  max: 4
});

const currentPage = defineModel<number>({ default: 1, required: true });

type PaginationEvent = { currentPage: number, currentPageSize: number };
const emit = defineEmits<{
  pageChange: [PaginationEvent];
  pageSizeChange: [PaginationEvent];
}>();

const { prev, next, isFirstPage, isLastPage, pageCount, currentPageSize } = useOffsetPagination({
  total: computed(() => props.total),
  page: currentPage,
  pageSize: props.pageSize,
  onPageChange: p => emit("pageChange", p),
  onPageSizeChange: p => emit("pageSizeChange", p)
});

if (currentPage.value > pageCount.value || currentPage.value < 1) currentPage.value = 1;

const goToPage = (page: number) => {
  currentPage.value = page;
};

const pages = computed(() => {
  const visibleButtons = [];
  const max = props.max;
  const half = Math.floor(max / 2);

  const start = Math.max(1, Math.min(currentPage.value - half, pageCount.value - max + 1));
  const end = Math.min(pageCount.value, start + max - 1);

  for (let i = start; i <= end; i++) {
    visibleButtons.push(i);
  }

  return visibleButtons;
});

const { path } = useRoute();

if (props.addToQuery) {
  watch(currentPage, () => {
    const currentQuery = Object.fromEntries(new URLSearchParams(window.location.search));
    const url = withQuery(path, {
      ...currentQuery,
      p: currentPage.value > 1 ? currentPage.value : undefined
    });
    window.history.replaceState({}, "", url);
    if (props.scrollToTop) window.scrollTo({ top: 0 });
  });
}

watch(() => props.pageSize, () => {
  currentPageSize.value = props.pageSize;
});
</script>

<template>
  <nav v-if="pageCount > 1 && pageCount < Infinity" aria-label="Page navigation">
    <ul class="pagination pagination-sm m-0">
      <!-- First -->
      <li v-if="currentPage > max - 1" class="page-item">
        <a href="?p=1" class="page-link" aria-label="First" type="button" :disabled="isFirstPage" @click.prevent="goToPage(1)">
          <Icon name="tabler:chevrons-left" size="1em" />
        </a>
      </li>
      <!-- Previous -->
      <li v-if="currentPage > 1" class="page-item">
        <a :href="`?p=${currentPage - 1}`" class="page-link" aria-label="Previous" type="button" :disabled="isFirstPage" @click.prevent="prev">
          <Icon name="tabler:chevron-left" size="1em" />
        </a>
      </li>
      <!-- Between -->
      <li v-for="page in pages" :key="page" class="page-item">
        <a :href="`?p=${page}`" type="button" class="page-link" :class="{ active: currentPage == page }" @click.prevent="goToPage(page)">
          <span class="fw-bold">{{ page }}</span>
        </a>
      </li>
      <!-- ... -->
      <li v-if="currentPage < pageCount - max % 2 - (currentPage % 2 ? 1 : 0) - 1 && pageCount - 1 > max" class="page-item">
        <span class="page-link bg-transparent">...</span>
      </li>
      <!-- Last -->
      <li v-if="currentPage < pageCount - max % 2 - (currentPage % 2 ? 0 : 1) && pageCount > max" class="page-item">
        <a :href="`?p=${pageCount}`" class="page-link" aria-label="Next" type="button" :disabled="isLastPage" @click.prevent="goToPage(pageCount)">
          <span class="fw-bold">{{ pageCount }}</span>
        </a>
      </li>
      <!-- Next -->
      <li v-if="currentPage < pageCount" class="page-item">
        <a :href="`?p=${currentPage + 1}`" class="page-link" aria-label="Next" type="button" :disabled="isLastPage" @click.prevent="next">
          <Icon name="tabler:chevron-right" size="1em" />
        </a>
      </li>
    </ul>
  </nav>
</template>
