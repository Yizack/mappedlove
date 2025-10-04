import type * as EmailComponents from "../../node_modules/nuxt-email-renderer/dist/runtime/components/index";

type EmailComponentMap = {
  [K in keyof typeof EmailComponents]: typeof EmailComponents[K];
};

declare module "vue" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GlobalComponents extends EmailComponentMap {}
}

export {};
