import type { H3Event, HTTPHeaderName } from "h3";
import { Webhooks, type ITransactionResponse, type ISubscriptionResponse, type TransactionOrigin, type TransactionInvoicePDF } from "@paddle/paddle-node-sdk";

const baseAPI = import.meta.dev ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

export const getPaddleTransaction = async (event: H3Event, transactionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;

  const transaction = await $fetch<{ data: ITransactionResponse }>(`${baseAPI}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!transaction) return null;

  return transaction.data;
};

export const getPaddleSubscription = async (event: H3Event, subscriptionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;

  const subscription = await $fetch<{ data: ISubscriptionResponse }>(`${baseAPI}/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!subscription) return null;

  return subscription.data;
};

export const isValidPaddleWebhook = (event: H3Event, headers: Partial<Record<HTTPHeaderName, string | undefined>>, body?: string) => {
  const { webhookId } = useRuntimeConfig(event).paddle;
  const webhooks = new Webhooks();
  const signature = headers["paddle-signature"];
  if (!body || !signature) return false;
  return webhooks.isSignatureValid(body.toString(), webhookId, signature);
};

export const getPaddleTransactions = async (event: H3Event, subscriptionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;
  const origins: TransactionOrigin[] = ["web", "subscription_recurring", "subscription_payment_method_change", "subscription_update"];
  const query = new URLSearchParams({
    subscription_id: subscriptionId,
    origin: origins.join(",")
  });

  const transaction = await $fetch<{ data: ITransactionResponse[] }>(`${baseAPI}/transactions?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!transaction) return null;

  return transaction.data;
};

export const getPaddleTransactionInvoice = async (event: H3Event, transactionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;

  const invoice = await $fetch<{ data: TransactionInvoicePDF }>(`${baseAPI}/transactions/${transactionId}/invoice`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!invoice) return null;

  return invoice.data;
};
