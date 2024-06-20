import type { H3Event, HTTPHeaderName } from "h3";
import type { ITransactionResponse, ISubscriptionResponse, TransactionOrigin, TransactionInvoicePDF, IAdjustmentResponse } from "@paddle/paddle-node-sdk";

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

const extractHeaders = (header: string) => {
  const parts = header.split(";");
  let ts = "";
  let h1 = "";
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (value) {
      if (key === "ts") ts = value;
      else if (key === "h1") h1 = value;
    }
  }
  if (!(ts && h1)) return null;
  return { ts: parseInt(ts), h1 };
};

export const isValidPaddleWebhook = async (event: H3Event, headers: Partial<Record<HTTPHeaderName, string | undefined>>, body?: string) => {
  const { webhookId } = useRuntimeConfig(event).paddle;
  const paddleSignature = headers["paddle-signature"];
  if (!body || !paddleSignature) return false;

  const signatureHeaders = extractHeaders(paddleSignature);
  if (!signatureHeaders) return false;
  const { ts: webhookTimestamp, h1: webhookSignature } = signatureHeaders;
  if (new Date().getTime() > new Date((webhookTimestamp + 5) * 1000).getTime()) return false;

  const payloadWithTime = `${webhookTimestamp}:${body}`;
  const encoder = new TextEncoder();
  const algorithm = { name: "HMAC", hash: "SHA-256" };

  const key = await crypto.subtle.importKey("raw", encoder.encode(webhookId), algorithm, false, ["sign"]);
  const hmac = await crypto.subtle.sign(algorithm.name, key, encoder.encode(payloadWithTime));

  const computedHash = Buffer.from(hmac).toString("hex");

  return computedHash === webhookSignature;
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

export const getPaddleAdjustments = async (event: H3Event, subscriptionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;

  const adjustments = await $fetch<{ data: IAdjustmentResponse[] }>(`${baseAPI}/adjustments?subscription_id=${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!adjustments) return null;

  return adjustments.data;
};
