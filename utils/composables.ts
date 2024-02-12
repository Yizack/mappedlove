export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const form = ref({ ...initialState }) as Ref<T>;

  function formReset () {
    form.value = { ...initialState };
  }

  return { form, formReset };
};

export const useModalController = async (id: string, show?: (value: boolean) => void) => {
  const { $bootstrap } = useNuxtApp();
  if (show) show(true);
  await sleep(100);
  const element = $bootstrap.showModal(id);
  if (!element) return;
  if (show) {
    const hideEvent = () => {
      show(false);
      element.removeEventListener("hidden.bs.modal", hideEvent);
    };
    element.addEventListener("hidden.bs.modal", hideEvent);
  }
};
