import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import Modal from "bootstrap/js/dist/modal";
import Toast from "bootstrap/js/dist/toast";

class Bootstrap {
  hideModal (id: string | HTMLElement) {
    const instance = Modal.getInstance(id);
    if (instance) {
      instance.hide();
    }
  }

  showModal (id: HTMLElement) {
    const modal = new Modal(id);
    modal.show();
    return id;
  }

  showToast (id: HTMLElement) {
    const toast = new Toast(id);
    toast.show();
    return id;
  }
}

const bootstrap = new Bootstrap();

export default defineNuxtPlugin(() => {
  return {
    provide: { bootstrap }
  };
});
