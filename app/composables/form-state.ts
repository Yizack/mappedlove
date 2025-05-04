export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const data = ref<T>({ ...initialState });
  const methods = {
    /**
     * Reset all fields or specific fields
     * @param fields
     */
    reset (...fields: (keyof T)[]) {
      if (!fields.length) {
        data.value = { ...initialState };
        return;
      }
      for (const field of fields) {
        data.value[field] = initialState[field];
      }
    }
  };
  Object.assign(data, methods);
  return data as Ref<T> & typeof methods;
};
