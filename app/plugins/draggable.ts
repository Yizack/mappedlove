import { VueDraggableNext } from "vue-draggable-next";

declare module "vue" {
  interface GlobalComponents {
    Draggable: typeof VueDraggableNext;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Draggable", VueDraggableNext);
});
