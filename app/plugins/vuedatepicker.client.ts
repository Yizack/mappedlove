import dp from "@vuepic/vue-datepicker";
import type { App, Plugin } from "vue";

const component = dp;
type VueDatePickerComponent = typeof component;
type VueDatePickerPlugin = VueDatePickerComponent & Plugin;

declare module "vue" {
  export interface GlobalComponents {
    VueDatePicker: VueDatePickerComponent;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const VueDatePicker: VueDatePickerPlugin = ((): VueDatePickerPlugin => {
    const installable = component as VueDatePickerPlugin;
    installable.install = (app: App) => app.component("VueDatePicker", installable);
    return installable;
  })();

  nuxtApp.vueApp.use(VueDatePicker);
});
