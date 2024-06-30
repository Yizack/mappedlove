class Toasts {
  toasts: Ref<MappedLoveToast[]> = ref([]);
  id = 1;
  add (toast: MappedLoveToast) {
    this.toasts.value.unshift({ ...toast, id: this.id++ });
  }

  remove (toast: MappedLoveToast) {
    this.toasts.value.splice(this.toasts.value.indexOf(toast), 1);
  }

  removeAll () {
    this.toasts.value.splice(0, this.toasts.value.length);
  }

  getAll () {
    return this.toasts.value;
  }
}

declare module "#app" {
  interface NuxtApp {
    $toasts: Toasts;
  }
}

export default defineNuxtPlugin(() => {
  const toasts = new Toasts();
  return {
    provide: { toasts }
  };
});
