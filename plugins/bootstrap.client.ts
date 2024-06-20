import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/tooltip";
import "bootstrap/js/dist/collapse";
import Offcanvas from "bootstrap/js/dist/offcanvas";
import Popover from "bootstrap/js/dist/popover";
import Carousel from "bootstrap/js/dist/carousel";
import Modal from "bootstrap/js/dist/modal";
import Toast from "bootstrap/js/dist/toast";

class Bootstrap {
  modals = ref<{ id: string, show: boolean }[]>([]);
  hideModal (id: HTMLElement | string) {
    const idModal = typeof id === "string" ? `#${id}` : id;
    const instance = Modal.getInstance(idModal);
    if (instance) {
      instance.hide();
    }
  }

  hideAllModals () {
    const modals = document.querySelectorAll(".modal.show");
    for (const modal of modals) {
      const instance = Modal.getInstance(modal);
      if (instance) instance.hide();
    }
  }

  hideModalEscEvent () {
    document.addEventListener("keyup", (e) => {
      if (e.key !== "Escape") return;
      const modals = document.querySelectorAll(".modal.show");
      if (!modals.length) return;
      const id = modals[modals.length - 1].id;
      const instance = Modal.getInstance("#" + id);
      if (instance) instance.hide();
    });
  }

  showModal (id: Element | string) {
    const element = typeof id === "string" ? document.querySelector(`#${id}`) : id;
    if (!element) return;
    const instance = Modal.getInstance(element);
    if (instance) {
      instance.show();
      return element;
    }
    const modal = new Modal(element);
    modal.show();
    return element;
  }

  showToast (id: HTMLElement) {
    const instance = Toast.getInstance(id);
    if (instance) return;
    const toast = new Toast(id);
    toast.show();
    return id;
  }

  startAllCarousel () {
    const carousels = document.querySelectorAll(".carousel");
    for (const carousel of carousels) {
      const carouselInstance = new Carousel(carousel);
      carouselInstance.cycle();
    }
  }

  initializePopover () {
    const popoverList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    [...popoverList].map(e => new Popover(e, { trigger: "focus" }));
  }

  showOffcanvas (id: HTMLElement) {
    const instance = Offcanvas.getInstance(id);
    if (instance) {
      instance.show();
      return id;
    }
    const offcanvas = new Offcanvas(id);
    offcanvas.show();
    return id;
  }

  hideOffcanvas (id: HTMLElement) {
    const instance = Offcanvas.getInstance(id);
    if (instance) {
      instance.hide();
    }
  }
}

export default defineNuxtPlugin(() => {
  const bootstrap = new Bootstrap();
  return {
    provide: { bootstrap }
  };
});
