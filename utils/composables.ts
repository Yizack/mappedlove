export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const form = ref({ ...initialState }) as Ref<T>;

  function formReset () {
    form.value = { ...initialState };
  }

  return { form, formReset };
};
