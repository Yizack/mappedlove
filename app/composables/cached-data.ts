import type { NuxtApp } from "#app";

/* eslint-disable @typescript-eslint/no-explicit-any */
const cachedData: Record<string, Ref<any>> = ({});

export const useCachedData = <T = any>(key: string, getValue?: () => T): Ref<T> => {
  const isFunction = typeof getValue === "function";

  if (!cachedData[key]) {
    cachedData[key] = ref(isFunction ? getValue() : undefined);
  }
  else if (isFunction) {
    cachedData[key].value = getValue();
  }

  return cachedData[key];
};

export const setupCachedData = <T>(key: string, nuxtApp: NuxtApp): T => {
  const cachedData = useCachedData(key);

  if (cachedData.value) {
    return cachedData.value;
  }

  const data = nuxtApp.payload.data[key];

  if (data) {
    useCachedData(key, () => data);
  }
  else {
    watch(() => nuxtApp.payload.data[key], (newValue) => {
      cachedData.value = newValue;
    });
  }

  return data;
};
