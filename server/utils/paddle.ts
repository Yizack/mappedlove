import type { H3Event } from "h3";
import type { ITransactionResponse, ISubscriptionResponse } from "@paddle/paddle-node-sdk";

const baseAPI = process.dev ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

export const getPaddleSubscription = async (event: H3Event, transactionId: string) => {
  const { secret } = useRuntimeConfig(event).paddle;

  const transaction = await $fetch<{ data: ITransactionResponse }>(`${baseAPI}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!transaction) return null;
  const subscription = await $fetch<{ data: ISubscriptionResponse }>(`${baseAPI}/subscriptions/${transaction.data.subscription_id}`, {
    headers: {
      Authorization: `Bearer ${secret}`
    }
  }).catch(() => null);

  if (!subscription) return null;

  return subscription.data;
};
