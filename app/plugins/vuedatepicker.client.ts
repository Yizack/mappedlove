import VueDatePicker from "@vuepic/vue-datepicker";

declare module "vue" {
  interface GlobalComponents {
    VueDatePicker: typeof VueDatePicker;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VueDatePicker", VueDatePicker);
});
