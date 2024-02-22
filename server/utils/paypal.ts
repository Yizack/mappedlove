import type { H3Event, HTTPHeaderName } from "h3";

const { clientId } = useRuntimeConfig().public.paypal;
const baseAPI = "https://api-m.paypal.com/v1";

export const isValidPayPalWebhook = async (event: H3Event, headers: Partial<Record<HTTPHeaderName, string | undefined>>, data: PayPalWebhookEvent ) => {
  const { secret } = useRuntimeConfig(event).paypal;
  const basicAuth = btoa(`${clientId}:${secret}`);
  const endpoint = `${baseAPI}/notifications/verify-webhook-signature`;

  const response = await $fetch<{ verification_status: string; }>(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`
    },
    body: {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: data.id,
      webhook_event: data
    }
  }).catch(() => null);

  if (!response) return false;

  return response.verification_status === "SUCCESS";
};

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
