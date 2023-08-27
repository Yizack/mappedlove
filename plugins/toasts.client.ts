class Toasts {
  toasts: Ref<MappedLoveToast[]> = ref([]);
  id = 1;
  add(toast: MappedLoveToast) {
    this.toasts.value.push({ id: this.id++, ...toast });
  }

  remove(toast: MappedLoveToast) {
    this.toasts.value.splice(this.toasts.value.indexOf(toast), 1);
  }

  removeAll() {
    this.toasts.value = [];
  }

  getAll() {
    return this.toasts.value;
  }
}

const toasts = new Toasts();

export default defineNuxtPlugin(() => {
  return {
    provide: { toasts }
  };
});
