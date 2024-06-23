import type { H3Event } from "h3";

const { clientId } = useRuntimeConfig().public.paypal;
const baseAPI = import.meta.dev ? "https://api-m.sandbox.paypal.com/v1" : "https://api-m.paypal.com/v1";

export const getPayPalSubscription = async (event: H3Event, subscriptionId: string) => {
  const { secret } = useRuntimeConfig(event).paypal;
  const basicAuth = btoa(`${clientId}:${secret}`);

  const subscription = await $fetch<PayPalSubscription>(`${baseAPI}/billing/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Basic ${basicAuth}`
    }
  }).catch(() => null);

  return subscription;
};
