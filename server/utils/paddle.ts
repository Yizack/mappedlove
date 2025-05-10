import type { IAdjustmentResponse, ISubscriptionResponse, ITransactionResponse, TransactionInvoicePDF } from "@paddle/paddle-node-sdk";

const baseURL = import.meta.dev ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

export class Paddle {
  private paddleFetch: typeof $fetch;

  constructor (secret: string) {
    this.paddleFetch = $fetch.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${secret}`
      }
    });
  }

  async getPaddleTransaction (transactionId: string) {
    return this.paddleFetch<PaddleResponse<ITransactionResponse>>(`/transactions/${transactionId}`).catch(() => null);
  }

  async getPaddleSubscription (subscriptionId: string) {
    return this.paddleFetch<PaddleResponse<ISubscriptionResponse>>(`/subscriptions/${subscriptionId}`).catch(() => null);
  }

  async getPaddleTransactions (subscriptionId: string, after?: string) {
    return this.paddleFetch<PaddleResponsePaginated<ITransactionResponse>>("/transactions", {
      query: {
        per_page: 30, // default: 30; maximum: 30
        subscription_id: [subscriptionId],
        origin: ["web", "subscription_recurring", "subscription_payment_method_change", "subscription_update"],
        after
      }
    }).catch(() => null);
  }

  async getPaddleTransactionInvoice (transactionId: string) {
    return this.paddleFetch<PaddleResponse<TransactionInvoicePDF>>(`/transactions/${transactionId}/invoice`).catch(() => null);
  }

  async getPaddleAdjustments (subscriptionId: string) {
    return this.paddleFetch<PaddleResponsePaginated<IAdjustmentResponse>>("/adjustments", {
      query: {
        subscription_id: [subscriptionId]
      }
    }).catch(() => null);
  }
}
