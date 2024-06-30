import { initializePaddle, type Paddle as P, type CheckoutEventsData, type CheckoutCustomer } from "@paddle/paddle-js";

class Paddle {
  private paddle?: P;
  constructor (private options: { token: string, plan: string }) {
    this.options = options;
  }

  async initialize (options: { onCompleted: (data?: CheckoutEventsData) => Promise<void>, onError?: () => void }) {
    const { $colorMode } = useNuxtApp();

    this.paddle = await initializePaddle({
      environment: import.meta.dev ? "sandbox" : "production",
      token: this.options.token,
      checkout: {
        settings: {
          allowLogout: true,
          displayMode: "overlay",
          theme: $colorMode.value as "light" | "dark",
          locale: "en",
          frameTarget: "checkout-container",
          frameInitialHeight: 450,
          frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          allowedPaymentMethods: ["card", "paypal", "apple_pay", "google_pay"]
        }
      },
      eventCallback: async (event) => {
        if (!event.name && options.onError) options.onError();
        switch (event.name) {
          case "checkout.loaded":
            console.info("Checkout opened");
            break;
          case "checkout.customer.created":
            console.info("Customer created");
            break;
          case "checkout.completed":
            await options.onCompleted(event.data);
            break;
          default:
            console.info(event);
        }
      }
    });

    if (!this.paddle) {
      throw createError({
        statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: t("paddle_sdk_not_loaded"),
        fatal: true
      });
    }
  }

  async Checkout (checkout: { customer?: CheckoutCustomer, customData?: Record<string, string | number | boolean> }) {
    const items = [{ priceId: this.options.plan, quantity: 1 }];
    this.paddle?.Checkout.open({
      items,
      customer: checkout.customer,
      customData: checkout.customData
    });
  }

  close () {
    this.paddle?.Checkout.close();
  }
}

declare module "#app" {
  interface NuxtApp {
    $paddle: Paddle;
  }
}

export default defineNuxtPlugin(async () => {
  const { clientId, planId } = useRuntimeConfig().public.paddle;

  const paddle = new Paddle({
    token: clientId,
    plan: planId
  });

  return {
    provide: { paddle }
  };
});
