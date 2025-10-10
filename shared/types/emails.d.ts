type EmailComponentMap = {
  EBody: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/body/EBody.vue").default;
  EButton: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/button/EButton.vue").default;
  ECodeBlock: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/code-block/ECodeBlock.vue").default;
  ECodeInline: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/code-inline/ECodeInline.vue").default;
  EColumn: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/column/EColumn.vue").default;
  EContainer: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/container/EContainer.vue").default;
  EFont: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/font/EFont.vue").default;
  EHead: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/head/EHead.vue").default;
  EHeading: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/heading/EHeading.vue").default;
  EHr: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/hr/EHr.vue").default;
  EHtml: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/html/EHtml.vue").default;
  EImg: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/img/EImg.vue").default;
  ELink: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/link/ELink.vue").default;
  EPreview: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/preview/EPreview.vue").default;
  ERow: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/row/ERow.vue").default;
  ESection: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/section/ESection.vue").default;
  EStyle: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/style/EStyle.vue").default;
  EText: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/text/EText.vue").default;
  EMarkdown: typeof import("../../node_modules/nuxt-email-renderer/dist/runtime/components/markdown/EMarkdown.vue").default;
};

declare module "vue" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface GlobalComponents extends EmailComponentMap {}
}

export {};
