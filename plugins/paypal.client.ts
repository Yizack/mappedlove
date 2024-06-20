import { loadScript } from "@paypal/paypal-js";

class PayPal {
  constructor (public clientId: string, public planId: string) {
    this.clientId = clientId;
    this.planId = planId;
  }

  async loadScript () {
    const script = await loadScript({
      locale: t("lang_locale"),
      clientId: this.clientId,
      vault: true,
      intent: "subscription"
    }).catch(() => null);

    if (!script) {
      throw createError({
        statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: t("paypal_sdk_not_loaded"),
        fatal: true
      });
    }

    return script;
  }
}

export default defineNuxtPlugin(async () => {
  const { clientId, planId } = useRuntimeConfig().public.paypal;
  const paypal = new PayPal(clientId, planId);
  return {
    provide: { paypal }
  };
});
