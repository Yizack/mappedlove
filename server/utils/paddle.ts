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
    const transaction = await this.paddleFetch<PaddleResponse<ITransactionResponse>>(`/transactions/${transactionId}`).catch(() => null);
    return transaction && transaction.data;
  }

  async getPaddleSubscription (subscriptionId: string) {
    const subscription = await this.paddleFetch<PaddleResponse<ISubscriptionResponse>>(`/subscriptions/${subscriptionId}`).catch(() => null);
    return subscription && subscription.data;
  }

  async getPaddleTransactions (subscriptionId: string) {
    const transactions = await this.paddleFetch<PaddleResponsePaginated<ITransactionResponse>>("/transactions", {
      query: {
        // perPage: 30, // Transactions: Default: 30; Maximum: 30.
        subscription_id: [subscriptionId],
        origin: ["web", "subscription_recurring", "subscription_payment_method_change", "subscription_update"]
      }
    }).catch(() => null);
    // TODO: Implement pagination
    return transactions && transactions.data;
  }

  async getPaddleTransactionInvoice (transactionId: string) {
    const invoice = await this.paddleFetch<PaddleResponse<TransactionInvoicePDF>>(`/transactions/${transactionId}/invoice`).catch(() => null);
    return invoice && invoice.data;
  }

  async getPaddleAdjustments (subscriptionId: string) {
    const adjustments = await this.paddleFetch<PaddleResponsePaginated<IAdjustmentResponse>>("/adjustments", {
      query: {
        subscription_id: [subscriptionId]
      }
    }).catch(() => null);
    // TODO: Implement pagination
    return adjustments && adjustments.data;
  }
}
