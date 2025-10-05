// @ts-expect-error no types from html-to-text
import { convert } from "html-to-text";
import type { AllowedComponentProps, VNodeProps } from "vue";
import type AccountData from "~~/emails/AccountData.vue";
import type AccountRecovery from "~~/emails/AccountRecovery.vue";
import type AccountVerify from "~~/emails/AccountVerify.vue";
import type PremiumSummary from "~~/emails/PremiumSummary.vue";
import type PremiumWelcome from "~~/emails/PremiumWelcome.vue";

interface EmailTemplates {
  AccountData: typeof AccountData;
  AccountRecovery: typeof AccountRecovery;
  AccountVerify: typeof AccountVerify;
  PremiumSummary: typeof PremiumSummary;
  PremiumWelcome: typeof PremiumWelcome;
}

type ExtractComponentProps<TComponent>
  = TComponent extends new () => {
    $props: infer P;
  }
    ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
    : never;

export const renderEmail = async <T extends keyof EmailTemplates>(
  templateName: T,
  props?: ExtractComponentProps<EmailTemplates[T]>
) => {
  const html: string = await renderEmailComponent(templateName, props);

  const text: string = convert(html, {
    selectors: [
      { selector: "img", format: "skip" }
    ]
  });

  return { html, text };
};
