interface Toast {
  message: string;
  success?: boolean;
  id?: number;
}

class Toasts {
  toasts: Ref<Toast[]> = ref([]);
  id = 1;
  add (toast: Toast) {
    toast.success ??= true;
    this.toasts.value.unshift({ ...toast, id: this.id++ });
  }

  remove (toast: Toast) {
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
