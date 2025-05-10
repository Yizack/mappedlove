export const usePagination = <T>(
  items: MaybeRef<T[]>,
  config: {
    currentPage?: MaybeRef<number>;
    pageSize: MaybeRef<number>;
    total?: MaybeRef<number>;
  }
) => {
  const itemsRef = toRef(items);
  const reactiveConfig = reactive(config);
  const { pageSize } = toRefs(reactiveConfig);
  const currentPage = ref(reactiveConfig.currentPage || 1);

  const { query } = useRoute();
  const p = Number(query.p);
  if (p) currentPage.value = p;

  const total = computed(() => reactiveConfig.total ?? itemsRef.value.length);

  const data = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = currentPage.value * pageSize.value;
    return itemsRef.value.slice(start, end);
  });

  // Display info
  const display = computed(() => {
    const pageCount = Math.ceil(total.value / pageSize.value);
    const isInRange = currentPage.value > 0 && currentPage.value <= pageCount;
    return {
      total: total.value,
      from: isInRange ? (currentPage.value - 1) * pageSize.value + 1 : 0,
      to: isInRange ? Math.min(currentPage.value * pageSize.value, total.value) : 0
    };
  });

  return reactive({
    config: { currentPage, pageSize, total },
    data,
    display
  });
};
