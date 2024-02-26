import type { PayPalWebhook } from "~/types/enums/paypal";
export {};

declare global {
  type PayPalWebhookEvent = PaymentSaleCompletedEvent;

  interface PayPalWebhookBody<T extends string, R> {
    id: string;
    create_time: string;
    resource_type: string;
    event_type: T;
    summary: string;
    resource: R;
    links: PayPalLink[];
    event_version: string;
  }

  interface PaymentSaleCompletedEvent extends PayPalWebhookBody<"PAYMENT.SALE.COMPLETED", PaymentSaleCompletedResource> {
    resource: {
      id: string;
      state: string;
      amount: PayPalAmount;
      payment_mode: string;
      protection_eligibility: string;
      protection_eligibility_type: string;
      transaction_fee: PayPalBalance;
      invoice_id?: string;
      custom?: string;
      billing_agreement_id: string;
      parent_payment?: string;
      update_time: string;
      soft_descriptor?: string;
    }
  }

  interface PayPalAmount {
    total: string;
    currency: string;
    details: {
      subtotal: string;
      tax?: string;
      shipping?: string;
      handling_fee?: string;
      shipping_discount?: string;
    };
  }

  interface PayPalBalance {
    value: string;
    currency: string;
  }

  interface PayPalLink {
    href: string;
    rel: string;
    method: string;
  }

  interface PayPalSubscription {
    status: string;
    status_update_time: string;
    id: string;
    plan_id: string;
    start_time: string;
    quantity: string;
    shipping_amount: PayPalBalance;
    subscriber: {
      email_address: string;
      payer_id: string;
      name: {
        given_name: string;
        surname: string;
      };
      shipping_address: {
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: string;
        }
      };
    };
    billing_info: {
      outstanding_balance: PayPalBalance;
      cycle_executions: {
        tenure_type: string;
        sequence: number;
        cycles_completed: number;
        cycles_remaining: number;
        current_pricing_scheme_version: number;
        total_cycles: number;
      }[];
      next_billing_time: string;
      failed_payments_count: number;
    };
    create_time: string;
    update_time: string;
    custom_id: string;
    plan_overridden: boolean;
    links: PayPalLink[];
  }

  type PayPalWebhook = typeof PayPalWebhook;
}
